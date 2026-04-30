import { ILoginUserDetails } from "../interfaces/User";



export const getDate = () => {
    const now = new Date();
    const formattedDate = formatDate(now);

    return formattedDate;
}

 export const formatDate = (date: Date) => {
    // Get individual components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Return the formatted date string YYYY-MM-dd hh:mm:ss
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
export const formatDateOnly = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
export const getFromDate = () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return formatDateOnly(firstDayOfMonth);
};

export const getToDate = () => {
  const now = new Date();
  return formatDateOnly(now);
};
 export const formatTime = (time: string) => {
  // backend gives time like "11:30:00"
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDuration = (value: number | null | undefined) => {
  if (value == null || isNaN(value)) return "-";

  // Step 1: Convert hours → minutes
  const totalMinutes = Math.round(value * 60);

  // Step 2: Calculate hours & remaining minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Step 3: Format output
  if (totalMinutes === 0) return "0m";

  if (hours === 0) return `${minutes}m`;

  if (minutes === 0) return `${hours}h`;

  return `${hours}h ${minutes}m`;
};
export const formatTimeAMPM = (dateTimeStr: string): string => {
  if (!dateTimeStr) return "-";
  const date = new Date(dateTimeStr);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};
export const formatDateTime = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + 
         date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};
export const formatMinutesToHrMin = (mins?: number) => {
  const total = Math.round(mins ?? 0);

  if (total < 60) return `${total} Min${total === 1 ? "" : "s"}`;

  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  if (minutes === 0) return `${hours} Hr${hours === 1 ? "" : "s"}`;

  return `${hours} hr${hours === 1 ? "" : "s"} ${minutes} Min${minutes === 1 ? "" : "s"}`;
};

 export const getAccessTypeLabel = (type: string) => {
  switch (type) {
    case "MOBILE_APP":
      return "Mobile App Only";
    case "WEB":
      return "Web Only";
    case "MOBILE_AND_WEB":
      return "Web & Mobile";
    default:
      return type;
  }
};
export const hasPermission = (permission: string, user: ILoginUserDetails | null): boolean => {
  console.log("permission name : ",permission)
  if(user && user.permissions) {
    const exists = user.permissions.find(p => p.permissionName === permission);
    console.log("permission name exists: ",exists);
    return exists !== undefined ? true : false;
  }
  return false;
}

export const getStatusConfig = (status: string) => {
  const config = {
    INSIDE_OFFICE: { label: "Inside Office", dot: "#22C55E" },
    OUTSIDE_OFFICE: { label: "Outside Office", dot: "#EF4444" },
    OFFLINE: { label: "Offline", dot: "#9E9E9E" },
    MARKED_PRESENT: { label: "Marked Present", dot: "#2196F3" },
    LOGGED_OUT: { label: "Logged Out", dot: "#757575" },
    NOT_MARKED: { label: "Not Marked", dot: "#9CA3AF" },
  };

  return (
    config[status as keyof typeof config] || {
      label: status,        // show actual status text
      dot: "#EF4444",        // default gray color
    }
  );
};
