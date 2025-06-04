"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Users, Mail } from "lucide-react";
import { AnimatedContainer, AnimatedItem, LoadingSpinner } from "@/components/ui/animated-container";
import * as motion from "motion/react-client";

interface AuthorizedUser {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
}

export function AuthorizedUsersManagement() {
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchAuthorizedUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("authorized_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAuthorizedUsers(data || []);
    } catch (error) {
      console.error("Error fetching authorized users:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAuthorizedUsers();
  }, [fetchAuthorizedUsers]);

  const addAuthorizedUser = async () => {
    if (!newEmail.trim()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("authorized_users")
        .insert({
          email: newEmail.toLowerCase().trim(),
          name: newName.trim() || null,
        });

      if (error) throw error;

      setNewEmail("");
      setNewName("");
      await fetchAuthorizedUsers();
    } catch (error) {
      console.error("Error adding authorized user:", error);
      alert(`Failed to add user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const removeAuthorizedUser = async (id: string) => {
    if (!confirm("Are you sure you want to remove this authorized user?")) return;

    try {
      const { error } = await supabase
        .from("authorized_users")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchAuthorizedUsers();
    } catch (error) {
      console.error("Error removing authorized user:", error);
      alert(`Failed to remove user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("authorized_users")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      await fetchAuthorizedUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      alert(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <AnimatedContainer variant="fadeIn" className="space-y-6">
        <LoadingSpinner />
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer variant="stagger" className="space-y-4 sm:space-y-6">
      <AnimatedItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-brand-olive" />
            <span className="text-brand-olive">Authorized Users</span>
          </h2>
          <p className="text-medium-contrast text-sm">
            Manage who can sign up for the application
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.6,
            delay: 0.2,
            scale: { type: "spring", visualDuration: 0.6, bounce: 0.3 }
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 20 }
          }}
        >
          <Badge variant="outline" className="gap-1 border-brand-olive/30 text-brand-olive text-xs hover-scale">
            <motion.div
              initial={{ opacity: 0, rotate: -180, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ 
                duration: 0.5,
                delay: 0.3,
                rotate: { type: "spring", stiffness: 200, damping: 15 },
                scale: { type: "spring", visualDuration: 0.5, bounce: 0.4 }
              }}
            >
              <Mail className="h-3 w-3" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.4,
                delay: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 }
              }}
            >
              {authorizedUsers.filter(u => u.is_active).length} Active Users
            </motion.span>
          </Badge>
        </motion.div>
      </AnimatedItem>

      {/* Add New User */}
      <AnimatedItem>
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg text-high-contrast">Add New Authorized User</CardTitle>
            <CardDescription className="text-medium-contrast text-sm">
              Add an email address to allow someone to sign up
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-high-contrast text-sm">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@freedomforever.com"
                  className="mobile-touch-target"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-high-contrast text-sm">Name (Optional)</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Full Name"
                  className="mobile-touch-target"
                />
              </div>
            </div>
            <Button 
              onClick={addAuthorizedUser} 
              disabled={saving || !newEmail.trim()}
              className="gap-2 w-full sm:w-auto mobile-touch-target bg-brand-olive hover:bg-brand-olive/90 hover-lift hover-glow"
            >
              <Plus className="h-4 w-4" />
              {saving ? "Adding..." : "Add User"}
            </Button>
          </CardContent>
        </Card>
      </AnimatedItem>

      {/* Users List */}
      <AnimatedItem>
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg text-high-contrast">Current Authorized Users</CardTitle>
            <CardDescription className="text-medium-contrast text-sm">
              Users who can sign up for the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatedContainer variant="stagger" className="space-y-3">
              {authorizedUsers.length === 0 ? (
                <AnimatedItem>
                  <p className="text-medium-contrast text-center py-8">
                    No authorized users found. Add some users above.
                  </p>
                </AnimatedItem>
              ) : (
                authorizedUsers.map((user) => (
                  <AnimatedItem
                    key={user.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border rounded-lg hover:bg-muted/50 hover-lift`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-high-contrast truncate">{user.email}</span>
                        <Badge 
                          variant={user.is_active ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {user.name && (
                        <p className="text-sm text-medium-contrast">{user.name}</p>
                      )}
                      <p className="text-xs text-medium-contrast">
                        Added: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className="text-xs mobile-touch-target hover-scale"
                      >
                        {user.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAuthorizedUser(user.id)}
                        className="text-red-600 hover:text-red-700 mobile-touch-target hover-scale"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </AnimatedItem>
                ))
              )}
            </AnimatedContainer>
          </CardContent>
        </Card>
      </AnimatedItem>
    </AnimatedContainer>
  );
} 