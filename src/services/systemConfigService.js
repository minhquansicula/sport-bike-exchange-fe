import api from "../config/api";

export const systemConfigService = {
  createConfig: async (configKey, configValue) => {
    const response = await api.post("/fee/create", { configKey, configValue });
    return response.data;
  },

  getAllConfigs: async () => {
    const response = await api.get("/fee/all");
    return response.data;
  },

  getConfigValue: async (configKey) => {
    const response = await api.get(`/fee/${configKey}`);
    return response.data;
  },

  updateConfigValue: async (configKey, configValue) => {
    const response = await api.put(
      `/fee/${configKey}?configValue=${configValue}`,
    );
    return response.data;
  },
};
