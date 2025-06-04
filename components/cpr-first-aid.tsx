"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import * as motion from "motion/react-client";
import { AnimatedContainer, AnimatedItem, LoadingSkeleton } from "@/components/ui/animated-container";
import type { 
  Office, 
  CoachOfficeAssignment, 
  CprFirstAidRecord, 
  CprFirstAidProps
} from "@/lib/types";

export function CprFirstAid({ coaches, onDataChange }: CprFirstAidProps) {
  const [loading, setLoading] = useState(true);
  const [offices, setOffices] = useState<Office[]>([]);
  const [assignments, setAssignments] = useState<CoachOfficeAssignment[]>([]);
  const [cprRecords, setCprRecords] = useState<CprFirstAidRecord[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingRecord, setEditingRecord] = useState<CprFirstAidRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    coach_id: "",
    region: "",
    office: "",
    cpr_certification_date: "",
    cpr_expiration_date: "",
    first_aid_certification_date: "",
    first_aid_expiration_date: "",
    provider: "",
    certificate_number: "",
    notes: ""
  });
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch offices
      const { data: officesData, error: officesError } = await supabase
        .from("offices")
        .select("*")
        .order("name");

      if (officesError) {
        console.error("Error fetching offices:", officesError);
      } else {
        setOffices(officesData || []);
      }

      // Fetch coach office assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("coach_office_assignments")
        .select(`
          *,
          coach:coaches(name),
          office:offices(name, location, region)
        `)
        .order("created_at");

      if (assignmentsError) {
        console.error("Error fetching assignments:", assignmentsError);
      } else {
        setAssignments(assignmentsData || []);
      }

      // Fetch CPR/First Aid records
      const { data: cprData, error: cprError } = await supabase
        .from("cpr_first_aid_records")
        .select(`
          *,
          coach:coaches(name),
          office:offices(name, location, region)
        `)
        .order("updated_at", { ascending: false });

      if (cprError) {
        console.error("Error fetching CPR records:", cprError);
      } else {
        setCprRecords(cprData || []);
      }
      
    } catch (error) {
      console.error("Error fetching CPR/First Aid data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

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

  const resetForm = () => {
    setFormData({
      coach_id: "",
      region: "",
      office: "",
      cpr_certification_date: "",
      cpr_expiration_date: "",
      first_aid_certification_date: "",
      first_aid_expiration_date: "",
      provider: "",
      certificate_number: "",
      notes: ""
    });
    setEditingRecord(null);
  };

  const handleAddRecord = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditRecord = (record: CprFirstAidRecord) => {
    setFormData({
      coach_id: record.coach_id,
      region: record.office?.region || "",
      office: record.office?.name || "",
      cpr_certification_date: record.cpr_certification_date || "",
      cpr_expiration_date: record.cpr_expiration_date || "",
      first_aid_certification_date: record.first_aid_certification_date || "",
      first_aid_expiration_date: record.first_aid_expiration_date || "",
      provider: record.provider || "",
      certificate_number: record.certificate_number || "",
      notes: record.notes || ""
    });
    setEditingRecord(record);
    setIsDialogOpen(true);
  };

  const handleSaveRecord = async () => {
    try {
      setLoading(true);
      
      // First, find or create the office
      let officeId: string;
      
      // Check if office already exists
      const { data: existingOffice } = await supabase
        .from("offices")
        .select("id")
        .eq("name", formData.office)
        .eq("region", formData.region)
        .single();
      
      if (existingOffice) {
        officeId = existingOffice.id;
      } else {
        // Create new office
        const { data: newOffice, error: officeError } = await supabase
          .from("offices")
          .insert({
            name: formData.office,
            location: formData.office, // Use office name as location for simplicity
            region: formData.region
          })
          .select("id")
          .single();
        
        if (officeError) throw officeError;
        officeId = newOffice.id;
      }
      
      if (editingRecord) {
        // Update existing record
        const { error } = await supabase
          .from("cpr_first_aid_records")
          .update({
            coach_id: formData.coach_id,
            office_id: officeId,
            cpr_certification_date: formData.cpr_certification_date || null,
            cpr_expiration_date: formData.cpr_expiration_date || null,
            first_aid_certification_date: formData.first_aid_certification_date || null,
            first_aid_expiration_date: formData.first_aid_expiration_date || null,
            provider: formData.provider || null,
            certificate_number: formData.certificate_number || null,
            notes: formData.notes || null
          })
          .eq("id", editingRecord.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from("cpr_first_aid_records")
          .insert({
            coach_id: formData.coach_id,
            office_id: officeId,
            cpr_certification_date: formData.cpr_certification_date || null,
            cpr_expiration_date: formData.cpr_expiration_date || null,
            first_aid_certification_date: formData.first_aid_certification_date || null,
            first_aid_expiration_date: formData.first_aid_expiration_date || null,
            provider: formData.provider || null,
            certificate_number: formData.certificate_number || null,
            notes: formData.notes || null
          });

        if (error) throw error;
      }

      setIsDialogOpen(false);
      resetForm();
      await fetchData();
      onDataChange();
    } catch (error) {
      console.error("Error saving record:", error);
      alert("Failed to save record. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <Heart className="h-6 w-6" />
            </motion.div>
            CPR & First Aid Certifications
          </h2>
          <p className="text-medium-contrast">
            Track CPR and First Aid certifications for all coaches and their assigned offices
          </p>
        </div>
        <div className="flex gap-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" className="gap-2 hover-scale">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.4,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={handleAddRecord} className="gap-2 bg-brand-olive hover:bg-brand-olive/90 hover-scale">
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
          </motion.div>
        </div>
      </AnimatedItem>

      {/* Status Overview Cards */}
      <AnimatedItem className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.1,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 20 }
          }}
        >
          <Card className="border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Current</CardTitle>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-green-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.4,
                  type: "spring",
                  stiffness: 150,
                  damping: 12
                }}
              >
                {statusCounts.current}
              </motion.div>
              <p className="text-xs text-medium-contrast">Up to date certifications</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 20 }
          }}
        >
          <Card className="border-yellow-200 hover:border-yellow-300 hover:shadow-lg transition-all duration-300 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Expiring Soon</CardTitle>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <Clock className="h-4 w-4 text-yellow-600" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-yellow-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.5,
                  type: "spring",
                  stiffness: 150,
                  damping: 12
                }}
              >
                {statusCounts.expiring_soon}
              </motion.div>
              <p className="text-xs text-medium-contrast">Renewal needed within 30 days</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 20 }
          }}
        >
          <Card className="border-red-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Expired</CardTitle>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <XCircle className="h-4 w-4 text-red-600" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-red-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.6,
                  type: "spring",
                  stiffness: 150,
                  damping: 12
                }}
              >
                {statusCounts.expired}
              </motion.div>
              <p className="text-xs text-medium-contrast">Immediate action required</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.4,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 20 }
          }}
        >
          <Card className="border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Not Certified</CardTitle>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.6,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <AlertTriangle className="h-4 w-4 text-gray-600" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-gray-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.7,
                  type: "spring",
                  stiffness: 150,
                  damping: 12
                }}
              >
                {statusCounts.not_certified}
              </motion.div>
              <p className="text-xs text-medium-contrast">Certification needed</p>
            </CardContent>
          </Card>
        </motion.div>
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
                  {filteredData.map((record, index) => (
                    <motion.tr 
                      key={record.id} 
                      className="hover:bg-muted/25"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 120,
                        damping: 15
                      }}
                      whileHover={{ 
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <td className="border border-border p-3 text-sm">
                        <motion.div 
                          className="font-medium text-high-contrast"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                        >
                          {record.coach?.name || 'Unknown Coach'}
                        </motion.div>
                      </td>
                      <td className="border border-border p-3 text-sm">
                        <motion.div 
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05 + 0.15,
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                          }}
                        >
                          <MapPin className="h-4 w-4 text-brand-olive" />
                          <div>
                            <div className="font-medium text-high-contrast">{record.office?.name}</div>
                            <div className="text-xs text-medium-contrast">{record.office?.location}</div>
                          </div>
                        </motion.div>
                      </td>
                      <td className="border border-border p-3 text-sm text-medium-contrast">
                        {record.office?.region}
                      </td>
                      <td className="border border-border p-3 text-sm">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05 + 0.2,
                            type: "spring",
                            stiffness: 150,
                            damping: 15
                          }}
                        >
                          {record.assignment?.is_primary ? (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Primary</Badge>
                          ) : (
                            <Badge variant="outline">Secondary</Badge>
                          )}
                        </motion.div>
                      </td>
                      <td className="border border-border p-3 text-sm">
                        {record.cpr_certification_date ? (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: index * 0.05 + 0.25,
                              type: "spring",
                              stiffness: 120,
                              damping: 15
                            }}
                          >
                            <div className="text-high-contrast">{new Date(record.cpr_certification_date).toLocaleDateString()}</div>
                            <div className="text-xs text-medium-contrast">Certified</div>
                          </motion.div>
                        ) : (
                          <div className="text-medium-contrast">Not certified</div>
                        )}
                      </td>
                      <td className="border border-border p-3 text-sm">
                        {record.first_aid_certification_date ? (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: index * 0.05 + 0.3,
                              type: "spring",
                              stiffness: 120,
                              damping: 15
                            }}
                          >
                            <div className="text-high-contrast">{new Date(record.first_aid_certification_date).toLocaleDateString()}</div>
                            <div className="text-xs text-medium-contrast">Certified</div>
                          </motion.div>
                        ) : (
                          <div className="text-medium-contrast">Not certified</div>
                        )}
                      </td>
                      <td className="border border-border p-3 text-sm text-medium-contrast">
                        {record.provider || 'N/A'}
                      </td>
                      <td className="border border-border p-3 text-sm">
                        {record.cpr_expiration_date ? (
                          <motion.div 
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: index * 0.05 + 0.35,
                              type: "spring",
                              stiffness: 100,
                              damping: 15
                            }}
                          >
                            <Calendar className="h-4 w-4 text-brand-olive" />
                            <div>
                              <div className="text-high-contrast">{new Date(record.cpr_expiration_date).toLocaleDateString()}</div>
                              <div className="text-xs text-medium-contrast">
                                {Math.ceil((new Date(record.cpr_expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-medium-contrast">N/A</div>
                        )}
                      </td>
                      <td className="border border-border p-3 text-sm">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05 + 0.4,
                            type: "spring",
                            stiffness: 150,
                            damping: 15
                          }}
                        >
                          {getStatusBadge(record.status)}
                        </motion.div>
                      </td>
                      <td className="border border-border p-3 text-sm">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05 + 0.45,
                            type: "spring",
                            stiffness: 150,
                            damping: 15
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 hover-scale"
                            onClick={() => handleEditRecord(record)}
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        </motion.div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </AnimatedItem>

      {/* Add/Edit Record Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? "Edit CPR/First Aid Record" : "Add CPR/First Aid Record"}
              </DialogTitle>
              <DialogDescription>
                {editingRecord 
                  ? "Update the CPR and First Aid certification information for this coach and office."
                  : "Add CPR and First Aid certification information for a coach at a specific office."
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <motion.div 
                className="grid gap-4 md:grid-cols-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="coach">Coach</Label>
                  <Select value={formData.coach_id} onValueChange={(value) => setFormData(prev => ({ ...prev, coach_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select coach" />
                    </SelectTrigger>
                    <SelectContent>
                      {coaches.map((coach) => (
                        <SelectItem key={coach.id} value={coach.id}>
                          {coach.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    placeholder="Enter region"
                  />
                </div>
              </motion.div>

              <motion.div 
                className="grid gap-4 md:grid-cols-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="office">Office</Label>
                  <Input
                    id="office"
                    value={formData.office}
                    onChange={(e) => setFormData(prev => ({ ...prev, office: e.target.value }))}
                    placeholder="Enter office"
                  />
                </div>
              </motion.div>

              <motion.div 
                className="grid gap-4 md:grid-cols-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="cpr_cert_date">CPR Certification Date</Label>
                  <Input
                    id="cpr_cert_date"
                    type="date"
                    value={formData.cpr_certification_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpr_certification_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpr_exp_date">CPR Expiration Date</Label>
                  <Input
                    id="cpr_exp_date"
                    type="date"
                    value={formData.cpr_expiration_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpr_expiration_date: e.target.value }))}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="grid gap-4 md:grid-cols-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="first_aid_cert_date">First Aid Certification Date</Label>
                  <Input
                    id="first_aid_cert_date"
                    type="date"
                    value={formData.first_aid_certification_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_aid_certification_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="first_aid_exp_date">First Aid Expiration Date</Label>
                  <Input
                    id="first_aid_exp_date"
                    type="date"
                    value={formData.first_aid_expiration_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_aid_expiration_date: e.target.value }))}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="grid gap-4 md:grid-cols-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="provider">Training Provider</Label>
                  <Input
                    id="provider"
                    value={formData.provider}
                    onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                    placeholder="e.g., American Red Cross"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate_number">Certificate Number</Label>
                  <Input
                    id="certificate_number"
                    value={formData.certificate_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, certificate_number: e.target.value }))}
                    placeholder="Certificate number"
                  />
                </div>
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
              >
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about the certification..."
                  rows={3}
                />
              </motion.div>
            </div>

            <DialogFooter>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.45 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleSaveRecord}
                  disabled={!formData.coach_id || !formData.region || !formData.office}
                  className="bg-brand-olive hover:bg-brand-olive/90"
                >
                  {editingRecord ? "Update Record" : "Add Record"}
                </Button>
              </motion.div>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatedContainer>
  );
} 