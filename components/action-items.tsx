"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  PlusCircle, 
  Save, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  User,
  Edit3
} from "lucide-react";
import { AnimatedContainer, AnimatedItem } from "@/components/ui/animated-container";
import type { Coach } from "@/lib/types";

interface ActionItem {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string | null; // coach_id
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  coach?: Coach;
}

interface ActionItemsProps {
  coaches: Coach[];
  onDataChange: () => void;
}

export function ActionItems({ coaches, onDataChange }: ActionItemsProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ActionItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const supabase = createClient();

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    due_date: '',
    status: 'open' as 'open' | 'in_progress' | 'completed' | 'cancelled'
  });

  const fetchActionItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("action_items")
        .select(`
          *,
          coach:coaches(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setActionItems(data || []);
    } catch (error) {
      console.error("Error fetching action items:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchActionItems();
  }, [fetchActionItems]);

  const addActionItem = async () => {
    if (!newItem.title.trim()) return;

    try {
      const { error } = await supabase
        .from("action_items")
        .insert({
          title: newItem.title,
          description: newItem.description || null,
          assigned_to: newItem.assigned_to || null,
          priority: newItem.priority,
          status: newItem.status,
          due_date: newItem.due_date || null
        });

      if (error) throw error;

      setNewItem({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        due_date: '',
        status: 'open'
      });
      setShowAddDialog(false);
      await fetchActionItems();
      onDataChange();
    } catch (error) {
      console.error("Error adding action item:", error);
      alert("Failed to add action item");
    }
  };

  const updateActionItem = async (item: ActionItem) => {
    try {
      const { error } = await supabase
        .from("action_items")
        .update({
          title: item.title,
          description: item.description,
          assigned_to: item.assigned_to,
          priority: item.priority,
          status: item.status,
          due_date: item.due_date
        })
        .eq("id", item.id);

      if (error) throw error;

      setEditingItem(null);
      await fetchActionItems();
      onDataChange();
    } catch (error) {
      console.error("Error updating action item:", error);
      alert("Failed to update action item");
    }
  };

  const deleteActionItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this action item?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("action_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      await fetchActionItems();
      onDataChange();
    } catch (error) {
      console.error("Error deleting action item:", error);
      alert("Failed to delete action item");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <Trash2 className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString();
  };

  const filteredItems = actionItems.filter(item => {
    const statusMatch = filterStatus === "all" || item.status === filterStatus;
    const priorityMatch = filterPriority === "all" || item.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const openItems = actionItems.filter(item => item.status === 'open').length;
  const inProgressItems = actionItems.filter(item => item.status === 'in_progress').length;
  const completedItems = actionItems.filter(item => item.status === 'completed').length;

  return (
    <AnimatedContainer variant="stagger" className="space-y-6">
      <AnimatedItem className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-high-contrast">Action Items</h2>
          <p className="text-medium-contrast">Track and manage open action items and tasks</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2 hover-lift">
          <PlusCircle className="h-4 w-4" />
          Add Action Item
        </Button>
      </AnimatedItem>

      {/* Summary Cards */}
      <AnimatedItem>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-medium-contrast">Open</p>
                  <p className="text-2xl font-bold text-high-contrast">{openItems}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-medium-contrast">In Progress</p>
                  <p className="text-2xl font-bold text-high-contrast">{inProgressItems}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-medium-contrast">Completed</p>
                  <p className="text-2xl font-bold text-high-contrast">{completedItems}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-medium-contrast">Total</p>
                  <p className="text-2xl font-bold text-high-contrast">{actionItems.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-brand-olive" />
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedItem>

      {/* Filters */}
      <AnimatedItem>
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="priority-filter">Priority</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedItem>

      {/* Action Items List */}
      <AnimatedItem>
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover-lift">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(item.status)}
                      <h3 className="font-semibold text-high-contrast truncate">{item.title}</h3>
                      <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="text-sm text-medium-contrast mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-medium-contrast">
                      {item.coach && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.coach.name}
                        </div>
                      )}
                      {item.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {formatDate(item.due_date)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteActionItem(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredItems.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-high-contrast">No Action Items Found</CardTitle>
                <CardDescription className="text-medium-contrast">
                  {actionItems.length === 0 
                    ? "Create your first action item to get started with task tracking."
                    : "No action items match the current filters."
                  }
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </AnimatedItem>

      {/* Add Action Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Action Item</DialogTitle>
            <DialogDescription>
              Create a new action item to track tasks and follow-ups.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-title">Title</Label>
              <Input
                id="item-title"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Action item title"
              />
            </div>
            <div>
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description..."
              />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div>
                <Label htmlFor="item-assigned">Assigned To</Label>
                <Select value={newItem.assigned_to} onValueChange={(value) => setNewItem(prev => ({ ...prev, assigned_to: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {coaches.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>{coach.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="item-priority">Priority</Label>
                <Select value={newItem.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setNewItem(prev => ({ ...prev, priority: value }))}>
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
            <div>
              <Label htmlFor="item-due-date">Due Date</Label>
              <Input
                id="item-due-date"
                type="date"
                value={newItem.due_date}
                onChange={(e) => setNewItem(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addActionItem} disabled={!newItem.title.trim()}>
              Add Action Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Action Item Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Action Item</DialogTitle>
              <DialogDescription>
                Update the action item details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <Label htmlFor="edit-assigned">Assigned To</Label>
                  <Select value={editingItem.assigned_to || ''} onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, assigned_to: value || null } : null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select coach" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {coaches.map((coach) => (
                        <SelectItem key={coach.id} value={coach.id}>{coach.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select value={editingItem.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setEditingItem(prev => prev ? { ...prev, priority: value } : null)}>
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
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editingItem.status} onValueChange={(value: 'open' | 'in_progress' | 'completed' | 'cancelled') => setEditingItem(prev => prev ? { ...prev, status: value } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-due-date">Due Date</Label>
                  <Input
                    id="edit-due-date"
                    type="date"
                    value={editingItem.due_date || ''}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, due_date: e.target.value } : null)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={() => updateActionItem(editingItem)}>
                Update Action Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatedContainer>
  );
} 