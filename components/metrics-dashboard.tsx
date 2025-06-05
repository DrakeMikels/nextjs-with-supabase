"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, AlertTriangle, TrendingUp, Search, Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";
import { AnimatedContainer, AnimatedItem, LoadingSpinner } from "@/components/ui/animated-container";
import type { BiWeeklyPeriod, Coach, SafetyMetric } from "@/lib/types";
import * as motion from "motion/react-client";

interface MetricsDashboardProps {
  periods: BiWeeklyPeriod[];
  coaches: Coach[];
  selectedPeriod: BiWeeklyPeriod | null;
  customDateRange: {start: string, end: string};
}

export function MetricsDashboard({ periods, coaches, selectedPeriod, customDateRange }: MetricsDashboardProps) {
  const [metrics, setMetrics] = useState<SafetyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const supabase = createClient();

  const fetchMetrics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("safety_metrics")
        .select(`
          *,
          coach:coaches(name),
          period:bi_weekly_periods(period_name, start_date, end_date)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Enhanced filtering logic that handles both period selection and custom date range
  const filteredMetrics = useMemo(() => {
    console.log('🔍 Filtering metrics:', {
      totalMetrics: metrics.length,
      selectedPeriod: selectedPeriod?.period_name,
      customDateRange,
      periodsCount: periods.length
    });

    let filtered = metrics;

    // If a specific period is selected, filter by that period
    if (selectedPeriod) {
      filtered = filtered.filter(m => m.period_id === selectedPeriod.id);
      console.log('📅 Filtered by selected period:', filtered.length);
    }
    // If custom date range is set, filter by date range instead
    else if (customDateRange.start && customDateRange.end) {
      const startDate = new Date(customDateRange.start);
      const endDate = new Date(customDateRange.end);
      
      console.log('📊 Filtering by date range:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      
      // Find periods that overlap with the custom date range
      const overlappingPeriods = periods.filter(period => {
        const periodStart = new Date(period.start_date);
        const periodEnd = new Date(period.end_date);
        const overlaps = (periodStart <= endDate && periodEnd >= startDate);
        
        console.log(`Period ${period.period_name}:`, {
          periodStart: periodStart.toISOString(),
          periodEnd: periodEnd.toISOString(),
          overlaps
        });
        
        return overlaps;
      });
      
      console.log('🎯 Overlapping periods:', overlappingPeriods.map(p => p.period_name));
      
      // Filter metrics by overlapping periods
      const overlappingPeriodIds = overlappingPeriods.map(p => p.id);
      filtered = filtered.filter(m => overlappingPeriodIds.includes(m.period_id));
      console.log('📊 Filtered by date range:', filtered.length);
    }

    console.log('✅ Final filtered metrics:', filtered.length);
    return filtered;
  }, [metrics, selectedPeriod, customDateRange, periods]);

  // Get filtered periods for trend analysis with enhanced logic
  const filteredPeriods = useMemo(() => {
    console.log('📈 Filtering periods for trends:', {
      selectedPeriod: selectedPeriod?.period_name,
      customDateRange,
      totalPeriods: periods.length
    });

    if (selectedPeriod) {
      // When a specific period is selected, show comparison with previous periods
      const currentIndex = periods.findIndex(p => p.id === selectedPeriod.id);
      const contextPeriods = periods.slice(Math.max(0, currentIndex - 2), currentIndex + 4).reverse();
      console.log('📅 Selected period - showing context periods:', contextPeriods.map(p => p.period_name));
      return contextPeriods;
    } else if (customDateRange.start && customDateRange.end) {
      // When custom date range is set, filter periods that overlap with the range
      const startDate = new Date(customDateRange.start);
      const endDate = new Date(customDateRange.end);
      
      const filtered = periods.filter(period => {
        const periodStart = new Date(period.start_date);
        const periodEnd = new Date(period.end_date);
        const overlaps = (periodStart <= endDate && periodEnd >= startDate);
        
        console.log(`Trend period ${period.period_name}:`, {
          periodStart: periodStart.toISOString(),
          periodEnd: periodEnd.toISOString(),
          overlaps
        });
        
        return overlaps;
      }).reverse(); // Show in chronological order for trends
      
      console.log('📊 Date range - filtered periods for trends:', filtered.map(p => p.period_name));
      return filtered;
    } else {
      // Show all periods (last 8 for better trend visibility)
      const result = periods.slice(0, 8).reverse();
      console.log('🌐 All periods - showing last 8:', result.map(p => p.period_name));
      return result;
    }
  }, [selectedPeriod, customDateRange, periods]);

  // Calculate time span context for adaptive chart configurations
  const timeSpanContext = useMemo(() => {
    const daysDifference = customDateRange.start && customDateRange.end 
      ? Math.ceil((new Date(customDateRange.end).getTime() - new Date(customDateRange.start).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    const periodCount = filteredPeriods.length;
    
    return {
      daysDifference,
      periodCount,
      isShortTerm: daysDifference <= 30 || periodCount <= 2,
      isMediumTerm: daysDifference > 30 && daysDifference <= 90 || (periodCount > 2 && periodCount <= 6),
      isLongTerm: daysDifference > 90 || periodCount > 6,
      chartHeight: periodCount <= 3 ? 300 : periodCount <= 6 ? 350 : 400,
      showDataLabels: periodCount <= 4,
      strokeWidth: periodCount <= 4 ? 4 : periodCount <= 6 ? 3 : 2,
      dotSize: periodCount <= 4 ? 6 : periodCount <= 6 ? 5 : 4
    };
  }, [customDateRange, filteredPeriods.length]);

  // Get the current filtering context for display
  const filteringContext = useMemo(() => {
    if (selectedPeriod) {
      return {
        title: `Current Period: ${selectedPeriod.period_name}`,
        subtitle: `${new Date(selectedPeriod.start_date).toLocaleDateString()} - ${new Date(selectedPeriod.end_date).toLocaleDateString()}`,
        type: 'period' as const
      };
    } else if (customDateRange.start && customDateRange.end) {
      return {
        title: 'Custom Date Range',
        subtitle: `${new Date(customDateRange.start).toLocaleDateString()} - ${new Date(customDateRange.end).toLocaleDateString()}`,
        type: 'dateRange' as const
      };
    } else {
      return {
        title: 'All Periods',
        subtitle: 'Comprehensive safety metrics analysis and trends across all periods',
        type: 'all' as const
      };
    }
  }, [selectedPeriod, customDateRange]);

  // Brand colors for charts - Consistent Olive Variations
  const brandColors = useMemo(() => ({
    olive: "#2C5134",        // Primary olive
    oliveLight: "#3D6B47",   // Lighter olive
    oliveMedium: "#4E855A",  // Medium olive
    oliveSoft: "#5F9F6D",    // Soft olive
    olivePale: "#70B980",    // Pale olive
    sorbet: "#FF6B35"        // Keep sorbet for accent only
  }), []);

  const overallStats = useMemo(() => {
    const totalEvaluations = filteredMetrics.reduce((sum, m) => sum + (m.site_safety_evaluations || 0), 0);
    const totalAudits = filteredMetrics.reduce((sum, m) => sum + (m.forensic_survey_audits || 0), 0);
    const totalWarehouseAudits = filteredMetrics.reduce((sum, m) => sum + (m.warehouse_safety_audits || 0), 0);
    const totalInvestigations = filteredMetrics.reduce((sum, m) => 
      sum + (m.open_investigations_injuries || 0) + (m.open_investigations_auto || 0) + 
      (m.open_investigations_property_damage || 0) + (m.open_investigations_near_miss || 0), 0);

    return {
      totalEvaluations,
      totalAudits,
      totalWarehouseAudits,
      totalInvestigations,
      avgEvaluationsPerPeriod: selectedPeriod ? totalEvaluations.toString() : (periods.length > 0 ? (totalEvaluations / periods.length).toFixed(1) : "0"),
      avgAuditsPerPeriod: selectedPeriod ? totalAudits.toString() : (periods.length > 0 ? (totalAudits / periods.length).toFixed(1) : "0")
    };
  }, [filteredMetrics, selectedPeriod, periods.length]);

  const coachPerformanceData = useMemo(() => {
    return coaches.map(coach => {
      const coachMetrics = filteredMetrics.filter(m => m.coach_id === coach.id);
      const totalEvaluations = coachMetrics.reduce((sum, m) => sum + (m.site_safety_evaluations || 0), 0);
      const totalAudits = coachMetrics.reduce((sum, m) => sum + (m.forensic_survey_audits || 0), 0);
      const totalWarehouseAudits = coachMetrics.reduce((sum, m) => sum + (m.warehouse_safety_audits || 0), 0);
      const totalInvestigations = coachMetrics.reduce((sum, m) => 
        sum + (m.open_investigations_injuries || 0) + (m.open_investigations_auto || 0) + 
        (m.open_investigations_property_damage || 0) + (m.open_investigations_near_miss || 0), 0);

      return {
        name: coach.name,
        evaluations: totalEvaluations,
        audits: totalAudits,
        warehouse: totalWarehouseAudits,
        investigations: totalInvestigations,
        periodsReported: coachMetrics.length
      };
    });
  }, [coaches, filteredMetrics]);

  const trendData = useMemo(() => {
    return filteredPeriods.map(period => {
      const periodMetrics = metrics.filter(m => m.period_id === period.id);
      return {
        period: period.period_name,
        evaluations: periodMetrics.reduce((sum, m) => sum + (m.site_safety_evaluations || 0), 0),
        audits: periodMetrics.reduce((sum, m) => sum + (m.forensic_survey_audits || 0), 0),
        warehouse: periodMetrics.reduce((sum, m) => sum + (m.warehouse_safety_audits || 0), 0),
        investigations: periodMetrics.reduce((sum, m) => 
          sum + (m.open_investigations_injuries || 0) + (m.open_investigations_auto || 0) + 
          (m.open_investigations_property_damage || 0) + (m.open_investigations_near_miss || 0), 0)
      };
    });
  }, [filteredPeriods, metrics]);

  const goalProgressData = useMemo(() => {
    // Calculate goals based on the filtering context
    let evaluationGoal, auditGoal, warehouseGoal;
    
    if (filteringContext.type === 'period') {
      // Single period goals (bi-weekly)
      evaluationGoal = 6;
      auditGoal = 6;
      warehouseGoal = 1;
    } else if (filteringContext.type === 'dateRange') {
      // Calculate goals based on the number of periods in the date range
      const periodCount = filteredPeriods.length;
      evaluationGoal = periodCount * 6; // 6 per bi-weekly period
      auditGoal = periodCount * 6; // 6 per bi-weekly period
      warehouseGoal = periodCount * 1; // 1 per bi-weekly period
    } else {
      // All periods - use monthly goals as baseline
      evaluationGoal = 12;
      auditGoal = 12;
      warehouseGoal = 2;
    }

    return [
      {
        name: "Site Evaluations",
        value: Math.min((overallStats.totalEvaluations / evaluationGoal) * 100, 100),
        goal: 100,
        fill: brandColors.olive
      },
      {
        name: "Forensic Audits", 
        value: Math.min((overallStats.totalAudits / auditGoal) * 100, 100),
        goal: 100,
        fill: brandColors.oliveLight
      },
      {
        name: "Warehouse Audits",
        value: Math.min((overallStats.totalWarehouseAudits / warehouseGoal) * 100, 100),
        goal: 100,
        fill: brandColors.oliveMedium
      }
    ];
  }, [overallStats, filteringContext.type, filteredPeriods.length, brandColors]);

  const getIndividualCoachTrend = useCallback((coach: Coach) => {
    return filteredPeriods.map(period => {
      const periodMetrics = metrics.filter(m => m.period_id === period.id && m.coach_id === coach.id);
      const metric = periodMetrics[0];
      return {
        period: period.period_name,
        evaluations: metric?.site_safety_evaluations || 0,
        audits: metric?.forensic_survey_audits || 0,
        warehouse: metric?.warehouse_safety_audits || 0,
        investigations: (metric?.open_investigations_injuries || 0) + 
                       (metric?.open_investigations_auto || 0) + 
                       (metric?.open_investigations_property_damage || 0) + 
                       (metric?.open_investigations_near_miss || 0)
      };
    });
  }, [filteredPeriods, metrics]);

  const investigationData = useMemo(() => {
    const injuries = filteredMetrics.reduce((sum, m) => sum + (m.open_investigations_injuries || 0), 0);
    const auto = filteredMetrics.reduce((sum, m) => sum + (m.open_investigations_auto || 0), 0);
    const property = filteredMetrics.reduce((sum, m) => sum + (m.open_investigations_property_damage || 0), 0);
    const nearMiss = filteredMetrics.reduce((sum, m) => sum + (m.open_investigations_near_miss || 0), 0);

    return [
      { name: "Injuries", value: injuries, fill: brandColors.olive },
      { name: "Auto", value: auto, fill: brandColors.oliveLight },
      { name: "Property Damage", value: property, fill: brandColors.oliveMedium },
      { name: "Near Miss", value: nearMiss, fill: brandColors.oliveSoft }
    ];
  }, [filteredMetrics, brandColors]);

  if (loading) {
    return (
      <AnimatedContainer variant="fadeIn" className="space-y-6">
        <LoadingSpinner />
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer variant="stagger" className="space-y-6">
      <AnimatedItem className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-olive">Analytics Dashboard</h2>
          <p className="text-medium-contrast">
            {filteringContext.title} - {filteringContext.subtitle}
          </p>
        </div>
        
        {/* Filtering Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            filteringContext.type === 'period' 
              ? 'bg-brand-olive/10 text-brand-olive border border-brand-olive/20'
              : filteringContext.type === 'dateRange'
              ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
              : 'bg-gray-500/10 text-gray-600 border border-gray-500/20'
          }`}>
            {filteringContext.type === 'period' 
              ? '📅 Single Period'
              : filteringContext.type === 'dateRange'
              ? '📊 Date Range'
              : '🌐 All Periods'
            }
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            timeSpanContext.isShortTerm 
              ? 'bg-green-500/10 text-green-600 border border-green-500/20'
              : timeSpanContext.isMediumTerm
              ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
              : 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
          }`}>
            {timeSpanContext.isShortTerm && '⚡ Short-term'}
            {timeSpanContext.isMediumTerm && '📈 Medium-term'}
            {timeSpanContext.isLongTerm && '🔍 Long-term'}
          </div>
        </div>
      </AnimatedItem>

      {/* Data Insights Section */}
      {(filteringContext.type === 'dateRange' || timeSpanContext.periodCount > 1) && (
        <AnimatedItem>
          <Card className="border-blue-500/20 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Data Insights</h3>
                  <p className="text-sm text-blue-700">
                    {timeSpanContext.isShortTerm && 
                      `Analyzing ${timeSpanContext.periodCount} period${timeSpanContext.periodCount > 1 ? 's' : ''} - ideal for detailed performance review and immediate action items.`
                    }
                    {timeSpanContext.isMediumTerm && 
                      `Reviewing ${timeSpanContext.periodCount} periods over ${timeSpanContext.daysDifference} days - perfect for identifying trends and patterns in safety performance.`
                    }
                    {timeSpanContext.isLongTerm && 
                      `Comprehensive analysis of ${timeSpanContext.periodCount} periods - excellent for strategic planning and long-term trend analysis.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedItem>
      )}

      {/* Overall Statistics Cards */}
      <AnimatedItem>
        <div className="grid gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total",
              subtitle: "Evaluations",
              value: filteredMetrics.reduce((sum, m) => sum + (m.site_safety_evaluations || 0), 0),
              description: filteringContext.type === 'period' ? "Current period" : filteringContext.type === 'dateRange' ? "Date range" : "All periods",
              icon: BarChart3,
              color: "brand-olive",
              delay: 0.1
            },
            {
              title: "Total",
              subtitle: "Audits", 
              value: filteredMetrics.reduce((sum, m) => sum + (m.forensic_survey_audits || 0), 0),
              description: filteringContext.type === 'period' ? "Current period" : filteringContext.type === 'dateRange' ? "Date range" : "All periods",
              icon: Search,
              color: "blue-600",
              delay: 0.2
            },
            {
              title: "Warehouse",
              subtitle: "Audits",
              value: filteredMetrics.reduce((sum, m) => sum + (m.warehouse_safety_audits || 0), 0),
              description: filteringContext.type === 'period' ? "Current period" : filteringContext.type === 'dateRange' ? "Date range" : "All periods", 
              icon: Package,
              color: "green-600",
              delay: 0.3
            },
            {
              title: "Open",
              subtitle: "Investigations",
              value: filteredMetrics.reduce((sum, m) => 
                sum + (m.open_investigations_injuries || 0) + (m.open_investigations_auto || 0) + 
                (m.open_investigations_property_damage || 0) + (m.open_investigations_near_miss || 0), 0),
              description: filteringContext.type === 'period' ? "Current period" : filteringContext.type === 'dateRange' ? "Date range" : "All periods",
              icon: AlertTriangle,
              color: "red-600",
              delay: 0.4
            }
          ].map((card) => (
            <motion.div
              key={card.title + card.subtitle}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.51,
                delay: card.delay,
                scale: { type: "spring", visualDuration: 0.51, bounce: 0.3 }
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.17, type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              <Card className={`border-${card.color}/20 hover:border-${card.color}/40 hover:shadow-lg transition-all duration-300 hover-lift`}>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-medium-contrast">
                        {card.title} {card.subtitle}
                      </p>
                      <motion.p 
                        className={`text-lg sm:text-xl lg:text-2xl font-bold text-${card.color}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.34,
                          delay: card.delay + 0.2,
                          scale: { type: "spring", visualDuration: 0.34, bounce: 0.4 }
                        }}
                      >
                        {card.value}
                      </motion.p>
                      <p className="text-xs text-medium-contrast">
                        {card.description}
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, rotate: -180, scale: 0 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      transition={{
                        duration: 0.43,
                        delay: card.delay + 0.1,
                        rotate: { type: "spring", stiffness: 200, damping: 15 },
                        scale: { type: "spring", visualDuration: 0.43, bounce: 0.4 }
                      }}
                    >
                      <card.icon className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-${card.color}/30`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedItem>

      {/* Charts Section */}
      <AnimatedItem className="grid gap-6 lg:grid-cols-2">
        {/* Goal Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-olive">🎯 Goal Progress</CardTitle>
            <CardDescription className="text-medium-contrast">
              {filteringContext.type === 'period' ? "Current period goal achievement" : "Monthly safety goals achievement"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={goalProgressData}>
                <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                <Legend 
                  iconSize={12}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Progress']}
                  labelStyle={{ color: '#2C5134', fontWeight: 'bold' }}
                  contentStyle={{ 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #2C5134',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Investigation Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-olive">🔍 Investigation Types</CardTitle>
            <CardDescription className="text-medium-contrast">
              {filteringContext.type === 'period' ? "Current period investigations" : "Breakdown of open investigations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={investigationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {investigationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  labelStyle={{ color: '#2C5134', fontWeight: 'bold' }}
                  contentStyle={{ 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #2C5134',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </AnimatedItem>

      {/* Performance Trends */}
      <AnimatedItem>
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-olive">📊 Performance Trends</CardTitle>
            <CardDescription className="text-medium-contrast">
              {filteringContext.type === 'period' 
                ? `Comparison with context periods (${timeSpanContext.periodCount} periods)` 
                : filteringContext.type === 'dateRange'
                ? `Safety metrics for ${timeSpanContext.periodCount} periods within ${filteringContext.subtitle} (${timeSpanContext.daysDifference} days)`
                : `Safety metrics over the last ${timeSpanContext.periodCount} bi-weekly periods`
              }
              {timeSpanContext.isShortTerm && " • Short-term view"}
              {timeSpanContext.isMediumTerm && " • Medium-term view"}
              {timeSpanContext.isLongTerm && " • Long-term view"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={timeSpanContext.chartHeight}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: timeSpanContext.periodCount > 6 ? 10 : 12, fill: '#2C5134' }}
                  tickLine={{ stroke: '#2C5134' }}
                  angle={timeSpanContext.periodCount > 6 ? -45 : 0}
                  textAnchor={timeSpanContext.periodCount > 6 ? "end" : "middle"}
                  height={timeSpanContext.periodCount > 6 ? 80 : 60}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#2C5134' }}
                  tickLine={{ stroke: '#2C5134' }}
                />
                <Tooltip 
                  labelStyle={{ color: '#2C5134', fontWeight: 'bold' }}
                  contentStyle={{ 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #2C5134',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="evaluations" 
                  stroke={brandColors.olive} 
                  strokeWidth={timeSpanContext.strokeWidth}
                  name="Site Evaluations"
                  dot={{ fill: brandColors.olive, strokeWidth: 2, r: timeSpanContext.dotSize }}
                  label={timeSpanContext.showDataLabels ? { fontSize: 10, fill: brandColors.olive } : false}
                />
                <Line 
                  type="monotone" 
                  dataKey="audits" 
                  stroke={brandColors.oliveLight} 
                  strokeWidth={timeSpanContext.strokeWidth}
                  name="Forensic Audits"
                  dot={{ fill: brandColors.oliveLight, strokeWidth: 2, r: timeSpanContext.dotSize }}
                  label={timeSpanContext.showDataLabels ? { fontSize: 10, fill: brandColors.oliveLight } : false}
                />
                <Line 
                  type="monotone" 
                  dataKey="warehouse" 
                  stroke={brandColors.oliveMedium} 
                  strokeWidth={timeSpanContext.strokeWidth}
                  name="Warehouse Audits"
                  dot={{ fill: brandColors.oliveMedium, strokeWidth: 2, r: timeSpanContext.dotSize }}
                  label={timeSpanContext.showDataLabels ? { fontSize: 10, fill: brandColors.oliveMedium } : false}
                />
                <Line 
                  type="monotone" 
                  dataKey="investigations" 
                  stroke={brandColors.oliveSoft} 
                  strokeWidth={timeSpanContext.strokeWidth}
                  name="Investigations"
                  dot={{ fill: brandColors.oliveSoft, strokeWidth: 2, r: timeSpanContext.dotSize }}
                  label={timeSpanContext.showDataLabels ? { fontSize: 10, fill: brandColors.oliveSoft } : false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </AnimatedItem>

      {/* Coach Performance Comparison */}
      <AnimatedItem>
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-olive">👥 Coach Performance Comparison</CardTitle>
            <CardDescription className="text-medium-contrast">
              {filteringContext.type === 'period' ? `Performance metrics for ${filteringContext.title} by coach` : "Total metrics across all periods by coach"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={coachPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#2C5134' }}
                  tickLine={{ stroke: '#2C5134' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#2C5134' }}
                  tickLine={{ stroke: '#2C5134' }}
                />
                <Tooltip 
                  labelStyle={{ color: '#2C5134', fontWeight: 'bold' }}
                  contentStyle={{ 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #2C5134',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                />
                <Bar dataKey="evaluations" fill={brandColors.olive} name="Site Evaluations" />
                <Bar dataKey="audits" fill={brandColors.oliveLight} name="Forensic Audits" />
                <Bar dataKey="warehouse" fill={brandColors.oliveMedium} name="Warehouse Audits" />
                <Bar dataKey="investigations" fill={brandColors.oliveSoft} name="Investigations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </AnimatedItem>

      {/* Individual Coach Analysis */}
      <AnimatedItem>
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-olive">🔍 Individual Coach Analysis</CardTitle>
            <CardDescription className="text-medium-contrast">Select a coach to view their detailed performance trends</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedCoach?.id || "overview"} onValueChange={(value) => {
              if (value === "overview") {
                setSelectedCoach(null);
              } else {
                const coach = coaches.find(c => c.id === value);
                setSelectedCoach(coach || null);
              }
            }}>
              <TabsList className="grid w-full grid-cols-8 mb-6">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                {coaches.map((coach) => (
                  <TabsTrigger key={coach.id} value={coach.id} className="text-xs">
                    {coach.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview">
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-brand-olive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-brand-olive mb-2">Select a Coach</h3>
                  <p className="text-medium-contrast">Choose a coach from the tabs above to view their individual performance trends and detailed analytics.</p>
                </div>
              </TabsContent>

              {coaches.map((coach) => (
                <TabsContent key={coach.id} value={coach.id}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="h-6 w-6 text-brand-olive" />
                      <div>
                        <h3 className="text-xl font-bold text-brand-olive">{coach.name}</h3>
                        <p className="text-sm text-medium-contrast">
                          Vacation: {coach.vacation_days_remaining}/{coach.vacation_days_total} days remaining
                        </p>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={timeSpanContext.chartHeight}>
                      <LineChart data={getIndividualCoachTrend(coach)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey="period" 
                          tick={{ fontSize: timeSpanContext.periodCount > 6 ? 10 : 12, fill: '#2C5134' }}
                          tickLine={{ stroke: '#2C5134' }}
                          angle={timeSpanContext.periodCount > 6 ? -45 : 0}
                          textAnchor={timeSpanContext.periodCount > 6 ? "end" : "middle"}
                          height={timeSpanContext.periodCount > 6 ? 80 : 60}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#2C5134' }}
                          tickLine={{ stroke: '#2C5134' }}
                        />
                        <Tooltip 
                          labelStyle={{ color: '#2C5134', fontWeight: 'bold' }}
                          contentStyle={{ 
                            backgroundColor: '#f8f9fa', 
                            border: '1px solid #2C5134',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="evaluations" 
                          stroke={brandColors.olive} 
                          strokeWidth={timeSpanContext.strokeWidth}
                          name="Site Evaluations"
                          dot={{ fill: brandColors.olive, strokeWidth: 2, r: timeSpanContext.dotSize }}
                          label={timeSpanContext.showDataLabels ? { fontSize: 10, fill: brandColors.olive } : false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="audits" 
                          stroke={brandColors.oliveLight} 
                          strokeWidth={timeSpanContext.strokeWidth}
                          name="Forensic Audits"
                          dot={{ fill: brandColors.oliveLight, strokeWidth: 2, r: timeSpanContext.dotSize }}
                          label={timeSpanContext.showDataLabels ? { fontSize: 10, fill: brandColors.oliveLight } : false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="warehouse" 
                          stroke={brandColors.oliveMedium} 
                          strokeWidth={timeSpanContext.strokeWidth}
                          name="Warehouse Audits"
                          dot={{ fill: brandColors.oliveMedium, strokeWidth: 2, r: timeSpanContext.dotSize }}
                          label={timeSpanContext.showDataLabels ? { fontSize: 10, fill: brandColors.oliveMedium } : false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="investigations" 
                          stroke={brandColors.oliveSoft} 
                          strokeWidth={timeSpanContext.strokeWidth}
                          name="Investigations"
                          dot={{ fill: brandColors.oliveSoft, strokeWidth: 2, r: timeSpanContext.dotSize }}
                          label={timeSpanContext.showDataLabels ? { fontSize: 10, fill: brandColors.oliveSoft } : false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </AnimatedItem>
    </AnimatedContainer>
  );
} 