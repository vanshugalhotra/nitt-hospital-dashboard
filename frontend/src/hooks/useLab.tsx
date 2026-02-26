import { useCRUDController } from "@/hooks/use-crud-controller";
import { apiRoutes } from "@/lib/apiRoutes";

export interface Lab {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: "LAB";
}

export const useLab = () => {
  const crud = useCRUDController<Lab>({
    baseUrl: apiRoutes.staff.base,
    queryKey: "labStaff",
    defaultQuery: {
      filters: {
        role: "LAB",
      },
    },
  });
  return {
    ...crud,
  };
};