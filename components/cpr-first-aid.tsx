"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Heart, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  Plus,
  Edit,
  Filter,
  Download
} from "lucide-react";
import { AnimatedContainer, AnimatedItem, LoadingSkeleton } from "@/components/ui/animated-container";
import type { 
  Office, 
  CoachOfficeAssignment, 
  CprFirstAidRecord, 
  CprFirstAidProps 
} from "@/lib/types";

export function CprFirstAid({ coaches }: CprFirstAidProps) {
  const [loading, setLoading] = useState(true);
  const [offices, setOffices] = useState<Office[]>([]);
  const [assignments, setAssignments] = useState<CoachOfficeAssignment[]>([]);
  const [cprRecords, setCprRecords] = useState<CprFirstAidRecord[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // For now, we'll create mock data since the tables don't exist yet
      // In production, these would be actual Supabase queries
      
      // Mock offices data
      const mockOffices: Office[] = [
        { id: "1", name: "Denver", location: "Colorado", region: "Mountain West", created_at: new Date().toISOString() },
        { id: "2", name: "Boise", location: "Idaho", region: "Mountain West", created_at: new Date().toISOString() },
        { id: "3", name: "Salt Lake City", location: "Utah", region: "Mountain West", created_at: new Date().toISOString() },
        { id: "4", name: "Portland", location: "Oregon", region: "Mountain West", created_at: new Date().toISOString() },
        { id: "5", name: "Lubbock", location: "Texas", region: "Texas", created_at: new Date().toISOString() },
        { id: "6", name: "South Houston", location: "Texas", region: "Texas", created_at: new Date().toISOString() },
        { id: "7", name: "Dallas", location: "Texas", region: "Texas", created_at: new Date().toISOString() },
        { id: "8", name: "Fort Worth", location: "Texas", region: "Texas", created_at: new Date().toISOString() },
        { id: "9", name: "Yuma", location: "Arizona", region: "SouthWest", created_at: new Date().toISOString() },
        { id: "10", name: "Albuquerque", location: "New Mexico", region: "Southwest", created_at: new Date().toISOString() },
        { id: "11", name: "Sacramento", location: "California", region: "NorCal", created_at: new Date().toISOString() },
        { id: "12", name: "Livermore", location: "California", region: "NorCal", created_at: new Date().toISOString() },
        { id: "13", name: "South Shore MA", location: "Massachusetts", region: "Northeast", created_at: new Date().toISOString() },
        { id: "14", name: "Orlando", location: "Florida", region: "SouthEast", created_at: new Date().toISOString() },
      ];

      // Mock assignments - assign coaches to offices based on the image data
      const mockAssignments: CoachOfficeAssignment[] = [
        // Mike - Mountain West offices
        { id: "1", coach_id: coaches[0]?.id || "1", office_id: "1", assigned_date: "2024-01-01", is_primary: true, created_at: new Date().toISOString() },
        { id: "2", coach_id: coaches[0]?.id || "1", office_id: "2", assigned_date: "2024-01-01", is_primary: false, created_at: new Date().toISOString() },
        { id: "3", coach_id: coaches[0]?.id || "1", office_id: "3", assigned_date: "2024-01-01", is_primary: false, created_at: new Date().toISOString() },
        { id: "4", coach_id: coaches[0]?.id || "1", office_id: "4", assigned_date: "2024-01-01", is_primary: false, created_at: new Date().toISOString() },
        
        // Hugh - Texas offices
        { id: "5", coach_id: coaches[1]?.id || "2", office_id: "5", assigned_date: "2024-01-01", is_primary: true, created_at: new Date().toISOString() },
        { id: "6", coach_id: coaches[1]?.id || "2", office_id: "6", assigned_date: "2024-01-01", is_primary: false, created_at: new Date().toISOString() },
        { id: "7", coach_id: coaches[1]?.id || "2", office_id: "7", assigned_date: "2024-01-01", is_primary: false, created_at: new Date().toISOString() },
        { id: "8", coach_id: coaches[1]?.id || "2", office_id: "8", assigned_date: "2024-01-01", is_primary: false, created_at: new Date().toISOString() },
        
        // Joe - Southwest offices
        { id: "9", coach_id: coaches[2]?.id || "3", office_id: "9", assigned_date: "2024-01-01", is_primary: true, created_at: new Date().toISOString() },
        { id: "10", coach_id: coaches[2]?.id || "3", office_id: "10", assigned_date: "2024-01-01", is_primary: false, created_at: new Date().toISOString() },
        
        // Additional coaches for other regions...
      ];

      // Mock CPR/First Aid records with various statuses
      const mockCprRecords: CprFirstAidRecord[] = mockAssignments.map((assignment, index) => {
        const statuses: CprFirstAidRecord['status'][] = ['current', 'expiring_soon', 'expired', 'not_certified'];
        const randomStatus = statuses[index % statuses.length];
        
        const baseDate = new Date();
        const cprDate = new Date(baseDate.getTime() - (Math.random() * 365 * 24 * 60 * 60 * 1000));
        const firstAidDate = new Date(baseDate.getTime() - (Math.random() * 365 * 24 * 60 * 60 * 1000));
        
        return {
          id: `cpr-${assignment.id}`,
          coach_id: assignment.coach_id,
          office_id: assignment.office_id,
          cpr_certification_date: randomStatus !== 'not_certified' ? cprDate.toISOString().split('T')[0] : null,
          cpr_expiration_date: randomStatus !== 'not_certified' ? new Date(cprDate.getTime() + (2 * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : null,
          first_aid_certification_date: randomStatus !== 'not_certified' ? firstAidDate.toISOString().split('T')[0] : null,
          first_aid_expiration_date: randomStatus !== 'not_certified' ? new Date(firstAidDate.getTime() + (2 * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : null,
          provider: randomStatus !== 'not_certified' ? ['American Red Cross', 'American Heart Association', 'National Safety Council'][index % 3] : null,
          certificate_number: randomStatus !== 'not_certified' ? `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
          status: randomStatus,
          notes: index % 3 === 0 ? 'Renewal scheduled for next month' : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });

      setOffices(mockOffices);
      setAssignments(mockAssignments);
      setCprRecords(mockCprRecords);
      
    } catch (error) {
      console.error("Error fetching CPR/First Aid data:", error);
    } finally {
      setLoading(false);
    }
  }, [coaches]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusBadge = (status: CprFirstAidRecord['status']) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Current</Badge>;
      case 'expiring_soon':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      case 'not_certified':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200"><AlertTriangle className="h-3 w-3 mr-1" />Not Certified</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getFilteredData = () => {
    let filtered = cprRecords;

    if (selectedCoach !== "all") {
      filtered = filtered.filter(record => record.coach_id === selectedCoach);
    }

    if (selectedRegion !== "all") {
      const regionOffices = offices.filter(office => office.region === selectedRegion);
      const regionOfficeIds = regionOffices.map(office => office.id);
      filtered = filtered.filter(record => regionOfficeIds.includes(record.office_id));
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    return filtered.map(record => {
      const coach = coaches.find(c => c.id === record.coach_id);
      const office = offices.find(o => o.id === record.office_id);
      const assignment = assignments.find(a => a.coach_id === record.coach_id && a.office_id === record.office_id);
      
      return {
        ...record,
        coach,
        office,
        assignment
      };
    });
  };

  const getRegions = () => {
    const regions = [...new Set(offices.map(office => office.region))];
    return regions.sort();
  };

  const getStatusCounts = () => {
    const counts = {
      current: 0,
      expiring_soon: 0,
      expired: 0,
      not_certified: 0
    };

    cprRecords.forEach(record => {
      counts[record.status]++;
    });

    return counts;
  };

  if (loading) {
    return (
      <AnimatedContainer variant="fadeIn" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <LoadingSkeleton className="h-8 w-64" />
            <LoadingSkeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-24" />
          ))}
        </div>
        <LoadingSkeleton className="h-96" />
      </AnimatedContainer>
    );
  }

  const filteredData = getFilteredData();
  const statusCounts = getStatusCounts();

  return (
    <AnimatedContainer variant="stagger" className="space-y-6">
      {/* Header */}
      <AnimatedItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-olive flex items-center gap-2">
            <Heart className="h-6 w-6" />
            CPR & First Aid Certifications
          </h2>
          <p className="text-medium-contrast">
            Track CPR and First Aid certifications for all coaches and their assigned offices
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-brand-olive hover:bg-brand-olive/90">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
      </AnimatedItem>

      {/* Status Overview Cards */}
      <AnimatedItem className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200 hover:border-green-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-high-contrast">Current</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.current}</div>
            <p className="text-xs text-medium-contrast">Up to date certifications</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 hover:border-yellow-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-high-contrast">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.expiring_soon}</div>
            <p className="text-xs text-medium-contrast">Renewal needed within 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 hover:border-red-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-high-contrast">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.expired}</div>
            <p className="text-xs text-medium-contrast">Immediate action required</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 hover:border-gray-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-high-contrast">Not Certified</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.not_certified}</div>
            <p className="text-xs text-medium-contrast">Certification needed</p>
          </CardContent>
        </Card>
      </AnimatedItem>

      {/* Filters */}
      <AnimatedItem>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="coach-filter">Coach</Label>
                <Select value={selectedCoach} onValueChange={setSelectedCoach}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Coaches</SelectItem>
                    {coaches.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>
                        {coach.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region-filter">Region</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {getRegions().map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="not_certified">Not Certified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedItem>

      {/* Main Table */}
      <AnimatedItem>
        <Card>
          <CardHeader>
            <CardTitle>Certification Records</CardTitle>
            <CardDescription>
              {filteredData.length} record{filteredData.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-3 text-left text-sm font-medium text-high-contrast">Coach</th>
                    <th className="border border-border p-3 text-left text-sm font-medium text-high-contrast">Office</th>
                    <th className="border border-border p-3 text-left text-sm font-medium text-high-contrast">Region</th>
                    <th className="border border-border p-3 text-left text-sm font-medium text-high-contrast">Primary</th>
                    <th className="border border-border p-3 text-left text-sm font-medium text-high-contrast">CPR Status</th>
                    <th className="border border-border p-3 text-left text-sm font-medium text-high-contrast">First Aid Status</th>
                    <th className="border border-border p-3 text-left text-sm font-medium text-high-contrast">Provider</th>
                    <th className="border border-border p-3 text-left text-sm font-medium text-high-contrast">Expiration</th>
                    <th className="border border-border p-3 text-left text-sm font-medium text-high-contrast">Status</th>
                    <th className="border border-border p-3 text-left text-sm font-medium text-high-contrast">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/25">
                      <td className="border border-border p-3 text-sm">
                        <div className="font-medium text-high-contrast">
                          {record.coach?.name || 'Unknown Coach'}
                        </div>
                      </td>
                      <td className="border border-border p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-brand-olive" />
                          <div>
                            <div className="font-medium text-high-contrast">{record.office?.name}</div>
                            <div className="text-xs text-medium-contrast">{record.office?.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="border border-border p-3 text-sm text-medium-contrast">
                        {record.office?.region}
                      </td>
                      <td className="border border-border p-3 text-sm">
                        {record.assignment?.is_primary ? (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">Primary</Badge>
                        ) : (
                          <Badge variant="outline">Secondary</Badge>
                        )}
                      </td>
                      <td className="border border-border p-3 text-sm">
                        {record.cpr_certification_date ? (
                          <div>
                            <div className="text-high-contrast">{new Date(record.cpr_certification_date).toLocaleDateString()}</div>
                            <div className="text-xs text-medium-contrast">Certified</div>
                          </div>
                        ) : (
                          <div className="text-medium-contrast">Not certified</div>
                        )}
                      </td>
                      <td className="border border-border p-3 text-sm">
                        {record.first_aid_certification_date ? (
                          <div>
                            <div className="text-high-contrast">{new Date(record.first_aid_certification_date).toLocaleDateString()}</div>
                            <div className="text-xs text-medium-contrast">Certified</div>
                          </div>
                        ) : (
                          <div className="text-medium-contrast">Not certified</div>
                        )}
                      </td>
                      <td className="border border-border p-3 text-sm text-medium-contrast">
                        {record.provider || 'N/A'}
                      </td>
                      <td className="border border-border p-3 text-sm">
                        {record.cpr_expiration_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-brand-olive" />
                            <div>
                              <div className="text-high-contrast">{new Date(record.cpr_expiration_date).toLocaleDateString()}</div>
                              <div className="text-xs text-medium-contrast">
                                {Math.ceil((new Date(record.cpr_expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-medium-contrast">N/A</div>
                        )}
                      </td>
                      <td className="border border-border p-3 text-sm">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="border border-border p-3 text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </AnimatedItem>
    </AnimatedContainer>
  );
} 