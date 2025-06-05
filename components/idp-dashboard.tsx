"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  BookOpen,
  TrendingUp,
  FileText,
  ChevronRight,
  Star
} from "lucide-react";
import * as motion from "motion/react-client";
import type { 
  Certification, 
  CertificationCategory, 
  CoachCertification, 
  IdpGoal,
  IdpDashboardProps 
} from "@/lib/types";

export function IdpDashboard({ coach, onDataChange }: IdpDashboardProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [categories, setCategories] = useState<CertificationCategory[]>([]);
  const [coachCertifications, setCoachCertifications] = useState<CoachCertification[]>([]);
  const [idpGoals, setIdpGoals] = useState<IdpGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showCertificationDialog, setShowCertificationDialog] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const supabase = createClient();

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target_completion_date: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  // Certification update form state
  const [certificationUpdate, setCertificationUpdate] = useState({
    status: 'not_started' as 'not_started' | 'scheduled' | 'in_progress' | 'completed' | 'expired',
    start_date: '',
    completion_date: '',
    certificate_number: '',
    notes: '',
    expiration_date: ''
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch certification categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("certification_categories")
        .select("*")
        .order("name");

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch all certifications with categories
      const { data: certificationsData, error: certificationsError } = await supabase
        .from("certifications")
        .select(`
          *,
          category:certification_categories(*)
        `)
        .order("name");

      if (certificationsError) throw certificationsError;
      setCertifications(certificationsData || []);

      // Fetch coach certifications
      const { data: coachCertData, error: coachCertError } = await supabase
        .from("coach_certifications")
        .select(`
          *,
          certification:certifications(
            *,
            category:certification_categories(*)
          )
        `)
        .eq("coach_id", coach.id);

      if (coachCertError) throw coachCertError;
      setCoachCertifications(coachCertData || []);

      // Fetch IDP goals
      const { data: goalsData, error: goalsError } = await supabase
        .from("idp_goals")
        .select("*")
        .eq("coach_id", coach.id)
        .order("created_at", { ascending: false });

      if (goalsError) throw goalsError;
      setIdpGoals(goalsData || []);

    } catch (error) {
      console.error("Error fetching IDP data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, coach.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'scheduled': return 'bg-amber-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'in_progress': return <Clock className="h-3 w-3" />;
      case 'scheduled': return <Calendar className="h-3 w-3" />;
      case 'expired': return <AlertTriangle className="h-3 w-3" />;
      default: return <BookOpen className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateProgress = () => {
    const requiredCerts = certifications.filter(cert => cert.is_required);
    const completedRequired = coachCertifications.filter(cc => 
      cc.status === 'completed' && 
      certifications.find(cert => cert.id === cc.certification_id)?.is_required
    );
    
    return requiredCerts.length > 0 ? (completedRequired.length / requiredCerts.length) * 100 : 0;
  };

  const addGoal = async () => {
    try {
      const { error } = await supabase
        .from("idp_goals")
        .insert({
          coach_id: coach.id,
          title: newGoal.title,
          description: newGoal.description || null,
          target_completion_date: newGoal.target_completion_date || null,
          priority: newGoal.priority
        });

      if (error) throw error;

      setNewGoal({ title: '', description: '', target_completion_date: '', priority: 'medium' });
      setShowAddGoal(false);
      await fetchData();
      onDataChange();
    } catch (error) {
      console.error("Error adding goal:", error);
      alert("Failed to add goal");
    }
  };

  const updateCertificationStatus = async () => {
    if (!selectedCertification) return;

    try {
      const updateData = {
        coach_id: coach.id,
        certification_id: selectedCertification.id,
        status: certificationUpdate.status,
        start_date: certificationUpdate.start_date || null,
        completion_date: certificationUpdate.completion_date || null,
        certificate_number: certificationUpdate.certificate_number || null,
        notes: certificationUpdate.notes || null,
        expiration_date: certificationUpdate.expiration_date || null,
        ...(certificationUpdate.status === 'completed' && certificationUpdate.completion_date && selectedCertification.expiration_months ? {
          expiration_date: new Date(new Date(certificationUpdate.completion_date).getTime() + (selectedCertification.expiration_months * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        } : {})
      };

      const { error } = await supabase
        .from("coach_certifications")
        .upsert(updateData, {
          onConflict: "coach_id,certification_id"
        });

      if (error) throw error;

      setShowCertificationDialog(false);
      setSelectedCertification(null);
      setCertificationUpdate({
        status: 'not_started',
        start_date: '',
        completion_date: '',
        certificate_number: '',
        notes: '',
        expiration_date: ''
      });
      await fetchData();
      onDataChange();
    } catch (error) {
      console.error("Error updating certification:", error);
      alert("Failed to update certification");
    }
  };

  const openCertificationDialog = (certification: Certification) => {
    setSelectedCertification(certification);
    const existing = coachCertifications.find(cc => cc.certification_id === certification.id);
    
    if (existing) {
      setCertificationUpdate({
        status: existing.status,
        start_date: existing.start_date || '',
        completion_date: existing.completion_date || '',
        certificate_number: existing.certificate_number || '',
        notes: existing.notes || '',
        expiration_date: existing.expiration_date || ''
      });
    } else {
      setCertificationUpdate({
        status: 'not_started',
        start_date: '',
        completion_date: '',
        certificate_number: '',
        notes: '',
        expiration_date: ''
      });
    }
    setShowCertificationDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading IDP dashboard...</div>
      </div>
    );
  }

  const progress = calculateProgress();
  const totalCompleted = coachCertifications.filter(cc => cc.status === 'completed').length;
  const totalCertifications = certifications.length;

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-brand-olive">
            <GraduationCap className="h-5 w-5" />
            {coach.name}&apos;s Development Plan
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1 border-brand-olive/30 text-brand-olive">
            <TrendingUp className="h-3 w-3" />
            {Math.round(progress)}% Required
          </Badge>
          <Badge variant="outline" className="gap-1 border-blue-500/30 text-blue-600">
            <Award className="h-3 w-3" />
            {totalCompleted}/{totalCertifications} Total
          </Badge>
        </div>
      </div>

      {/* Compact Progress Overview */}
      <Card className="border-brand-olive/20">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-medium-contrast">Required Certifications</span>
                <span className="text-high-contrast font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-medium-contrast">Overall Progress</span>
                <span className="text-high-contrast font-medium">{Math.round((totalCompleted / totalCertifications) * 100)}%</span>
              </div>
              <Progress value={(totalCompleted / totalCertifications) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="certifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-brand-off-white border border-brand-olive/20">
          <TabsTrigger value="certifications" className="data-[state=active]:bg-brand-olive data-[state=active]:text-white text-medium-contrast">
            Certifications
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-brand-olive data-[state=active]:text-white text-medium-contrast">
            Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="space-y-3">
          {categories.map((category, categoryIndex) => {
            const categoryCerts = certifications.filter(cert => cert.category_id === category.id);
            if (categoryCerts.length === 0) return null;

            const categoryCompleted = categoryCerts.filter(cert => 
              coachCertifications.find(cc => cc.certification_id === cert.id && cc.status === 'completed')
            ).length;
            const isExpanded = expandedCategory === category.id;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: categoryIndex * 0.1,
                  ease: [0, 0.71, 0.2, 1.01]
                }}
              >
                <Card className="border-l-4 border-l-brand-olive/30 hover-lift">
                  <motion.div
                    className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.17, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          >
                            <ChevronRight className="h-4 w-4 text-brand-olive" />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, rotate: -180 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            transition={{
                              duration: 0.43,
                              delay: 0.2 + (categoryIndex * 0.1),
                              rotate: { type: "spring", stiffness: 200, damping: 15 }
                            }}
                          >
                            <Award className="h-4 w-4 text-brand-olive" />
                          </motion.div>
                          <CardTitle className="text-base text-high-contrast">{category.name}</CardTitle>
                          {category.is_required && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.3 + (categoryIndex * 0.1),
                                scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 }
                              }}
                            >
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            </motion.div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.34,
                              delay: 0.4 + (categoryIndex * 0.1),
                              scale: { type: "spring", visualDuration: 0.34, bounce: 0.4 }
                            }}
                          >
                            <Badge variant="outline" className="text-xs">
                              {categoryCompleted}/{categoryCerts.length}
                            </Badge>
                          </motion.div>
                          <motion.div 
                            className="w-16"
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.5 + (categoryIndex * 0.1),
                              scaleX: { type: "spring", stiffness: 100, damping: 15 }
                            }}
                          >
                            <Progress value={(categoryCompleted / categoryCerts.length) * 100} className="h-1" />
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>
                  </motion.div>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                      opacity: { duration: isExpanded ? 0.4 : 0.2, delay: isExpanded ? 0.1 : 0 }
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <CardContent className="pt-0">
                      <motion.div 
                        className="grid gap-2"
                        initial={false}
                        animate={isExpanded ? "expanded" : "collapsed"}
                        variants={{
                          expanded: {
                            transition: {
                              staggerChildren: 0.05,
                              delayChildren: 0.1
                            }
                          },
                          collapsed: {
                            transition: {
                              staggerChildren: 0.02,
                              staggerDirection: -1
                            }
                          }
                        }}
                      >
                        {categoryCerts.map((certification, certIndex) => {
                          const coachCert = coachCertifications.find(cc => cc.certification_id === certification.id);
                          const status = coachCert?.status || 'not_started';
                          
                          return (
                            <motion.div
                              key={certification.id}
                              className="flex items-center justify-between p-2 border rounded hover:bg-muted/30 cursor-pointer transition-colors hover-lift"
                              onClick={() => openCertificationDialog(certification)}
                              variants={{
                                expanded: {
                                  opacity: 1,
                                  y: 0,
                                  scale: 1
                                },
                                collapsed: {
                                  opacity: 0,
                                  y: -10,
                                  scale: 0.95
                                }
                              }}
                              transition={{
                                duration: 0.3,
                                ease: [0, 0.71, 0.2, 1.01]
                              }}
                              whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.17, type: "spring", stiffness: 300, damping: 20 }
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <motion.div 
                                  className={`p-1 rounded-full ${getStatusColor(status)} text-white flex-shrink-0`}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: 0.1 + (certIndex * 0.05),
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                  }}
                                >
                                  {getStatusIcon(status)}
                                </motion.div>
                                <div className="min-w-0 flex-1">
                                  <motion.h4 
                                    className="font-medium text-sm text-high-contrast truncate"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: 0.15 + (certIndex * 0.05)
                                    }}
                                  >
                                    {certification.name}
                                  </motion.h4>
                                  {coachCert?.completion_date && (
                                    <motion.p 
                                      className="text-xs text-medium-contrast"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: 0.2 + (certIndex * 0.05)
                                      }}
                                    >
                                      Completed: {new Date(coachCert.completion_date + 'T00:00:00').toLocaleDateString()}
                                    </motion.p>
                                  )}
                                  {coachCert?.expiration_date && (
                                    <motion.p 
                                      className="text-xs text-medium-contrast"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: 0.25 + (certIndex * 0.05)
                                      }}
                                    >
                                      Expires: {new Date(coachCert.expiration_date + 'T00:00:00').toLocaleDateString()}
                                    </motion.p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {certification.is_required && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: 0.3 + (certIndex * 0.05),
                                      scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 }
                                    }}
                                  >
                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                  </motion.div>
                                )}
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    duration: 0.26,
                                    delay: 0.35 + (certIndex * 0.05),
                                    scale: { type: "spring", visualDuration: 0.26, bounce: 0.4 }
                                  }}
                                >
                                  <Badge variant="outline" className={`text-xs ${getStatusColor(status)} text-white border-0`}>
                                    {status === 'not_started' ? 'New' : status.replace('_', ' ')}
                                  </Badge>
                                </motion.div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </CardContent>
                  </motion.div>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="goals" className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-high-contrast">Development Goals</h3>
            <Button onClick={() => setShowAddGoal(true)} size="sm" className="gap-1">
              <Plus className="h-3 w-3" />
              Add Goal
            </Button>
          </div>

          <div className="grid gap-3">
            {idpGoals.slice(0, 5).map((goal) => (
              <Card key={goal.id} className="border-l-4 border-l-blue-500/30">
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-high-contrast truncate">{goal.title}</h4>
                      {goal.target_completion_date && (
                        <p className="text-xs text-medium-contrast flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Target: {new Date(goal.target_completion_date + 'T00:00:00').toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge className={`text-xs ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {idpGoals.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="text-center py-6">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-medium-contrast text-sm mb-3">No development goals yet</p>
                  <Button onClick={() => setShowAddGoal(true)} size="sm" variant="outline" className="gap-1">
                    <Plus className="h-3 w-3" />
                    Add First Goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Goal Dialog */}
      <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Development Goal</DialogTitle>
            <DialogDescription>
              Create a new professional development goal for {coach.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal-title" className="text-high-contrast">Title</Label>
              <Input
                id="goal-title"
                value={newGoal.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Complete OSHA 510 Certification"
              />
            </div>
            <div>
              <Label htmlFor="goal-description" className="text-high-contrast">Description</Label>
              <Textarea
                id="goal-description"
                value={newGoal.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the goal..."
              />
            </div>
            <div>
              <Label htmlFor="goal-date" className="text-high-contrast">Target Completion Date</Label>
              <Input
                id="goal-date"
                type="date"
                value={newGoal.target_completion_date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGoal(prev => ({ ...prev, target_completion_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="goal-priority" className="text-high-contrast">Priority</Label>
              <Select value={newGoal.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setNewGoal(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGoal(false)}>
              Cancel
            </Button>
            <Button onClick={addGoal} disabled={!newGoal.title.trim()}>
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certification Update Dialog */}
      <Dialog open={showCertificationDialog} onOpenChange={setShowCertificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Certification</DialogTitle>
            <DialogDescription>
              Update the status and details for {selectedCertification?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cert-status" className="text-high-contrast">Status</Label>
              <Select value={certificationUpdate.status} onValueChange={(value: 'not_started' | 'scheduled' | 'in_progress' | 'completed' | 'expired') => setCertificationUpdate(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(certificationUpdate.status === 'in_progress' || certificationUpdate.status === 'completed') && (
              <div>
                <Label htmlFor="cert-start-date" className="text-high-contrast">Start Date</Label>
                <Input
                  id="cert-start-date"
                  type="date"
                  value={certificationUpdate.start_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCertificationUpdate(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
            )}
            {certificationUpdate.status === 'completed' && (
              <>
                <div>
                  <Label htmlFor="cert-completion-date" className="text-high-contrast">Completion Date</Label>
                  <Input
                    id="cert-completion-date"
                    type="date"
                    value={certificationUpdate.completion_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCertificationUpdate(prev => ({ ...prev, completion_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cert-expiration-date" className="text-high-contrast">Expiration Date</Label>
                  <Input
                    id="cert-expiration-date"
                    type="date"
                    value={certificationUpdate.expiration_date || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCertificationUpdate(prev => ({ ...prev, expiration_date: e.target.value }))}
                  />
                  <p className="text-xs text-medium-contrast mt-1">
                    Enter the actual expiration date for this certification
                  </p>
                </div>
                <div>
                  <Label htmlFor="cert-number" className="text-high-contrast">Certificate Number</Label>
                  <Input
                    id="cert-number"
                    value={certificationUpdate.certificate_number}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCertificationUpdate(prev => ({ ...prev, certificate_number: e.target.value }))}
                    placeholder="Certificate or ID number"
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="cert-notes" className="text-high-contrast">Notes</Label>
              <Textarea
                id="cert-notes"
                value={certificationUpdate.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCertificationUpdate(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes or comments..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCertificationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={updateCertificationStatus}>
              Update Certification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 