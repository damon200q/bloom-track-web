import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertCycle } from "@shared/routes";
import { format } from "date-fns";

export function useCycles() {
  return useQuery({
    queryKey: [api.cycles.list.path],
    queryFn: async () => {
      const res = await fetch(api.cycles.list.path);
      if (!res.ok) throw new Error("Failed to fetch cycle history");
      // Use the Zod schema to parse the response to ensure type safety
      const data = await res.json();
      return api.cycles.list.responses[200].parse(data);
    },
  });
}

export function useCreateCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCycle) => {
      // Format date as string YYYY-MM-DD for the API if it's not already
      // The schema expects a date string, usually provided by the form
      const res = await fetch(api.cycles.create.path, {
        method: api.cycles.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to save cycle");
      }
      
      return api.cycles.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cycles.list.path] });
    },
  });
}

export function useDeleteCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cycles.delete.path, { id });
      const res = await fetch(url, {
        method: api.cycles.delete.method,
      });
      
      if (!res.ok) throw new Error("Failed to delete entry");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cycles.list.path] });
    },
  });
}
