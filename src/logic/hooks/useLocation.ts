import { useState, useCallback, useEffect } from 'react';
import { 
  getCurrentLocation, 
  checkLocationPermission, 
  LocationData, 
  LocationError 
} from '../services/locationService';

export interface UseLocationState {
  data: LocationData | null;
  error: LocationError | null;
  isLoading: boolean;
  permissionState: PermissionState | 'unknown';
}

export const useLocation = () => {
  const [state, setState] = useState<UseLocationState>({
    data: null,
    error: null,
    isLoading: false,
    permissionState: 'unknown',
  });

  const checkPermission = useCallback(async () => {
    const status = await checkLocationPermission();
    setState(prev => ({ ...prev, permissionState: status }));
  }, []);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const fetchLocation = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await getCurrentLocation();
      setState(prev => ({ 
        ...prev, 
        data, 
        isLoading: false, 
        permissionState: 'granted' 
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err as LocationError,
        isLoading: false,
      }));
      // Re-check permission status if it was denied during prompt
      checkPermission();
    }
  }, [checkPermission]);

  return { 
    ...state, 
    fetchLocation, 
    checkPermission 
  };
};
