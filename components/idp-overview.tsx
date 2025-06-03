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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✓</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">⏳</Badge>;
      case 'expired': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">⚠️</Badge>;
      default: return <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">—</Badge>;
    }
  };

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
          <CardTitle className="text-lg">Certification Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48 sticky left-0 bg-white z-10">Coach</TableHead>
                  <TableHead className="w-24 text-center">Required %</TableHead>
                  <TableHead className="w-24 text-center">Total %</TableHead>
                  {filteredCertifications.map(cert => (
                    <TableHead key={cert.id} className="w-20 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {cert.is_required && <Star className="h-3 w-3 text-amber-500" />}
                        <span className="text-xs font-medium truncate max-w-16" title={cert.name}>
                          {cert.name.split(' ')[0]}
                        </span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {coaches.map(coach => (
                  <TableRow key={coach.id}>
                    <TableCell className="sticky left-0 bg-white z-10">
                      <div className="flex flex-col">
                        <span className="font-medium text-high-contrast">{coach.name}</span>
                        <span className="text-xs text-medium-contrast">
                          Hired: {coach.date_of_hire ? new Date(coach.date_of_hire).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`${getCoachProgress(coach.id) >= 80 ? 'bg-green-50 text-green-700 border-green-200' : getCoachProgress(coach.id) >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {Math.round(getCoachProgress(coach.id))}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {Math.round(getTotalProgress(coach.id))}%
                      </Badge>
                    </TableCell>
                    {filteredCertifications.map(cert => {
                      const status = getCoachCertificationStatus(coach.id, cert.id);
                      return (
                        <TableCell key={cert.id} className="text-center">
                          {getStatusBadge(status)}
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

      {/* Legend */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✓</Badge>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">⏳</Badge>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">⚠️</Badge>
              <span>Expired</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">—</Badge>
              <span>Not Started</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500" />
              <span>Required</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 