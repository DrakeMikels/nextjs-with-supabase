"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  PlusCircle, 
  Trash2, 
  Calendar,
  MapPin,
  Edit3,
  Building2
} from "lucide-react";
import { AnimatedContainer, AnimatedItem } from "@/components/ui/animated-container";
import type { Coach } from "@/lib/types";

interface BranchVisit {
  id: string;
  coach_id: string;
  branch_name: string;
  last_visit_date: string | null;
  created_at: string;
  updated_at: string;
  coach?: Coach;
}

interface BranchVisitsProps {
  coaches: Coach[];
  onDataChange: () => void;
}

export function BranchVisits({ coaches, onDataChange }: BranchVisitsProps) {
  const [branchVisits, setBranchVisits] = useState<BranchVisit[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingVisit, setEditingVisit] = useState<BranchVisit | null>(null);
  const [filterCoach, setFilterCoach] = useState<string>("all");
  const supabase = createClient();

  const [newVisit, setNewVisit] = useState({
    coach_id: '',
    branch_name: '',
    last_visit_date: ''
  });

  const fetchBranchVisits = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("branch_visits")
        .select(`
          *,
          coach:coaches(*)
        `)
        .order("branch_name");

      if (error) throw error;
      setBranchVisits(data || []);
    } catch (error) {
      console.error("Error fetching branch visits:", error);
    }
  }, [supabase]);

  useEffect(() => {
    fetchBranchVisits();
  }, [fetchBranchVisits]);

  const addBranchVisit = async () => {
    if (!newVisit.coach_id || !newVisit.branch_name.trim()) return;

    try {
      const { error } = await supabase
        .from("branch_visits")
        .insert({
          coach_id: newVisit.coach_id,
          branch_name: newVisit.branch_name,
          last_visit_date: newVisit.last_visit_date || null
        });

      if (error) throw error;

      setNewVisit({
        coach_id: '',
        branch_name: '',
        last_visit_date: ''
      });
      setShowAddDialog(false);
      await fetchBranchVisits();
      onDataChange();
    } catch (error) {
      console.error("Error adding branch visit:", error);
      alert("Failed to add branch assignment");
    }
  };

  const updateBranchVisit = async (visit: BranchVisit) => {
    try {
      const { error } = await supabase
        .from("branch_visits")
        .update({
          branch_name: visit.branch_name,
          last_visit_date: visit.last_visit_date
        })
        .eq("id", visit.id);

      if (error) throw error;

      setEditingVisit(null);
      await fetchBranchVisits();
      onDataChange();
    } catch (error) {
      console.error("Error updating branch visit:", error);
      alert("Failed to update branch assignment");
    }
  };

  const deleteBranchVisit = async (visitId: string) => {
    if (!confirm("Are you sure you want to remove this branch assignment?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("branch_visits")
        .delete()
        .eq("id", visitId);

      if (error) throw error;

      await fetchBranchVisits();
      onDataChange();
    } catch (error) {
      console.error("Error deleting branch visit:", error);
      alert("Failed to remove branch assignment");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never visited";
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString();
  };

  const getDaysSinceVisit = (dateString: string | null) => {
    if (!dateString) return null;
    const visitDate = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - visitDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getVisitStatusColor = (dateString: string | null) => {
    if (!dateString) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    const days = getDaysSinceVisit(dateString);
    if (!days) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    if (days <= 30) return 'bg-green-100 text-green-800 border-green-200';
    if (days <= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (days <= 90) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const filteredVisits = branchVisits.filter(visit => {
    const coachMatch = filterCoach === "all" || visit.coach_id === filterCoach;
    return coachMatch;
  });

  // Group visits by coach
  const visitsByCoach = filteredVisits.reduce((acc, visit) => {
    const coachId = visit.coach_id;
    if (!acc[coachId]) {
      acc[coachId] = [];
    }
    acc[coachId].push(visit);
    return acc;
  }, {} as Record<string, BranchVisit[]>);

  const totalBranches = branchVisits.length;
  const recentVisits = branchVisits.filter(visit => {
    if (!visit.last_visit_date) return false;
    const days = getDaysSinceVisit(visit.last_visit_date);
    return days !== null && days <= 30;
  }).length;
  const overdueVisits = branchVisits.filter(visit => {
    if (!visit.last_visit_date) return true;
    const days = getDaysSinceVisit(visit.last_visit_date);
    return days !== null && days > 90;
  }).length;

  return (
    <AnimatedContainer variant="stagger" className="space-y-6">
      <AnimatedItem className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-high-contrast">Branch Assignments</h2>
          <p className="text-medium-contrast">Track coach responsibilities and visit schedules</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2 hover-lift">
          <PlusCircle className="h-4 w-4" />
          Assign Branch
        </Button>
      </AnimatedItem>

      {/* Summary Cards */}
      <AnimatedItem>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-medium-contrast">Total Assignments</p>
                  <p className="text-2xl font-bold text-high-contrast">{totalBranches}</p>
                </div>
                <Building2 className="h-8 w-8 text-brand-olive" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-medium-contrast">Recent Visits</p>
                  <p className="text-2xl font-bold text-high-contrast">{recentVisits}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-medium-contrast">Overdue Visits</p>
                  <p className="text-2xl font-bold text-high-contrast">{overdueVisits}</p>
                </div>
                <Calendar className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-medium-contrast">Active Coaches</p>
                  <p className="text-2xl font-bold text-high-contrast">{Object.keys(visitsByCoach).length}</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedItem>

      {/* Filter */}
      <AnimatedItem>
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-lg">Filter by Coach</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterCoach} onValueChange={setFilterCoach}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coaches</SelectItem>
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>{coach.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </AnimatedItem>

      {/* Branch Assignments by Coach */}
      <AnimatedItem>
        <div className="space-y-6">
          {Object.entries(visitsByCoach).map(([coachId, visits]) => {
            const coach = coaches.find(c => c.id === coachId);
            if (!coach) return null;

            return (
              <Card key={coachId} className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-olive" />
                    {coach.name}
                    <Badge variant="outline" className="ml-auto">
                      {visits.length} branches
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {visits.map((visit) => (
                      <div
                        key={visit.id}
                        className="flex items-center justify-between p-3 border rounded hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-high-contrast truncate">{visit.branch_name}</h4>
                          <p className="text-sm text-medium-contrast">
                            Last visit: {formatDate(visit.last_visit_date)}
                          </p>
                          {visit.last_visit_date && (
                            <p className="text-xs text-medium-contrast">
                              {getDaysSinceVisit(visit.last_visit_date)} days ago
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <Badge className={`text-xs ${getVisitStatusColor(visit.last_visit_date)}`}>
                            {visit.last_visit_date ? 'Visited' : 'Pending'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingVisit(visit)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBranchVisit(visit.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {Object.keys(visitsByCoach).length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-high-contrast">No Branch Assignments Found</CardTitle>
                <CardDescription className="text-medium-contrast">
                  {branchVisits.length === 0 
                    ? "Create your first branch assignment to get started."
                    : "No assignments match the current filter."
                  }
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </AnimatedItem>

      {/* Add Branch Assignment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Branch to Coach</DialogTitle>
            <DialogDescription>
              Create a new branch assignment for a coach.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assign-coach">Coach</Label>
              <Select value={newVisit.coach_id} onValueChange={(value) => setNewVisit(prev => ({ ...prev, coach_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coach" />
                </SelectTrigger>
                <SelectContent>
                  {coaches.map((coach) => (
                    <SelectItem key={coach.id} value={coach.id}>{coach.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="branch-name">Branch Name</Label>
              <Input
                id="branch-name"
                value={newVisit.branch_name}
                onChange={(e) => setNewVisit(prev => ({ ...prev, branch_name: e.target.value }))}
                placeholder="e.g., Houston Branch"
              />
            </div>
            <div>
              <Label htmlFor="last-visit">Last Visit Date (Optional)</Label>
              <Input
                id="last-visit"
                type="date"
                value={newVisit.last_visit_date}
                onChange={(e) => setNewVisit(prev => ({ ...prev, last_visit_date: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addBranchVisit} disabled={!newVisit.coach_id || !newVisit.branch_name.trim()}>
              Assign Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Branch Assignment Dialog */}
      {editingVisit && (
        <Dialog open={!!editingVisit} onOpenChange={() => setEditingVisit(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Branch Assignment</DialogTitle>
              <DialogDescription>
                Update the branch assignment details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-branch-name">Branch Name</Label>
                <Input
                  id="edit-branch-name"
                  value={editingVisit.branch_name}
                  onChange={(e) => setEditingVisit(prev => prev ? { ...prev, branch_name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-last-visit">Last Visit Date</Label>
                <Input
                  id="edit-last-visit"
                  type="date"
                  value={editingVisit.last_visit_date || ''}
                  onChange={(e) => setEditingVisit(prev => prev ? { ...prev, last_visit_date: e.target.value || null } : null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingVisit(null)}>
                Cancel
              </Button>
              <Button onClick={() => updateBranchVisit(editingVisit)}>
                Update Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatedContainer>
  );
} 