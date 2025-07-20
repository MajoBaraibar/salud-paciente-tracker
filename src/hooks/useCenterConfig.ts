import { getActiveConfig } from '@/config/centerConfig';

export const useCenterConfig = () => {
  return getActiveConfig();
};