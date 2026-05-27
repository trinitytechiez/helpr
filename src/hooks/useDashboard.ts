import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useHelpersOnLeaveToday() {
  return useQuery({
    queryKey: ["workers", "on-leave-today"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(`/api/attendance?date=${today}`);
      if (!response.ok) throw new Error("Failed to fetch attendance");
      const attendance = await response.json();

      const onLeaveDates = new Set(
        attendance
          .filter((a: any) => a.status === "ON_LEAVE")
          .map((a: any) => a.workerId)
      );

      return onLeaveDates;
    },
    refetchInterval: 30000,
  });
}
