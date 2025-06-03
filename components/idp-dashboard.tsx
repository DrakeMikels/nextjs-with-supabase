"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Award, 
  Target, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  Edit,
  BookOpen,
  TrendingUp,
  FileText
} from "lucide-react";
import type { 
  Coach, 
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
    status: 'not_started' as 'not_started' | 'in_progress' | 'completed' | 'expired',
    start_date: '',
    completion_date: '',
    certificate_number: '',
    notes: ''
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
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
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
        notes: ''
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
        notes: existing.notes || ''
      });
    } else {
      setCertificationUpdate({
        status: 'not_started',
        start_date: '',
        completion_date: '',
        certificate_number: '',
        notes: ''
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-brand-olive" />
            <span className="text-brand-olive">Individual Development Plan</span>
          </h2>
          <p className="text-medium-contrast">
            {coach.name}'s professional development and certification tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-brand-olive/30 text-brand-olive">
            <TrendingUp className="h-3 w-3" />
            {Math.round(progress)}% Complete
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-high-contrast flex items-center gap-2">
            <Target className="h-5 w-5" />
            Certification Progress
          </CardTitle>
          <CardDescription className="text-medium-contrast">
            Overall progress on required certifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-medium-contrast">Required Certifications</span>
              <span className="text-high-contrast font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="certifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-brand-off-white border border-brand-olive/20">
          <TabsTrigger value="certifications" className="data-[state=active]:bg-brand-olive data-[state=active]:text-white text-medium-contrast">
            Certifications
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-brand-olive data-[state=active]:text-white text-medium-contrast">
            Development Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="space-y-4">
          {categories.map((category) => {
            const categoryCerts = certifications.filter(cert => cert.category_id === category.id);
            if (categoryCerts.length === 0) return null;

            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-high-contrast flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {category.name}
                    {category.is_required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-medium-contrast">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {categoryCerts.map((certification) => {
                      const coachCert = coachCertifications.find(cc => cc.certification_id === certification.id);
                      const status = coachCert?.status || 'not_started';
                      
                      return (
                        <div
                          key={certification.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => openCertificationDialog(certification)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${getStatusColor(status)} text-white`}>
                              {getStatusIcon(status)}
                            </div>
                            <div>
                              <h4 className="font-medium text-high-contrast">{certification.name}</h4>
                              <p className="text-sm text-medium-contrast">{certification.description}</p>
                              {certification.duration_hours && (
                                <p className="text-xs text-medium-contrast">
                                  Duration: {certification.duration_hours} hours
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {certification.is_required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                            <Badge variant="outline" className={`text-xs ${getStatusColor(status)} text-white border-0`}>
                              {status.replace('_', ' ')}
                            </Badge>
                            {coachCert?.expiration_date && (
                              <div className="text-xs text-medium-contrast">
                                Expires: {new Date(coachCert.expiration_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-high-contrast">Development Goals</h3>
            <Button onClick={() => setShowAddGoal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </div>

          <div className="grid gap-4">
            {idpGoals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-high-contrast">{goal.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                      <Badge variant="outline" className={`${getStatusColor(goal.status)} text-white border-0`}>
                        {goal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  {goal.target_completion_date && (
                    <CardDescription className="text-medium-contrast flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Target: {new Date(goal.target_completion_date).toLocaleDateString()}
                    </CardDescription>
                  )}
                </CardHeader>
                {goal.description && (
                  <CardContent>
                    <p className="text-medium-contrast">{goal.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}

            {idpGoals.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-high-contrast mb-2">No Development Goals</h3>
                  <p className="text-medium-contrast mb-4">Start by adding your first development goal.</p>
                  <Button onClick={() => setShowAddGoal(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Simplified Add Goal Form */}
      {showAddGoal && (
        <Card>
          <CardHeader>
            <CardTitle className="text-high-contrast">Add Development Goal</CardTitle>
            <CardDescription className="text-medium-contrast">
              Create a new professional development goal for {coach.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <select 
                value={newGoal.priority} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewGoal(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical' }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                Cancel
              </Button>
              <Button onClick={addGoal} disabled={!newGoal.title.trim()}>
                Add Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simplified Certification Update Form */}
      {showCertificationDialog && selectedCertification && (
        <Card>
          <CardHeader>
            <CardTitle className="text-high-contrast">Update Certification</CardTitle>
            <CardDescription className="text-medium-contrast">
              Update the status and details for {selectedCertification.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cert-status" className="text-high-contrast">Status</Label>
              <Select value={certificationUpdate.status} onValueChange={(value: any) => setCertificationUpdate(prev => ({ ...prev, status: value as 'not_started' | 'in_progress' | 'completed' | 'expired' }))} className="w-full p-2 border rounded-md">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCertificationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={updateCertificationStatus}>
                Update Certification
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 