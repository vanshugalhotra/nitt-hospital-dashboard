import { BACKEND_URL } from "./config";

const BASE_URL = BACKEND_URL || "http://localhost:3333";
const PREFIX = "api/v1";

const API_URL = `${BASE_URL}/${PREFIX}`;

export const apiRoutes = {
  staff: {
    base: `${API_URL}/staff`,
    list: `${API_URL}/staff`,
  },
  staffAuth: {
    login: `${API_URL}/auth/staff/login`,
    logout: `${API_URL}/auth/staff/logout`,
    me: `${API_URL}/auth/staff/me`,
  },
  patientAuth: {
    login: `${API_URL}/auth/patient/login`,
    logout: `${API_URL}/auth/patient/logout`,
  },
  export: {
    base: `${API_URL}/export`,
  },
  audit: {
    base: `${API_URL}/audit-logs`,
    entity: (entityType: string, entityId: string) =>
      `${API_URL}/audit-logs/entity/${entityType}/${entityId}`,
    detail: (id: string) => `${API_URL}/${id}`,
  },
};