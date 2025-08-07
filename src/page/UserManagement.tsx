import React, { useEffect, useState, useMemo } from "react";
import { useUsers } from "@/hooks/useUsers";
import { UserForm } from "@/components/UserForm";
import { UserList } from "@/components/UserList";
import { UserDetail } from "@/components/UserDetail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Users, AlertCircle, X, Search } from "lucide-react";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/types/user";

export const UserManagement: React.FC = () => {
  const {
    users,
    selectedUser,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError,
    selectUser,
  } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.zipCode.toLowerCase().includes(query) ||
        user.timezone.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const handleCreateUser = async (userData: CreateUserRequest) => {
    await createUser(userData);
    setShowForm(false);
  };

  const handleUpdateUser = async (userData: UpdateUserRequest) => {
    if (editingUser) {
      await updateUser(editingUser.id, userData);
      setEditingUser(null);
      setShowForm(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    setShowDetail(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
    setShowDetail(false);
  };

  const handleViewUser = (user: User) => {
    selectUser(user);
    setShowDetail(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    clearError();
  };

  const isFormVisible = showForm || editingUser;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 shadow-xl shadow-indigo-500/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-white">
                    User Management
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="gap-2 bg-white text-white shadow-lg shadow-black/10 font-semibold"
                disabled={loading}
              >
                <Plus className="h-5 w-5" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {error && (
          <Card className="mb-6 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg shadow-red-100/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
                  className="text-red-600 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div
            className={`xl:col-span-1 transition-all duration-500 ease-in-out transform ${
              isFormVisible ? "translate-x-0 opacity-100" : "hidden xl:block"
            }`}
          >
            <div className="sticky top-6">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md shadow-indigo-100/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <CardTitle className="text-lg text-slate-800">
                          {editingUser ? "Edit User" : "Create User"}
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          {editingUser ? "Update user" : "Add new user"}
                        </CardDescription>
                      </div>
                    </div>
                    {isFormVisible && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleFormCancel}
                        className="xl:hidden h-8 w-8 p-0 hover:bg-slate-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isFormVisible ? (
                    <UserForm
                      user={editingUser}
                      onSubmit={
                        editingUser ? handleUpdateUser : handleCreateUser
                      }
                      onCancel={handleFormCancel}
                      isLoading={loading}
                    />
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 flex items-center justify-center">
                        <Users className="h-8 w-8 text-indigo-400" />
                      </div>
                      <p className="text-sm leading-relaxed">
                        Click{" "}
                        <strong className="text-indigo-600">"Add User"</strong>{" "}
                        to create a new user or select{" "}
                        <strong className="text-indigo-600">"Edit"</strong> from
                        the user list.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div
            className={`xl:col-span-3 transition-all duration-500 ease-in-out ${
              isFormVisible ? "hidden xl:block" : "block"
            }`}
          >
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md shadow-indigo-100/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
                      Users
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700">
                        {filteredUsers.length}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {filteredUsers.length} of {users.length} users
                    </CardDescription>
                  </div>

                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-black pl-10 bg-white/80 border-indigo-200 focus:bg-white focus:border-indigo-300 transition-all"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <UserList
                  users={filteredUsers}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  onView={handleViewUser}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showDetail && selectedUser && (
        <UserDetail
          user={selectedUser}
          open={showDetail}
          onClose={() => setShowDetail(false)}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};
