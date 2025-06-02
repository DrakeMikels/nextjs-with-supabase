"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2 } from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-high-contrast">Bi-Weekly Periods</h2>
        <div className="text-sm text-medium-contrast">
          {periods.length} period{periods.length !== 1 ? 's' : ''} total
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {periods.map((period) => (
          <Card 
            key={period.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPeriod?.id === period.id 
                ? "ring-2 ring-primary border-primary" 
                : ""
            }`}
            onClick={() => onSelectPeriod(period)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-high-contrast">{period.period_name}</CardTitle>
                <div className="flex items-center gap-2">
                  {isCurrentPeriod(period.start_date, period.end_date) && (
                    <Badge variant="default">Current</Badge>
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
                <Calendar className="h-4 w-4" />
                {formatDateRange(period.start_date, period.end_date)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-medium-contrast">
                  Created: {new Date(period.created_at).toLocaleDateString()}
                </div>
                {onOpenPeriod && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPeriod(period);
                    }}
                    className="text-xs"
                  >
                    Open Period
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  );
} 