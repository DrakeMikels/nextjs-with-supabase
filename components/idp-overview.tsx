"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  CheckCircle, 
  Star,
  Award,
  Users
} from "lucide-react";
import type { 
  Coach,
  Certification, 
  CoachCertification
} from "@/lib/types";
import * as motion from "motion/react-client";
import { IdpDashboard } from "./idp-dashboard";

interface IdpOverviewProps {
  coaches: Coach[];
  onDataChange?: () => void;
}

export function IdpOverview({ coaches, onDataChange }: IdpOverviewProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [coachCertifications, setCoachCertifications] = useState<CoachCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoachForIDP, setSelectedCoachForIDP] = useState<Coach | null>(null);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);



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



      {/* Coach Summary Cards */}
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
            <CardTitle className="text-lg text-high-contrast flex items-center gap-2">
              <Users className="h-5 w-5" />
              Coach Certification Summary
            </CardTitle>
            <p className="text-sm text-medium-contrast">
              Overview of each coach&apos;s completed certifications
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {coaches.map((coach, coachIndex) => {
                const coachCompletedCerts = coachCertifications.filter(
                  cc => cc.coach_id === coach.id && cc.status === 'completed'
                );
                
                const coachCertsWithDetails = coachCompletedCerts.map(cc => {
                  const cert = certifications.find(c => c.id === cc.certification_id);
                  return {
                    ...cc,
                    certification: cert
                  };
                }).filter(cc => cc.certification);

                return (
                  <motion.div
                    key={coach.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 1.1 + (coachIndex * 0.1),
                      scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 }
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.17, type: "spring", stiffness: 300, damping: 20 }
                    }}
                  >
                    <Card className="h-full border-brand-olive/20 hover:border-brand-olive/40 transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base text-high-contrast">{coach.name}</CardTitle>
                            <p className="text-xs text-medium-contrast">
                              {coachCertsWithDetails.length} completed certification{coachCertsWithDetails.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: 1.2 + (coachIndex * 0.1),
                              scale: { type: "spring", visualDuration: 0.3, bounce: 0.4 }
                            }}
                          >
                            <div className="text-right">
                              <div className="text-lg font-bold text-brand-olive">
                                {Math.round(getCoachProgress(coach.id))}%
                              </div>
                              <div className="text-xs text-medium-contrast">Complete</div>
                            </div>
                          </motion.div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {coachCertsWithDetails.length > 0 ? (
                            coachCertsWithDetails.map((coachCert, certIndex) => (
                              <motion.div
                                key={coachCert.id}
                                className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: 1.3 + (coachIndex * 0.1) + (certIndex * 0.05)
                                }}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: 1.4 + (coachIndex * 0.1) + (certIndex * 0.05),
                                      scale: { type: "spring", visualDuration: 0.2, bounce: 0.4 }
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                  </motion.div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-sm text-high-contrast truncate">
                                      {coachCert.certification?.name}
                                    </h4>
                                    <div className="text-xs text-medium-contrast space-y-1">
                                      {coachCert.completion_date && (
                                        <p>Completed: {new Date(coachCert.completion_date + 'T00:00:00').toLocaleDateString()}</p>
                                      )}
                                      {coachCert.expiration_date && (
                                        <p>Expires: {new Date(coachCert.expiration_date + 'T00:00:00').toLocaleDateString()}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {coachCert.certification?.is_required && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: 1.5 + (coachIndex * 0.1) + (certIndex * 0.05),
                                      scale: { type: "spring", visualDuration: 0.2, bounce: 0.4 }
                                    }}
                                  >
                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                                  </motion.div>
                                )}
                              </motion.div>
                            ))
                          ) : (
                            <motion.div
                              className="text-center py-4 text-sm text-medium-contrast"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: 1.3 + (coachIndex * 0.1)
                              }}
                            >
                              No completed certifications yet
                            </motion.div>
                          )}
                        </div>
                        <motion.div
                          className="mt-3 pt-3 border-t"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 1.4 + (coachIndex * 0.1)
                          }}
                        >
                          <Button 
                            size="sm" 
                            className="w-full gap-1 hover-lift"
                            onClick={() => setSelectedCoachForIDP(coach)}
                          >
                            <GraduationCap className="h-3 w-3" />
                            View Full IDP
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>





      {/* Detailed IDP View */}
      {selectedCoachForIDP && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline"
              onClick={() => setSelectedCoachForIDP(null)}
              className="gap-2 hover-lift"
            >
              ← Back to Overview
            </Button>
            <div className="text-sm text-medium-contrast">
              Viewing detailed IDP for {selectedCoachForIDP.name}
            </div>
          </div>
          <IdpDashboard 
            coach={selectedCoachForIDP}
            onDataChange={() => {
              fetchData();
              onDataChange?.();
            }}
          />
        </motion.div>
      )}
    </div>
  );
} 