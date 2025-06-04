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
import * as motion from "motion/react-client";

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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            x: { type: "spring", stiffness: 100, damping: 15 }
          }}
        >
          <Button onClick={() => setShowAddForm(true)} className="gap-2 hover-lift">
            <PlusCircle className="h-4 w-4" />
            Add Coach
          </Button>
        </motion.div>
      </AnimatedItem>

      {/* Summary Stats */}
      <AnimatedItem>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Coaches",
              value: coaches.length,
              icon: User,
              color: "brand-olive",
              delay: 0.1
            },
            {
              title: "Active Coaches",
              value: coaches.filter(c => c.date_of_hire).length,
              icon: Calendar,
              color: "green-600",
              delay: 0.2
            },
            {
              title: "Avg Vacation Days",
              value: coaches.length > 0 ? Math.round(coaches.reduce((acc, c) => acc + c.vacation_days_remaining, 0) / coaches.length) : 0,
              icon: Calendar,
              color: "blue-600",
              delay: 0.3
            },
            {
              title: "CPR Certified",
              value: coaches.filter(c => c.cpr_trainer_license_date).length,
              icon: User,
              color: "purple-600",
              delay: 0.4
            }
          ].map((stat) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: stat.delay,
                scale: { type: "spring", visualDuration: 0.6, bounce: 0.3 }
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 20 }
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
                          duration: 0.4,
                          delay: stat.delay + 0.2,
                          scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
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
                      <stat.icon className={`h-8 w-8 text-${stat.color}/30`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedItem>

      {/* Add New Coach Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.9 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.9 }}
          transition={{
            duration: 0.4,
            height: { type: "spring", stiffness: 300, damping: 30 },
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 }
          }}
        >
          <Card className="hover-lift border-brand-olive/30">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <CardTitle className="text-high-contrast">Add New Coach</CardTitle>
                <CardDescription className="text-medium-contrast">Enter the details for the new safety coach</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="grid gap-4 md:grid-cols-2"
              >
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
              </motion.div>

              {/* Rest of form fields with staggered animations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="grid gap-4 md:grid-cols-2"
              >
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
              </motion.div>
              
              {/* CPR Trainer License Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="space-y-4"
              >
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
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex gap-2"
              >
                <Button onClick={addCoach} disabled={loading || !newCoach.name.trim()} className="gap-2 hover-lift">
                  <Save className="h-4 w-4" />
                  {loading ? "Adding..." : "Add Coach"}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="hover-lift">
                  Cancel
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Coaches List */}
      <AnimatedItem>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach, index) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.1 + (index * 0.05),
                scale: { type: "spring", visualDuration: 0.6, bounce: 0.3 }
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              <Card className="relative hover-lift border-brand-olive/20 hover:border-brand-olive/40 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-high-contrast">
                      <motion.div
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.2 + (index * 0.05),
                          rotate: { type: "spring", stiffness: 200, damping: 15 }
                        }}
                      >
                        <User className="h-5 w-5" />
                      </motion.div>
                      {editingCoach?.id === coach.id ? (
                        <Input
                          value={editingCoach.name}
                          onChange={(e) => setEditingCoach(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="h-6 text-base font-semibold"
                        />
                      ) : (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.3 + (index * 0.05)
                          }}
                        >
                          {coach.name}
                        </motion.span>
                      )}
                    </CardTitle>
                    <motion.div 
                      className="flex items-center gap-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.4 + (index * 0.05)
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCoach(editingCoach?.id === coach.id ? null : coach)}
                        className="h-8 w-8 p-0 hover-scale"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCoach(coach.id)}
                        disabled={loading}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover-scale"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.5 + (index * 0.05)
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <motion.div
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.6 + (index * 0.05),
                          rotate: { type: "spring", stiffness: 200, damping: 15 }
                        }}
                      >
                        <Calendar className="h-4 w-4 text-medium-contrast" />
                      </motion.div>
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
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.7 + (index * 0.05)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-high-contrast">Vacation Days</span>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.8 + (index * 0.05),
                          scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 }
                        }}
                      >
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
                      </motion.div>
                    </div>
                    <motion.div 
                      className="w-full bg-secondary rounded-full h-2"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.9 + (index * 0.05),
                        scaleX: { type: "spring", stiffness: 100, damping: 15 }
                      }}
                    >
                      <motion.div
                        className="bg-primary h-2 rounded-full transition-all"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(coach.vacation_days_remaining / coach.vacation_days_total) * 100}%`
                        }}
                        transition={{
                          duration: 0.6,
                          delay: 1.0 + (index * 0.05),
                          ease: "easeOut"
                        }}
                      />
                    </motion.div>
                  </motion.div>

                  {/* CPR Trainer License Status */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 1.1 + (index * 0.05)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-high-contrast">CPR Trainer License</span>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 1.2 + (index * 0.05),
                          scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 }
                        }}
                      >
                        <Badge 
                          variant={coach.cpr_trainer_license_date ? "default" : "secondary"}
                          className={coach.cpr_trainer_license_date ? "bg-green-100 text-green-800 border-green-200" : ""}
                        >
                          {coach.cpr_trainer_license_date ? "Licensed" : "Not Licensed"}
                        </Badge>
                      </motion.div>
                    </div>

                    {editingCoach?.id === coach.id ? (
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
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
                            <Label className="text-xs">Provider</Label>
                            <Input
                              value={editingCoach.cpr_trainer_provider || ""}
                              onChange={(e) => setEditingCoach(prev => prev ? { ...prev, cpr_trainer_provider: e.target.value } : null)}
                              className="h-7 text-xs"
                              placeholder="Training provider"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">License Number</Label>
                            <Input
                              value={editingCoach.cpr_trainer_license_number || ""}
                              onChange={(e) => setEditingCoach(prev => prev ? { ...prev, cpr_trainer_license_number: e.target.value } : null)}
                              className="h-7 text-xs"
                              placeholder="License number"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ) : coach.cpr_trainer_license_date ? (
                      <motion.div 
                        className="text-xs text-medium-contrast space-y-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1.3 + (index * 0.05) }}
                      >
                        <div>Licensed: {formatDate(coach.cpr_trainer_license_date)}</div>
                        {coach.cpr_trainer_expiration_date && (
                          <div>Expires: {formatDate(coach.cpr_trainer_expiration_date)}</div>
                        )}
                        {coach.cpr_trainer_provider && (
                          <div>Provider: {coach.cpr_trainer_provider}</div>
                        )}
                      </motion.div>
                    ) : null}
                  </motion.div>

                  {editingCoach?.id === coach.id && (
                    <motion.div 
                      className="flex gap-2 pt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        size="sm"
                        onClick={() => saveCoach(editingCoach)}
                        disabled={loading}
                        className="gap-1 hover-lift"
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCoach(null)}
                        className="hover-lift"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedItem>

      {coaches.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="text-high-contrast">No Coaches Found</CardTitle>
              <CardDescription className="text-medium-contrast">
                Add your first safety coach to get started with the tracking system.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      )}
    </AnimatedContainer>
  );
} 