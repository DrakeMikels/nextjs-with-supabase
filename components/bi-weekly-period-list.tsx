"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2 } from "lucide-react";
import { AnimatedContainer, AnimatedItem } from "@/components/ui/animated-container";
import * as motion from "motion/react-client";

interface BiWeeklyPeriod {
  id: string;
  start_date: string;
  end_date: string;
  period_name: string;
  created_at: string;
}

interface BiWeeklyPeriodListProps {
  periods: BiWeeklyPeriod[];
  selectedPeriod: BiWeeklyPeriod | null;
  onSelectPeriod: (period: BiWeeklyPeriod) => void;
  onPeriodsChange: (periods: BiWeeklyPeriod[]) => void;
  onOpenPeriod?: (period: BiWeeklyPeriod) => void;
}

export function BiWeeklyPeriodList({ 
  periods, 
  selectedPeriod, 
  onSelectPeriod, 
  onPeriodsChange,
  onOpenPeriod
}: BiWeeklyPeriodListProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const deletePeriod = async (periodId: string) => {
    if (!confirm("Are you sure you want to delete this period? This will also delete all associated safety metrics.")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("bi_weekly_periods")
        .delete()
        .eq("id", periodId);

      if (error) throw error;

      const updatedPeriods = periods.filter(p => p.id !== periodId);
      onPeriodsChange(updatedPeriods);
      
      if (selectedPeriod?.id === periodId) {
        onSelectPeriod(updatedPeriods[0] || null);
      }
    } catch (error) {
      console.error("Error deleting period:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const isCurrentPeriod = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return today >= start && today <= end;
  };

  return (
    <AnimatedContainer variant="stagger" className="space-y-4">
      <AnimatedItem className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-high-contrast">Bi-Weekly Periods</h2>
        <motion.div 
          className="text-sm text-medium-contrast"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            scale: { type: "spring", stiffness: 200, damping: 15 }
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="font-bold text-lg text-brand-olive"
          >
            {periods.length}
          </motion.span> period{periods.length !== 1 ? 's' : ''} total
        </motion.div>
      </AnimatedItem>

      <AnimatedContainer variant="stagger" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {periods.map((period, index) => (
          <motion.div
            key={period.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.1 + (index * 0.1),
              scale: { type: "spring", stiffness: 200, damping: 15 }
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md hover-lift ${
                selectedPeriod?.id === period.id 
                  ? "ring-2 ring-primary border-primary" 
                  : "border-brand-olive/20 hover:border-brand-olive/40"
              }`}
              onClick={() => onSelectPeriod(period)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-high-contrast">{period.period_name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {isCurrentPeriod(period.start_date, period.end_date) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + (index * 0.1),
                          scale: { type: "spring", stiffness: 300, damping: 20 }
                        }}
                      >
                        <Badge variant="default">Current</Badge>
                      </motion.div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePeriod(period.id);
                      }}
                      disabled={loading}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2 text-medium-contrast">
                  <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.3 + (index * 0.1),
                      rotate: { type: "spring", stiffness: 200, damping: 15 }
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                  </motion.div>
                  {formatDateRange(period.start_date, period.end_date)}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <motion.div 
                    className="text-sm text-medium-contrast"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.4 + (index * 0.1)
                    }}
                  >
                    Created: {new Date(period.created_at).toLocaleDateString()}
                  </motion.div>
                  {onOpenPeriod && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.5 + (index * 0.1),
                        scale: { type: "spring", stiffness: 200, damping: 15 }
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPeriod(period);
                        }}
                        className="text-xs hover-scale"
                      >
                        Open Period
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatedContainer>

      {periods.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-high-contrast">No Periods Found</CardTitle>
            <CardDescription className="text-medium-contrast">
              Create your first bi-weekly period to get started with tracking safety metrics.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </AnimatedContainer>
  );
} 