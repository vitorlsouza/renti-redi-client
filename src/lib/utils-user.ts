// User-related utility functions

/**
 * Formats timezone string by adding space after UTC
 */
export const formatTimezone = (timezone: string): string => {
  return timezone.replace("UTC", "UTC ");
};

/**
 * Formats date string to localized format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formats date to relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'Just now';
};

/**
 * Gets user initials from full name
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Avatar color palette - consistent gradient combinations
 */
const AVATAR_COLORS = [
  "bg-gradient-to-br from-indigo-400 to-purple-500",
  "bg-gradient-to-br from-cyan-400 to-blue-500",
  "bg-gradient-to-br from-purple-400 to-pink-500",
  "bg-gradient-to-br from-pink-400 to-rose-500",
  "bg-gradient-to-br from-blue-400 to-indigo-500",
  "bg-gradient-to-br from-violet-400 to-purple-500",
  "bg-gradient-to-br from-teal-400 to-cyan-500",
  "bg-gradient-to-br from-emerald-400 to-green-500",
] as const;

/**
 * Gets consistent avatar color based on user name
 * Uses char code to ensure same name always gets same color
 */
export const getAvatarColor = (name: string): string => {
  const charCode = name.charCodeAt(0);
  return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
};

/**
 * Formats coordinates to display format
 */
export const formatCoordinates = (lat: number, lng: number, precision: number = 4): string => {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

/**
 * Gets user status color based on activity
 */
export const getUserStatusColor = (isOnline: boolean): { dot: string; text: string } => {
  return isOnline
    ? { dot: "bg-emerald-400", text: "text-emerald-600" }
    : { dot: "bg-slate-400", text: "text-slate-500" };
};

/**
 * Generates a user display name with fallback
 */
export const getDisplayName = (firstName?: string, lastName?: string, email?: string): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (email) {
    return email.split('@')[0];
  }
  return 'Unknown User';
};