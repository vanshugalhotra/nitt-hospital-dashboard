"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface QueryState {
  skip?: number;
  take?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  filters?: Record<string, unknown>;
}

export interface CRUDConfig<T> {
  baseUrl: string;
  queryKey: string;
  defaultQuery?: QueryState;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}


const buildQueryParams = (state: QueryState) => {
  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "object") {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, String(value));
      }
    }
  });
  return params.toString();
};


export function useCRUDController<T extends { id?: string | number }>(
  config: CRUDConfig<T>
) {
  const queryClient = useQueryClient();

  const [queryState, setQueryState] = useState<QueryState>({
    skip: 0,
    take: 20,
    ...config.defaultQuery,
  });

  const listQuery = useQuery({
    queryKey: [config.queryKey, queryState],
    queryFn: async (): Promise<PaginatedResponse<T>> => {
      const queryString = buildQueryParams(queryState);
      const res = await fetch(`${config.baseUrl}?${queryString}`, {
        credentials: "include", // Essential for session cookies
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();
      
      // DRILLING INTO YOUR NESTED RESPONSE
      return {
        items: json.data?.items ?? [],
        total: json.data?.total ?? 0,
      };
    },
    // placeholderData: (prev) => prev, // Use this if on TanStack v5
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: async (data: Partial<T>) => {
      const res = await fetch(config.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [config.queryKey] }),
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<T> }) => {
      const res = await fetch(`${config.baseUrl}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [config.queryKey] }),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await fetch(`${config.baseUrl}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [config.queryKey] }),
  });

  return {
    data: listQuery.data?.items ?? [],
    total: listQuery.data?.total ?? 0,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    queryState,
    setQueryState,
    setSearch: (search: string) => setQueryState((prev) => ({ ...prev, search, skip: 0 })),
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    refetch: listQuery.refetch,
  };
}