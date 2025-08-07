import React, { useState } from "react";
import {
  Loader2,
  User as UserIcon,
  MapPin,
  Globe,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import {
  formatTimezone,
  formatDate,
  getInitials,
  getAvatarColor,
} from "@/lib/utils-user";

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onView: (user: User) => void;
  loading?: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
  onView,
  loading = false,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4 flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-400" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 flex items-center justify-center">
          <UserIcon className="h-10 w-10 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          No users found
        </h3>
        <p className="text-slate-600 max-w-sm mx-auto">
          Get started by creating your first user or adjust your search
          criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-300px)] overflow-y-auto">
      <Table>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-cyan-50/30 transition-all duration-200 group border-indigo-100"
            >
              <TableCell className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-full ${getAvatarColor(
                        user.name
                      )} flex items-center justify-center text-white font-bold shadow-lg`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-800 truncate">
                          {user.name}
                        </h3>
                      </div>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-indigo-400" />
                          <span>ZIP {user.zipCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-purple-400" />
                          <span>
                            {user.latitude.toFixed(4)},{" "}
                            {user.longitude.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <span>{formatTimezone(user.timezone)}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-slate-500">
                          Created {formatDate(user.createdAt)}
                          {user.updatedAt !== user.createdAt && (
                            <span> • Updated {formatDate(user.updatedAt)}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(user)}
                      className="gap-2 text-white hover:text-indigo-600 hover:bg-indigo-50"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                      className="gap-2 text-white hover:text-purple-600 hover:bg-purple-50"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className={`gap-2 transition-all ${
                        deleteConfirm === user.id
                          ? "text-red-700 bg-red-50 hover:bg-red-100 opacity-100"
                          : "text-white hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                      {deleteConfirm === user.id ? "Confirm?" : "Delete"}
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
