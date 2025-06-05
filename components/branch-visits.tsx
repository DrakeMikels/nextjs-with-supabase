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
  Building2,
  Clock
} from "lucide-react";
import { AnimatedContainer, AnimatedItem } from "@/components/ui/animated-container";
import * as motion from "motion/react-client";
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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            x: { type: "spring", stiffness: 100, damping: 15 }
          }}
        >
          <Button onClick={() => setShowAddDialog(true)} className="gap-2 hover-lift">
            <PlusCircle className="h-4 w-4" />
            Assign Branch
          </Button>
        </motion.div>
      </AnimatedItem>

      {/* Summary Cards */}
      <AnimatedItem>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Assignments",
              value: totalBranches,
              icon: Building2,
              color: "brand-olive",
              delay: 0.1
            },
            {
              title: "Recent Visits",
              value: recentVisits,
              icon: Calendar,
              color: "green-500",
              delay: 0.2
            },
            {
              title: "Overdue Visits",
              value: overdueVisits,
              icon: Calendar,
              color: "red-500",
              delay: 0.3
            },
            {
              title: "Active Coaches",
              value: Object.keys(visitsByCoach).length,
              icon: MapPin,
              color: "blue-500",
              delay: 0.4
            }
          ].map((stat) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.51,
                delay: stat.delay,
                scale: { type: "spring", visualDuration: 0.51, bounce: 0.3 }
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.17, type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              <Card className="hover-lift border-brand-olive/20 hover:border-brand-olive/40 hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-medium-contrast">{stat.title}</p>
                      <motion.p 
                        className={`text-2xl font-bold text-${stat.color}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.43,
                          delay: stat.delay + 0.2,
                          scale: { type: "spring", visualDuration: 0.34, bounce: 0.4 }
                        }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, rotate: -180, scale: 0 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: stat.delay + 0.1,
                        rotate: { type: "spring", stiffness: 200, damping: 15 },
                        scale: { type: "spring", visualDuration: 0.5, bounce: 0.4 }
                      }}
                    >
                      <stat.icon className={`h-8 w-8 text-${stat.color}`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedItem>

      {/* Filter */}
      <AnimatedItem>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.6,
            y: { type: "spring", stiffness: 100, damping: 15 }
          }}
        >
          <Card className="hover-lift border-brand-olive/20 hover:border-brand-olive/30">
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
        </motion.div>
      </AnimatedItem>

      {/* Branch Assignments by Coach */}
      <AnimatedItem>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(visitsByCoach).map(([coachId, visits], coachIndex) => {
            const coach = coaches.find(c => c.id === coachId);
            if (!coach) return null;

            return (
              <motion.div
                key={coachId}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + (coachIndex * 0.1),
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.17, type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <Card className="h-full border-brand-olive/20 hover:border-brand-olive/40 hover:shadow-lg transition-all duration-300 hover-lift">
                  <CardHeader className="pb-2 p-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-high-contrast flex items-center gap-2">
                        <motion.div
                          initial={{ opacity: 0, rotate: -180 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          transition={{
                            duration: 0.43,
                            delay: 0.2 + (coachIndex * 0.1),
                            rotate: { type: "spring", stiffness: 200, damping: 15 }
                          }}
                        >
                          <MapPin className="h-4 w-4 text-brand-olive" />
                        </motion.div>
                        {coach.name}
                      </CardTitle>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.34,
                          delay: 0.3 + (coachIndex * 0.1),
                          scale: { type: "spring", visualDuration: 0.34, bounce: 0.4 }
                        }}
                      >
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          {visits.length}
                        </Badge>
                      </motion.div>
                    </div>
                    <CardDescription className="text-xs text-medium-contrast">
                      {visits.length} branch{visits.length !== 1 ? 'es' : ''} assigned
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 p-3 pt-0">
                    {visits.map((visit, visitIndex) => (
                      <motion.div
                        key={visit.id}
                        className="space-y-1.5 p-2 border rounded hover:bg-muted/30 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.4 + (coachIndex * 0.1) + (visitIndex * 0.05),
                          ease: [0, 0.71, 0.2, 1.01],
                        }}
                      >
                        {/* Branch Name */}
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.34,
                            delay: 0.5 + (coachIndex * 0.1) + (visitIndex * 0.05)
                          }}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Building2 className="h-3 w-3 text-brand-olive flex-shrink-0" />
                            <h4 className="font-medium text-sm text-high-contrast truncate">{visit.branch_name}</h4>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.26,
                              delay: 0.6 + (coachIndex * 0.1) + (visitIndex * 0.05),
                              scale: { type: "spring", visualDuration: 0.26, bounce: 0.4 }
                            }}
                          >
                            <Badge className={`text-xs px-1.5 py-0.5 ${getVisitStatusColor(visit.last_visit_date)}`}>
                              {visit.last_visit_date ? 'Visited' : 'Pending'}
                            </Badge>
                          </motion.div>
                        </motion.div>

                        {/* Visit Information */}
                        <motion.div 
                          className="space-y-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.6 + (coachIndex * 0.1) + (visitIndex * 0.05),
                            ease: [0, 0.71, 0.2, 1.01],
                          }}
                        >
                          <div className="flex items-center gap-1.5 text-xs">
                            <Calendar className="h-3 w-3 text-brand-olive flex-shrink-0" />
                            <span className="text-medium-contrast">Last:</span>
                            <span className="font-medium truncate">{formatDate(visit.last_visit_date)}</span>
                          </div>
                          
                          {visit.last_visit_date && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Clock className="h-3 w-3 text-brand-olive flex-shrink-0" />
                              <span className="text-medium-contrast">
                                {getDaysSinceVisit(visit.last_visit_date)} days ago
                              </span>
                            </div>
                          )}
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div 
                          className="flex items-center gap-1 pt-1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.26,
                            delay: 0.7 + (coachIndex * 0.1) + (visitIndex * 0.05)
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingVisit(visit)}
                            className="h-6 px-2 text-xs hover-scale"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBranchVisit(visit.id)}
                            className="h-6 px-2 text-xs text-destructive hover:text-destructive hover-scale"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {Object.keys(visitsByCoach).length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="col-span-full"
            >
              <Card className="hover-lift">
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
            </motion.div>
          )}
        </div>
      </AnimatedItem>

      {/* Add Branch Assignment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              scale: { type: "spring", visualDuration: 0.3, bounce: 0.2 }
            }}
          >
            <DialogHeader>
              <DialogTitle>Assign Branch to Coach</DialogTitle>
              <DialogDescription>
                Create a new branch assignment for a coach.
              </DialogDescription>
            </DialogHeader>
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="hover-lift">
                  Cancel
                </Button>
                <Button onClick={addBranchVisit} disabled={!newVisit.coach_id || !newVisit.branch_name.trim()} className="hover-lift">
                  Assign Branch
                </Button>
              </DialogFooter>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Edit Branch Assignment Dialog */}
      {editingVisit && (
        <Dialog open={!!editingVisit} onOpenChange={() => setEditingVisit(null)}>
          <DialogContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                scale: { type: "spring", visualDuration: 0.3, bounce: 0.2 }
              }}
            >
              <DialogHeader>
                <DialogTitle>Edit Branch Assignment</DialogTitle>
                <DialogDescription>
                  Update the branch assignment details.
                </DialogDescription>
              </DialogHeader>
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingVisit(null)} className="hover-lift">
                    Cancel
                  </Button>
                  <Button onClick={() => updateBranchVisit(editingVisit)} className="hover-lift">
                    Update Assignment
                  </Button>
                </DialogFooter>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatedContainer>
  );
} 