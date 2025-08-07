import React from "react";
import {
  MapPin,
  Clock,
  Globe,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types/user";
import {
  formatTimezone,
  formatDate,
  getInitials,
  getAvatarColor,
} from "@/lib/utils-user";

interface UserDetailProps {
  user: User;
  open: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export const UserDetail: React.FC<UserDetailProps> = ({
  user,
  open,
  onClose,
  onEdit,
  onDelete,
}) => {
  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${user.latitude},${user.longitude}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-16 h-16 rounded-full ${getAvatarColor(
                user.name
              )} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
            >
              {getInitials(user.name)}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-800">
                {user.name}
              </DialogTitle>
              <p className="text-sm text-slate-500 font-mono">{user.id}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Information */}
          <Card className="border-0 bg-gradient-to-br from-indigo-50 to-cyan-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-medium text-slate-600">
                      ZIP Code
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-slate-800 pl-6">
                    {user.zipCode}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-slate-600">
                      Timezone
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-slate-800 pl-6">
                    {formatTimezone(user.timezone)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-slate-600">
                      Coordinates
                    </span>
                  </div>
                  <p className="text-lg font-mono text-slate-800 pl-6">
                    {user.latitude.toFixed(6)}, {user.longitude.toFixed(6)}
                  </p>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={openInMaps}
                    variant="outline"
                    size="sm"
                    className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-700">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-slate-600">
                      Created
                    </span>
                  </div>
                  <p className="text-slate-800 pl-6">
                    {formatDate(user.createdAt)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium text-slate-600">
                      Last Updated
                    </span>
                    {user.updatedAt !== user.createdAt && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        Modified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 pl-6">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} className="text-white">
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(user.id)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button
            onClick={() => onEdit(user)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Edit className="h-4 w-4" />
            Edit User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
