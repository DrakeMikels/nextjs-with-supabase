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
  Award,
  Users
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
import * as motion from "motion/react-client";

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
    completion_date: string;
    certificate_number: string;
    notes: string;
  }>({
    status: 'not_started',
    start_date: '',
    completion_date: '',
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
      completion_date: existingCert?.completion_date || '',
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
        completion_date: certificationUpdate.completion_date || null,
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
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.1,
          y: { type: "spring", stiffness: 100, damping: 15 }
        }}
      >
        <div>
          <h2 className="text-2xl font-bold text-high-contrast">Individual Development Plans</h2>
          <p className="text-medium-contrast">Track coach certifications and professional development</p>
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
          <Button className="gap-2 hover-lift">
            <GraduationCap className="h-4 w-4" />
            Manage Certifications
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Coaches",
            value: coaches.length,
            icon: Users,
            color: "brand-olive"
          },
          {
            title: "Total Certs", 
            value: certifications.length,
            icon: Award,
            color: "blue-600",
            borderColor: "blue-200",
            hoverBorderColor: "blue-300"
          },
          {
            title: "Required Certs",
            value: certifications.filter(c => c.is_required).length,
            icon: Star,
            color: "amber-600",
            borderColor: "amber-200", 
            hoverBorderColor: "amber-300"
          },
          {
            title: "Avg Completion",
            value: `${Math.round(coaches.reduce((acc, coach) => acc + getCoachProgress(coach.id), 0) / coaches.length)}%`,
            icon: CheckCircle,
            color: "green-600",
            borderColor: "green-200",
            hoverBorderColor: "green-300"
          }
        ].map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.51,
              delay: 0.1 + (index * 0.1),
              scale: { type: "spring", visualDuration: 0.51, bounce: 0.3 }
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.17, type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <Card className={`${card.borderColor ? `border-${card.borderColor} hover:border-${card.hoverBorderColor}` : `border-${card.color}/20 hover:border-${card.color}/40`} hover:shadow-lg transition-all duration-300 hover-lift`}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                    <p className="text-sm text-medium-contrast">{card.title}</p>
                    <motion.p 
                      className={`text-2xl font-bold text-${card.color}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + (index * 0.1),
                        scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
                      }}
                    >
                      {card.value}
                    </motion.p>
              </div>
                  <motion.div
                    initial={{ opacity: 0, rotate: -180, scale: 0 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    transition={{
                      duration: 0.51,
                      delay: 0.2 + (index * 0.1),
                      rotate: { type: "spring", stiffness: 200, damping: 15 },
                      scale: { type: "spring", visualDuration: 0.51, bounce: 0.4 }
                    }}
                  >
                    <card.icon className={`h-8 w-8 text-${card.color}/30`} />
                  </motion.div>
            </div>
          </CardContent>
        </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
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
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.7,
                    rotate: { type: "spring", stiffness: 200, damping: 15 }
                  }}
                >
              <Search className="h-4 w-4 text-medium-contrast" />
                </motion.div>
              <Input
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.8,
                    rotate: { type: "spring", stiffness: 200, damping: 15 }
                  }}
                >
              <Filter className="h-4 w-4 text-medium-contrast" />
                </motion.div>
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

              <motion.label 
                className="flex items-center gap-2 text-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.9
                }}
              >
              <input
                type="checkbox"
                checked={showRequiredOnly}
                onChange={(e) => setShowRequiredOnly(e.target.checked)}
                className="rounded"
              />
              Required Only
              </motion.label>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Main Overview Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 1.0,
          y: { type: "spring", stiffness: 100, damping: 15 }
        }}
      >
        <Card className="hover-lift border-brand-olive/20 hover:border-brand-olive/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-high-contrast">Team Certification Status</CardTitle>
            <div className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 1.1,
                    scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 }
                  }}
                >
                  <Button variant="outline" size="sm" className="gap-1 hover-lift">
                <Download className="h-4 w-4" />
                Export
              </Button>
                </motion.div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Quick Stats */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-brand-olive/5 dark:bg-brand-olive/10 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 1.2,
                  scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 }
                }}
              >
                {[
                  {
                    value: coachCertifications.filter(cc => cc.status === 'completed').length,
                    label: "Total Completed",
                    color: "green-600",
                    delay: 1.3
                  },
                  {
                    value: coachCertifications.filter(cc => cc.status === 'in_progress').length,
                    label: "In Progress",
                    color: "blue-600",
                    delay: 1.4
                  },
                  {
                    value: coachCertifications.filter(cc => cc.status === 'scheduled').length,
                    label: "Scheduled",
                    color: "amber-600",
                    delay: 1.5
                  }
                ].map((stat) => (
                  <motion.div 
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: stat.delay
                    }}
                  >
                    <motion.div 
                      className={`text-2xl font-bold text-${stat.color} dark:text-${stat.color.replace('600', '400')}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: stat.delay + 0.1,
                        scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-medium-contrast">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

            {/* Certification List */}
            <div className="space-y-4">
                {filteredCertifications.map((cert, certIndex) => {
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
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 1.6 + (certIndex * 0.1)
                      }}
                      whileHover={{ 
                        scale: 1.01,
                        transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 20 }
                      }}
                    >
                      <Card className="border-l-4 border-l-brand-olive/30 hover-lift hover:border-l-brand-olive/50 transition-all duration-300">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                              {cert.is_required && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: 1.7 + (certIndex * 0.1),
                                    scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 }
                                  }}
                                >
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                </motion.div>
                              )}
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: 1.8 + (certIndex * 0.1)
                                }}
                              >
                            <h3 className="font-semibold text-high-contrast">{cert.name}</h3>
                            <p className="text-sm text-medium-contrast">
                              {cert.description || 'Professional certification requirement'}
                            </p>
                              </motion.div>
                          </div>
                            <motion.div 
                              className="flex items-center gap-4 text-sm"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: 1.9 + (certIndex * 0.1)
                              }}
                            >
                              {[
                                { count: completedCount, label: "Complete", color: "green-600" },
                                { count: inProgressCount, label: "In Progress", color: "blue-600" },
                                { count: scheduledCount, label: "Scheduled", color: "amber-600" }
                              ].map((stat, statIndex) => (
                                <motion.div 
                                  key={stat.label}
                                  className="text-center"
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: 2.0 + (certIndex * 0.1) + (statIndex * 0.05),
                                    scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 }
                                  }}
                                >
                                  <div className={`font-semibold text-${stat.color} dark:text-${stat.color.replace('600', '400')}`}>
                                    {stat.count}
                        </div>
                                  <div className="text-xs text-medium-contrast">{stat.label}</div>
                                </motion.div>
                              ))}
                            </motion.div>
                      </div>

                          {/* Coach Progress Grid */}
                          <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: 2.1 + (certIndex * 0.1)
                            }}
                          >
                            {coachesWithCert.map(({ coach, status, completion_date, start_date }, coachIndex) => (
                              <motion.div 
                            key={coach.id} 
                                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              status === 'completed' 
                                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30' 
                                : status === 'in_progress'
                                ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30'
                                : status === 'scheduled'
                                ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 hover:border-brand-olive/30'
                            }`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  duration: 0.34,
                                  delay: 0.2 + (certIndex * 0.1) + (coachIndex * 0.02),
                                  scale: { type: "spring", visualDuration: 0.34, bounce: 0.4 }
                                }}
                                whileHover={{ 
                                  scale: 1.02,
                                  transition: { duration: 0.17, type: "spring", stiffness: 300, damping: 20 }
                                }}
                                onClick={() => openQuickUpdateDialog(coach, cert)}
                          >
                            <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sm">{coach.name}</span>
                                  <motion.span 
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      status === 'completed' ? 'bg-green-100 text-green-800' :
                                      status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                      status === 'scheduled' ? 'bg-amber-100 text-amber-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: 2.3 + (certIndex * 0.1) + (coachIndex * 0.02),
                                      scale: { type: "spring", visualDuration: 0.2, bounce: 0.4 }
                                    }}
                                  >
                                    {status.replace('_', ' ')}
                                  </motion.span>
                                  </div>
                                {completion_date && (
                                  <motion.div 
                                    className="text-xs text-medium-contrast"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: 2.4 + (certIndex * 0.1) + (coachIndex * 0.02)
                                    }}
                                  >
                                Completed: {new Date(completion_date).toLocaleDateString()}
                                  </motion.div>
                            )}
                                {start_date && !completion_date && (
                                  <motion.div 
                                    className="text-xs text-medium-contrast"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: 2.4 + (certIndex * 0.1) + (coachIndex * 0.02)
                                    }}
                                  >
                                    Started: {new Date(start_date).toLocaleDateString()}
                                  </motion.div>
                            )}
                              </motion.div>
                        ))}
                          </motion.div>
                    </CardContent>
                  </Card>
                    </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Quick Update Dialog */}
      <Dialog open={showCertificationDialog} onOpenChange={setShowCertificationDialog}>
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
            <DialogTitle>Update Certification Status</DialogTitle>
            <DialogDescription>
              Update {selectedCertification?.name} for {selectedCoach?.name}
            </DialogDescription>
          </DialogHeader>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
            <div>
                <Label>Status</Label>
              <Select value={certificationUpdate.status} onValueChange={(value: 'not_started' | 'scheduled' | 'in_progress' | 'completed' | 'expired') => setCertificationUpdate(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
              {(certificationUpdate.status === 'in_progress' || certificationUpdate.status === 'scheduled') && (
              <div>
                  <Label>Start Date</Label>
                <Input
                  type="date"
                  value={certificationUpdate.start_date}
                    onChange={(e) => setCertificationUpdate(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
            )}
            
            {certificationUpdate.status === 'completed' && (
                <div>
                  <Label>Completion Date</Label>
                  <Input
                    type="date"
                    value={certificationUpdate.completion_date}
                    onChange={(e) => setCertificationUpdate(prev => ({ ...prev, completion_date: e.target.value }))}
                  />
                </div>
              )}

                <div>
                <Label>Certificate Number</Label>
                  <Input
                    value={certificationUpdate.certificate_number}
                  onChange={(e) => setCertificationUpdate(prev => ({ ...prev, certificate_number: e.target.value }))}
                    placeholder="Certificate or ID number"
                  />
                </div>
            
            <div>
                <Label>Notes (Optional)</Label>
              <Textarea
                value={certificationUpdate.notes}
                  onChange={(e) => setCertificationUpdate(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this certification..."
                  rows={3}
              />
            </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
          <DialogFooter>
                <Button variant="outline" onClick={() => setShowCertificationDialog(false)} className="hover-lift">
              Cancel
            </Button>
                <Button onClick={updateCertificationStatus} className="hover-lift">
              Update Status
            </Button>
          </DialogFooter>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 