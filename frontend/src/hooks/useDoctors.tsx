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

  // Optional: auto-attach role (so UI doesn’t pass it)
  const createDoctor = async (data: Partial<Doctor>) => {
    return crud.create({
      ...data,
      role: "DOCTOR",
    });
  };

  return {
    ...crud,
    create: createDoctor,
  };
};