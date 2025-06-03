"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, 
  CheckCircle, 
  Search,
  Filter,
  Download,
  Star,
  Award
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { 
  Coach,
  Certification, 
  CertificationCategory, 
  CoachCertification
} from "@/lib/types";

interface IdpOverviewProps {
  coaches: Coach[];
}

export function IdpOverview({ coaches }: IdpOverviewProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [categories, setCategories] = useState<CertificationCategory[]>([]);
  const [coachCertifications, setCoachCertifications] = useState<CoachCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showRequiredOnly, setShowRequiredOnly] = useState(false);
  const [showCertificationDialog, setShowCertificationDialog] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [certificationUpdate, setCertificationUpdate] = useState<{
    status: 'not_started' | 'scheduled' | 'in_progress' | 'completed' | 'expired';
    start_date: string;
    certificate_number: string;
    notes: string;
  }>({
    status: 'not_started',
    start_date: '',
    certificate_number: '',
    notes: '',
  });
  const supabase = createClient();

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

      // Fetch all certifications
      const { data: certificationsData, error: certificationsError } = await supabase
        .from("certifications")
        .select("*")
        .order("name");

      if (certificationsError) throw certificationsError;
      setCertifications(certificationsData || []);

      // Fetch all coach certifications
      const { data: coachCertData, error: coachCertError } = await supabase
        .from("coach_certifications")
        .select("*");

      if (coachCertError) throw coachCertError;
      setCoachCertifications(coachCertData || []);

    } catch (error) {
      console.error("Error fetching IDP overview data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCoachCertificationStatus = (coachId: string, certificationId: string) => {
    const coachCert = coachCertifications.find(
      cc => cc.coach_id === coachId && cc.certification_id === certificationId
    );
    return coachCert?.status || 'not_started';
  };

  const getCoachProgress = (coachId: string) => {
    const requiredCerts = certifications.filter(cert => cert.is_required);
    const completedRequired = requiredCerts.filter(cert => 
      getCoachCertificationStatus(coachId, cert.id) === 'completed'
    );
    return requiredCerts.length > 0 ? (completedRequired.length / requiredCerts.length) * 100 : 0;
  };

  // Filter certifications based on search and category
  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || cert.category_id === selectedCategory;
    const matchesRequired = !showRequiredOnly || cert.is_required;
    return matchesSearch && matchesCategory && matchesRequired;
  });

  const openQuickUpdateDialog = (coach: Coach, certification: Certification) => {
    setSelectedCertification(certification);
    setSelectedCoach(coach);
    
    const existingCert = coachCertifications.find(
      cc => cc.coach_id === coach.id && cc.certification_id === certification.id
    );
    
    setCertificationUpdate({
      status: (existingCert?.status || 'not_started') as 'not_started' | 'scheduled' | 'in_progress' | 'completed' | 'expired',
      start_date: existingCert?.start_date || '',
      certificate_number: existingCert?.certificate_number || '',
      notes: existingCert?.notes || '',
    });
    setShowCertificationDialog(true);
  };

  const updateCertificationStatus = async () => {
    if (!selectedCertification || !selectedCoach) return;

    try {
      const updateData = {
        coach_id: selectedCoach.id,
        certification_id: selectedCertification.id,
        status: certificationUpdate.status,
        start_date: certificationUpdate.start_date || null,
        completion_date: certificationUpdate.status === 'completed' ? certificationUpdate.start_date : null,
        certificate_number: certificationUpdate.certificate_number || null,
        notes: certificationUpdate.notes || null,
      };

      const { error } = await supabase
        .from("coach_certifications")
        .upsert(updateData, {
          onConflict: "coach_id,certification_id"
        });

      if (error) throw error;

      await fetchData();
      setShowCertificationDialog(false);
    } catch (error) {
      console.error("Error updating certification status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading IDP overview...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-brand-olive">
            <GraduationCap className="h-6 w-6" />
            Team Certification Overview
          </h2>
          <p className="text-medium-contrast">Complete view of all coaches and their certification progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast">Total Coaches</p>
                <p className="text-2xl font-bold text-brand-olive">{coaches.length}</p>
              </div>
              <Award className="h-8 w-8 text-brand-olive/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast">Total Certifications</p>
                <p className="text-2xl font-bold text-blue-600">{certifications.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast">Required Certs</p>
                <p className="text-2xl font-bold text-amber-600">{certifications.filter(c => c.is_required).length}</p>
              </div>
              <Star className="h-8 w-8 text-amber-600/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast">Avg Completion</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(coaches.reduce((acc, coach) => acc + getCoachProgress(coach.id), 0) / coaches.length)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-medium-contrast" />
              <Input
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-medium-contrast" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showRequiredOnly}
                onChange={(e) => setShowRequiredOnly(e.target.checked)}
                className="rounded"
              />
              Required Only
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Main Overview Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-high-contrast">Team Certification Status</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-brand-olive/5 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {coachCertifications.filter(cc => cc.status === 'completed').length}
                </div>
                <div className="text-sm text-medium-contrast">Total Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {coachCertifications.filter(cc => cc.status === 'in_progress').length}
                </div>
                <div className="text-sm text-medium-contrast">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {coachCertifications.filter(cc => cc.status === 'scheduled').length}
                </div>
                <div className="text-sm text-medium-contrast">Scheduled</div>
              </div>
            </div>

            {/* Certification List */}
            <div className="space-y-4">
              {filteredCertifications.map(cert => {
                const coachesWithCert = coaches.map(coach => {
                  const coachCert = coachCertifications.find(
                    cc => cc.coach_id === coach.id && cc.certification_id === cert.id
                  );
                  return {
                    coach,
                    status: coachCert?.status || 'not_started',
                    completion_date: coachCert?.completion_date,
                    start_date: coachCert?.start_date,
                    notes: coachCert?.notes
                  };
                });

                const completedCount = coachesWithCert.filter(c => c.status === 'completed').length;
                const inProgressCount = coachesWithCert.filter(c => c.status === 'in_progress').length;
                const scheduledCount = coachesWithCert.filter(c => c.status === 'scheduled').length;

                return (
                  <Card key={cert.id} className="border-l-4 border-l-brand-olive/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {cert.is_required && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                          <div>
                            <h3 className="font-semibold text-high-contrast">{cert.name}</h3>
                            <p className="text-sm text-medium-contrast">
                              {cert.description || 'Professional certification requirement'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{completedCount}</div>
                            <div className="text-xs text-medium-contrast">Complete</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">{inProgressCount}</div>
                            <div className="text-xs text-medium-contrast">In Progress</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-amber-600">{scheduledCount}</div>
                            <div className="text-xs text-medium-contrast">Scheduled</div>
                          </div>
                        </div>
                      </div>

                      {/* Coach Status Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {coachesWithCert.map(({ coach, status, completion_date, start_date, notes }) => (
                          <div 
                            key={coach.id} 
                            className={`p-3 rounded-lg border-2 transition-all ${
                              status === 'completed' 
                                ? 'border-green-200 bg-green-50' 
                                : status === 'in_progress'
                                ? 'border-blue-200 bg-blue-50'
                                : status === 'scheduled'
                                ? 'border-amber-200 bg-amber-50'
                                : 'border-gray-200 bg-gray-50 hover:border-brand-olive/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-high-contrast text-sm">{coach.name}</span>
                              <div className="flex items-center gap-1">
                                {status === 'completed' && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                                {status === 'in_progress' && (
                                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                    <span className="text-white text-xs">⏳</span>
                                  </div>
                                )}
                                {status === 'scheduled' && (
                                  <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                                    <span className="text-white text-xs">📅</span>
                                  </div>
                                )}
                                {status === 'not_started' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-6 px-2 text-xs"
                                    onClick={() => openQuickUpdateDialog(coach, cert)}
                                  >
                                    Add
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {completion_date && (
                              <div className="text-xs text-medium-contrast">
                                Completed: {new Date(completion_date).toLocaleDateString()}
                              </div>
                            )}
                            {start_date && status === 'in_progress' && (
                              <div className="text-xs text-medium-contrast">
                                Started: {new Date(start_date).toLocaleDateString()}
                              </div>
                            )}
                            {start_date && status === 'scheduled' && (
                              <div className="text-xs text-medium-contrast">
                                Scheduled: {new Date(start_date).toLocaleDateString()}
                              </div>
                            )}
                            {notes && (
                              <div className="text-xs text-medium-contrast mt-1 italic">
                                {notes.length > 50 ? `${notes.substring(0, 50)}...` : notes}
                              </div>
                            )}
                            
                            {status !== 'not_started' && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 px-2 text-xs mt-1 w-full"
                                onClick={() => openQuickUpdateDialog(coach, cert)}
                              >
                                Update
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Update Dialog */}
      <Dialog open={showCertificationDialog} onOpenChange={setShowCertificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Certification Status</DialogTitle>
            <DialogDescription>
              Update {selectedCertification?.name} for {selectedCoach?.name}
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
            
            {(certificationUpdate.status === 'scheduled' || certificationUpdate.status === 'in_progress' || certificationUpdate.status === 'completed') && (
              <div>
                <Label htmlFor="cert-start-date" className="text-high-contrast">
                  {certificationUpdate.status === 'scheduled' ? 'Scheduled Date' : 
                   certificationUpdate.status === 'completed' ? 'Completion Date' : 'Start Date'}
                </Label>
                <Input
                  id="cert-start-date"
                  type="date"
                  value={certificationUpdate.start_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCertificationUpdate(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
            )}
            
            {certificationUpdate.status === 'completed' && (
              <div>
                <Label htmlFor="cert-number" className="text-high-contrast">Certificate Number</Label>
                <Input
                  id="cert-number"
                  value={certificationUpdate.certificate_number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCertificationUpdate(prev => ({ ...prev, certificate_number: e.target.value }))}
                  placeholder="Certificate or ID number"
                />
              </div>
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
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 