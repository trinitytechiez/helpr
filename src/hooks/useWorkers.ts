import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface WorkerFormData {
  name: string;
  phone?: string;
  department?: string;
  category?: string;
  joinDate: string;
  salaryType: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
  salaryAmount: number;
  designatedLeaves?: number;
  leaveCarryover?: boolean;
}

const WORKERS_QUERY_KEY = ["workers"];

export function useWorkers() {
  return useQuery({
    queryKey: WORKERS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch("/api/workers");
      if (!response.ok) throw new Error("Failed to fetch workers");
      return response.json();
    },
  });
}

export function useWorker(id: string) {
  return useQuery({
    queryKey: [...WORKERS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await fetch(`/api/workers/${id}`);
      if (!response.ok) throw new Error("Worker not found");
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkerFormData) => {
      const response = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create worker");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKERS_QUERY_KEY });
    },
  });
}

export function useUpdateWorker(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<WorkerFormData>) => {
      const response = await fetch(`/api/workers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update worker");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...WORKERS_QUERY_KEY, id] });
    },
  });
}

export function useDeleteWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/workers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete worker");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKERS_QUERY_KEY });
    },
  });
}
