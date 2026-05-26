import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface AttendanceRecord {
  workerId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "ON_LEAVE";
  note?: string;
}

const getAttendanceKey = (date: string) => ["attendance", date];

export function useAttendanceByDate(date: string) {
  return useQuery({
    queryKey: getAttendanceKey(date),
    queryFn: async () => {
      const response = await fetch(`/api/attendance?date=${date}`);
      if (!response.ok) throw new Error("Failed to fetch attendance");
      return response.json();
    },
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AttendanceRecord) => {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to mark attendance");
      return response.json();
    },
    onSuccess: (data) => {
      const dateStr = data.date.split("T")[0];
      queryClient.invalidateQueries({ queryKey: getAttendanceKey(dateStr) });
    },
  });
}

export function useBulkMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (records: AttendanceRecord[]) => {
      const response = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });
      if (!response.ok) throw new Error("Failed to update attendance");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        const dateStr = data[0].date.split("T")[0];
        queryClient.invalidateQueries({ queryKey: getAttendanceKey(dateStr) });
      }
    },
  });
}
