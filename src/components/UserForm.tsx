import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, MapPin, AlertCircle } from "lucide-react";
import { userFormSchema, type UserFormData } from "@/lib/validations";
import type { User as UserType, CreateUserRequest } from "@/types/user";

interface UserFormProps {
  user?: UserType | null;
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditMode = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("zipCode", user.zipCode);
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    if (!isEditMode) {
      reset();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-700 flex items-center gap-2"
          >
            <User className="h-4 w-4 text-indigo-500" />
            Name *
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Enter name"
            disabled={isLoading}
            className={`text-black ${
              errors.name
                ? "border-red-300 focus:border-red-300 focus:ring-red-200"
                : "border-slate-300 focus:border-indigo-300 focus:ring-indigo-200"
            }`}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="zipCode"
            className="text-sm font-medium text-slate-700 flex items-center gap-2"
          >
            <MapPin className="h-4 w-4 text-purple-500" />
            ZIP Code *
          </label>
          <Input
            id="zipCode"
            type="text"
            placeholder="12345 or 12345-6789"
            disabled={isLoading}
            className={`text-black ${
              errors.zipCode
                ? "border-red-300 focus:border-red-300 focus:ring-red-200"
                : "border-slate-300 focus:border-indigo-300 focus:ring-indigo-200"
            }`}
            {...register("zipCode")}
          />
          {errors.zipCode && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.zipCode.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading || (!isDirty && isEditMode)}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {isEditMode ? "Update User" : "Create User"}
              </div>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border-slate-300 text-white hover:bg-slate-50"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
