"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Save, Trash2, User, Calendar, Edit3 } from "lucide-react";
import { AnimatedContainer, AnimatedItem } from "@/components/ui/animated-container";

interface Coach {
  id: string;
  name: string;
  date_of_hire: string | null;
  vacation_days_remaining: number;
  vacation_days_total: number;
  cpr_trainer_license_date: string | null;
  cpr_trainer_expiration_date: string | null;
  cpr_trainer_provider: string | null;
  cpr_trainer_license_number: string | null;
}

interface CoachManagementProps {
  coaches: Coach[];
  onCoachesChange: (coaches: Coach[]) => void;
}

export function CoachManagement({ coaches, onCoachesChange }: CoachManagementProps) {
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [newCoach, setNewCoach] = useState({
    name: "",
    date_of_hire: "",
    vacation_days_remaining: 0,
    vacation_days_total: 2,
    cpr_trainer_license_date: "",
    cpr_trainer_expiration_date: "",
    cpr_trainer_provider: "",
    cpr_trainer_license_number: ""
  });
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const supabase = createClient();

  const saveCoach = async (coach: Coach) => {
    console.log("Saving coach:", coach);
    setLoading(true);
    try {
      const { error } = await supabase
        .from("coaches")
        .update({
          name: coach.name,
          date_of_hire: coach.date_of_hire || null,
          vacation_days_remaining: coach.vacation_days_remaining,
          vacation_days_total: coach.vacation_days_total,
          cpr_trainer_license_date: coach.cpr_trainer_license_date || null,
          cpr_trainer_expiration_date: coach.cpr_trainer_expiration_date || null,
          cpr_trainer_provider: coach.cpr_trainer_provider || null,
          cpr_trainer_license_number: coach.cpr_trainer_license_number || null
        })
        .eq("id", coach.id);

      console.log("Save coach response:", { error });

      if (error) {
        console.error("Supabase error saving coach:", error);
        alert(`Error saving coach: ${error.message}`);
        throw error;
      }

      const updatedCoaches = coaches.map(c => 
        c.id === coach.id ? coach : c
      );
      onCoachesChange(updatedCoaches);
      setEditingCoach(null);
      console.log("Coach saved successfully");
    } catch (error) {
      console.error("Error saving coach:", error);
      alert(`Failed to save coach: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const addCoach = async () => {
    if (!newCoach.name.trim()) return;

    console.log("Adding new coach:", newCoach);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("coaches")
        .insert({
          name: newCoach.name,
          date_of_hire: newCoach.date_of_hire || null,
          vacation_days_remaining: newCoach.vacation_days_remaining,
          vacation_days_total: newCoach.vacation_days_total,
          cpr_trainer_license_date: newCoach.cpr_trainer_license_date || null,
          cpr_trainer_expiration_date: newCoach.cpr_trainer_expiration_date || null,
          cpr_trainer_provider: newCoach.cpr_trainer_provider || null,
          cpr_trainer_license_number: newCoach.cpr_trainer_license_number || null
        })
        .select()
        .single();

      console.log("Add coach response:", { data, error });

      if (error) {
        console.error("Supabase error adding coach:", error);
        alert(`Error adding coach: ${error.message}`);
        throw error;
      }

      if (data) {
        onCoachesChange([...coaches, data]);
        setNewCoach({
          name: "",
          date_of_hire: "",
          vacation_days_remaining: 0,
          vacation_days_total: 2,
          cpr_trainer_license_date: "",
          cpr_trainer_expiration_date: "",
          cpr_trainer_provider: "",
          cpr_trainer_license_number: ""
        });
        setShowAddForm(false);
        console.log("Coach added successfully:", data);
      }
    } catch (error) {
      console.error("Error adding coach:", error);
      alert(`Failed to add coach: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteCoach = async (coachId: string) => {
    if (!confirm("Are you sure you want to delete this coach? This will also delete all their safety metrics.")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("coaches")
        .delete()
        .eq("id", coachId);

      if (error) throw error;

      const updatedCoaches = coaches.filter(c => c.id !== coachId);
      onCoachesChange(updatedCoaches);
    } catch (error) {
      console.error("Error deleting coach:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString();
  };

  const calculateTenure = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    const hireDate = new Date(dateString);
    const today = new Date();
    const years = today.getFullYear() - hireDate.getFullYear();
    const months = today.getMonth() - hireDate.getMonth();
    
    if (years > 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      return "Less than 1 month";
    }
  };

  return (
    <AnimatedContainer variant="stagger" className="space-y-6">
      <AnimatedItem className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-high-contrast">Coach Management</h2>
          <p className="text-medium-contrast">Manage regional safety coaches and their information</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2 hover-lift">
          <PlusCircle className="h-4 w-4" />
          Add Coach
        </Button>
      </AnimatedItem>

      {/* Add New Coach Form */}
      {showAddForm && (
        <AnimatedItem>
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="text-high-contrast">Add New Coach</CardTitle>
              <CardDescription className="text-medium-contrast">Enter the details for the new safety coach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new_name" className="text-high-contrast">Name</Label>
                  <Input
                    id="new_name"
                    value={newCoach.name}
                    onChange={(e) => setNewCoach(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Coach name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_hire_date" className="text-high-contrast">Date of Hire</Label>
                  <Input
                    id="new_hire_date"
                    type="date"
                    value={newCoach.date_of_hire}
                    onChange={(e) => setNewCoach(prev => ({ ...prev, date_of_hire: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new_vacation_remaining" className="text-high-contrast">Vacation Days Remaining</Label>
                  <Input
                    id="new_vacation_remaining"
                    type="number"
                    value={newCoach.vacation_days_remaining}
                    onChange={(e) => setNewCoach(prev => ({ ...prev, vacation_days_remaining: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_vacation_total" className="text-high-contrast">Total Vacation Days</Label>
                  <Input
                    id="new_vacation_total"
                    type="number"
                    value={newCoach.vacation_days_total}
                    onChange={(e) => setNewCoach(prev => ({ ...prev, vacation_days_total: parseInt(e.target.value) || 2 }))}
                  />
                </div>
              </div>
              
              {/* CPR Trainer License Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-high-contrast border-b pb-2">CPR Trainer License</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new_cpr_cert_date" className="text-high-contrast">CPR Trainer License Date</Label>
                    <Input
                      id="new_cpr_cert_date"
                      type="date"
                      value={newCoach.cpr_trainer_license_date}
                      onChange={(e) => setNewCoach(prev => ({ ...prev, cpr_trainer_license_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_cpr_exp_date" className="text-high-contrast">CPR Trainer Expiration Date</Label>
                    <Input
                      id="new_cpr_exp_date"
                      type="date"
                      value={newCoach.cpr_trainer_expiration_date}
                      onChange={(e) => setNewCoach(prev => ({ ...prev, cpr_trainer_expiration_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new_cpr_provider" className="text-high-contrast">Training Provider</Label>
                    <Input
                      id="new_cpr_provider"
                      value={newCoach.cpr_trainer_provider}
                      onChange={(e) => setNewCoach(prev => ({ ...prev, cpr_trainer_provider: e.target.value }))}
                      placeholder="e.g., American Red Cross"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_cpr_cert_number" className="text-high-contrast">License Number</Label>
                    <Input
                      id="new_cpr_cert_number"
                      value={newCoach.cpr_trainer_license_number}
                      onChange={(e) => setNewCoach(prev => ({ ...prev, cpr_trainer_license_number: e.target.value }))}
                      placeholder="License number"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addCoach} disabled={loading || !newCoach.name.trim()} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Adding..." : "Add Coach"}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedItem>
      )}

      {/* Coaches List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coaches.map((coach) => (
          <Card key={coach.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-high-contrast">
                  <User className="h-5 w-5" />
                  {editingCoach?.id === coach.id ? (
                    <Input
                      value={editingCoach.name}
                      onChange={(e) => setEditingCoach(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="h-6 text-base font-semibold"
                    />
                  ) : (
                    coach.name
                  )}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingCoach(editingCoach?.id === coach.id ? null : coach)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCoach(coach.id)}
                    disabled={loading}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-medium-contrast" />
                  <span className="text-medium-contrast">Hire Date:</span>
                  {editingCoach?.id === coach.id ? (
                    <Input
                      type="date"
                      value={editingCoach.date_of_hire || ""}
                      onChange={(e) => setEditingCoach(prev => prev ? { ...prev, date_of_hire: e.target.value } : null)}
                      className="h-6 text-sm"
                    />
                  ) : (
                    <span className="text-high-contrast">{formatDate(coach.date_of_hire)}</span>
                  )}
                </div>
                <div className="text-sm text-medium-contrast">
                  Tenure: {calculateTenure(coach.date_of_hire)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-high-contrast">Vacation Days</span>
                  <Badge variant="secondary">
                    {editingCoach?.id === coach.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={editingCoach.vacation_days_remaining}
                          onChange={(e) => setEditingCoach(prev => prev ? { ...prev, vacation_days_remaining: parseInt(e.target.value) || 0 } : null)}
                          className="h-5 w-12 text-xs"
                        />
                        /
                        <Input
                          type="number"
                          value={editingCoach.vacation_days_total}
                          onChange={(e) => setEditingCoach(prev => prev ? { ...prev, vacation_days_total: parseInt(e.target.value) || 2 } : null)}
                          className="h-5 w-12 text-xs"
                        />
                      </div>
                    ) : (
                      `${coach.vacation_days_remaining}/${coach.vacation_days_total}`
                    )}
                  </Badge>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(coach.vacation_days_remaining / coach.vacation_days_total) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* CPR Trainer License Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-high-contrast">CPR Trainer License</span>
                  {coach.cpr_trainer_expiration_date && (
                    <Badge 
                      variant={
                        new Date(coach.cpr_trainer_expiration_date) < new Date() 
                          ? "destructive" 
                          : new Date(coach.cpr_trainer_expiration_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          ? "secondary"
                          : "default"
                      }
                    >
                      {new Date(coach.cpr_trainer_expiration_date) < new Date() 
                        ? "Expired" 
                        : new Date(coach.cpr_trainer_expiration_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        ? "Expiring Soon"
                        : "Current"
                      }
                    </Badge>
                  )}
                </div>
                {editingCoach?.id === coach.id ? (
                  <div className="space-y-2">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <Label className="text-xs">License Date</Label>
                        <Input
                          type="date"
                          value={editingCoach.cpr_trainer_license_date || ""}
                          onChange={(e) => setEditingCoach(prev => prev ? { ...prev, cpr_trainer_license_date: e.target.value } : null)}
                          className="h-7 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Expiration Date</Label>
                        <Input
                          type="date"
                          value={editingCoach.cpr_trainer_expiration_date || ""}
                          onChange={(e) => setEditingCoach(prev => prev ? { ...prev, cpr_trainer_expiration_date: e.target.value } : null)}
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <Label className="text-xs">Training Provider</Label>
                        <Input
                          value={editingCoach.cpr_trainer_provider || ""}
                          onChange={(e) => setEditingCoach(prev => prev ? { ...prev, cpr_trainer_provider: e.target.value } : null)}
                          className="h-7 text-xs"
                          placeholder="Provider"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">License Number</Label>
                        <Input
                          value={editingCoach.cpr_trainer_license_number || ""}
                          onChange={(e) => setEditingCoach(prev => prev ? { ...prev, cpr_trainer_license_number: e.target.value } : null)}
                          className="h-7 text-xs"
                          placeholder="License #"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm space-y-1">
                    {coach.cpr_trainer_expiration_date ? (
                      <div className="text-medium-contrast">
                        Expires: {formatDate(coach.cpr_trainer_expiration_date)}
                      </div>
                    ) : (
                      <div className="text-medium-contrast">No CPR trainer license on file</div>
                    )}
                    {coach.cpr_trainer_provider && (
                      <div className="text-xs text-medium-contrast">
                        Provider: {coach.cpr_trainer_provider}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editingCoach?.id === coach.id && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => saveCoach(editingCoach)}
                    disabled={loading}
                    className="gap-1"
                  >
                    <Save className="h-3 w-3" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingCoach(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {coaches.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-high-contrast">No Coaches Found</CardTitle>
            <CardDescription className="text-medium-contrast">
              Add your first safety coach to get started with the tracking system.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </AnimatedContainer>
  );
} 