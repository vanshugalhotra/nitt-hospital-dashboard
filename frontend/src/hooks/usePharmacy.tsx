// hooks/usePharmacy.ts
"use client";

import { useCRUDController } from "@/hooks/use-crud-controller";
import { apiRoutes } from "@/lib/apiRoutes";

export interface PharmacyStaff {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: "PHARMACY";
}

export const usePharmacy = () => {
  const crud = useCRUDController<PharmacyStaff>({
    baseUrl: apiRoutes.staff.base,
    queryKey: "pharmacyStaff",
    defaultQuery: {
      filters: {
        role: "PHARMACY",
      },
    },
  });

  // Optional: auto-attach role when creating new staff
  const createPharmacyStaff = async (data: Partial<PharmacyStaff>) => {
    return crud.create({
      ...data,
      role: "PHARMACY",
    });
  };

  return {
    ...crud,
    create: createPharmacyStaff,
  };
};