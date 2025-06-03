"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  GraduationCap, 
  CheckCircle, 
  Search,
  Filter,
  Download,
  Star,
  Award
} from "lucide-react";
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

  const getTotalProgress = (coachId: string) => {
    const completedTotal = certifications.filter(cert => 
      getCoachCertificationStatus(coachId, cert.id) === 'completed'
    );
    return certifications.length > 0 ? (completedTotal.length / certifications.length) * 100 : 0;
  };

  // Filter certifications based on search and category
  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || cert.category_id === selectedCategory;
    const matchesRequired = !showRequiredOnly || cert.is_required;
    return matchesSearch && matchesCategory && matchesRequired;
  });

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
          <CardTitle className="text-lg text-high-contrast">Certification Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-brand-olive/5">
                  <TableHead className="w-48 sticky left-0 bg-brand-olive/5 z-10 border-r border-brand-olive/20">
                    <span className="font-semibold text-high-contrast">Coach</span>
                  </TableHead>
                  <TableHead className="w-32 text-center bg-brand-olive/5 border-r border-brand-olive/20">
                    <span className="font-semibold text-high-contrast">Required Progress</span>
                  </TableHead>
                  <TableHead className="w-32 text-center bg-brand-olive/5 border-r border-brand-olive/20">
                    <span className="font-semibold text-high-contrast">Overall Progress</span>
                  </TableHead>
                  {filteredCertifications.map(cert => {
                    // Create smarter column headers by removing common prefixes and using key words
                    let displayName = cert.name;
                    
                    // Remove common prefixes
                    displayName = displayName.replace(/^(OSHA|NCOS)-?\s*/i, '');
                    displayName = displayName.replace(/^(CPR|First Aid|BBP)\s*\/?\s*/i, '');
                    displayName = displayName.replace(/^(Wicklander)\s*&?\s*(Zulawski)?\s*/i, 'W&Z');
                    
                    // Use key identifying words for specific certifications
                    if (cert.name.toLowerCase().includes('510')) displayName = '510 Course';
                    if (cert.name.toLowerCase().includes('470')) displayName = '470 Course';
                    if (cert.name.toLowerCase().includes('fall protection')) displayName = 'Fall Protection';
                    if (cert.name.toLowerCase().includes('maritime')) displayName = 'Maritime';
                    if (cert.name.toLowerCase().includes('cpr') || cert.name.toLowerCase().includes('first aid')) displayName = 'CPR/First Aid';
                    if (cert.name.toLowerCase().includes('wicklander')) displayName = 'Interview & Interrogation';
                    
                    // Limit to 12 characters and add ellipsis if needed
                    if (displayName.length > 12) {
                      displayName = displayName.substring(0, 10) + '...';
                    }
                    
                    return (
                      <TableHead key={cert.id} className="w-28 text-center bg-brand-olive/5 border-r border-brand-olive/10 last:border-r-0">
                        <div className="flex flex-col items-center gap-1 py-2">
                          {cert.is_required && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                          <span className="text-xs font-semibold text-high-contrast leading-tight text-center" title={cert.name}>
                            {displayName}
                          </span>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {coaches.map((coach, index) => (
                  <TableRow key={coach.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <TableCell className="sticky left-0 bg-inherit z-10 border-r border-brand-olive/20">
                      <div className="flex flex-col py-2">
                        <span className="font-semibold text-high-contrast text-sm">{coach.name}</span>
                        <span className="text-xs text-medium-contrast">
                          Hired: {coach.date_of_hire ? new Date(coach.date_of_hire).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center border-r border-brand-olive/20">
                      <Badge 
                        variant="outline" 
                        className={`font-semibold ${
                          getCoachProgress(coach.id) >= 80 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : getCoachProgress(coach.id) >= 50 
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        {Math.round(getCoachProgress(coach.id))}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center border-r border-brand-olive/20">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 font-semibold">
                        {Math.round(getTotalProgress(coach.id))}%
                      </Badge>
                    </TableCell>
                    {filteredCertifications.map(cert => {
                      const status = getCoachCertificationStatus(coach.id, cert.id);
                      return (
                        <TableCell key={cert.id} className="text-center border-r border-brand-olive/10 last:border-r-0 py-3">
                          <div className="flex justify-center">
                            {status === 'completed' && (
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-white" />
                              </div>
                            )}
                            {status === 'in_progress' && (
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">⏳</span>
                              </div>
                            )}
                            {status === 'expired' && (
                              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">⚠️</span>
                              </div>
                            )}
                            {status === 'not_started' && (
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600 text-xs font-bold">—</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Legend */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-high-contrast">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">⏳</span>
              </div>
              <span className="font-medium text-high-contrast">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">⚠️</span>
              </div>
              <span className="font-medium text-high-contrast">Expired</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xs font-bold">—</span>
              </div>
              <span className="font-medium text-high-contrast">Not Started</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="font-medium text-high-contrast">Required Certification</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 