import ApiService from "@/app/services/apiService";

export const getAccountingSoftware = async (tenantId: number, authToken: string) => {
  return await ApiService.get(`accounting-software/${tenantId}`, authToken);
};

export const getDmsConfig = async (tenantId: number, authToken: string) => {
  return await ApiService.get(`dms-config/${tenantId}`, authToken);
};
