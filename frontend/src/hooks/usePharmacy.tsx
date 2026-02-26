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
  return {
    ...crud,
  };
};