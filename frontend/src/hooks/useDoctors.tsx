// hooks/useDoctors.ts
"use client";

import { useCRUDController } from "@/hooks/use-crud-controller";
import { apiRoutes } from "@/lib/apiRoutes";

export interface Doctor {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: "DOCTOR";
}

export const useDoctors = () => {
  const crud = useCRUDController<Doctor>({
    baseUrl: apiRoutes.staff.base,
    queryKey: "doctors",
    defaultQuery: {
      filters: {
        role: "DOCTOR",
      },
    },
  });
  return {
    ...crud,
  };
};