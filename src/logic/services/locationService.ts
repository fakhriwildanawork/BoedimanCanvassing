export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  sourceType: 'GPS' | 'NETWORK' | 'ESTIMATED';
  timestamp: number;
}

export interface LocationError {
  code: number;
  message: string;
}

/**
 * Mengklasifikasikan sumber lokasi berdasarkan tingkat akurasi
 * Sesuai dengan GUIDANCE/LocationRule.md
 */
const getLocationSourceType = (accuracy: number): 'GPS' | 'NETWORK' | 'ESTIMATED' => {
  if (accuracy < 100) return 'GPS'; // Presisi tinggi (Satelit)
  if (accuracy <= 500) return 'NETWORK'; // Presisi sedang (Tower/BTS/Wi-Fi)
  return 'ESTIMATED'; // Presisi rendah (IP Address)
};

/**
 * Mengambil koordinat lokasi saat ini dengan konfigurasi akurasi tinggi
 */
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 0, message: 'Geolocation is not supported by this browser.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          sourceType: getLocationSourceType(position.coords.accuracy),
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject({ code: error.code, message: error.message });
      },
      {
        enableHighAccuracy: true, // WAJIB: Mencoba koneksi satelit
        timeout: 10000,           // 10 detik batas tunggu
        maximumAge: 300000,       // 5 menit batas cache data
      }
    );
  });
};

/**
 * Memeriksa status izin lokasi (granted, denied, prompt)
 */
export const checkLocationPermission = async (): Promise<PermissionState | 'unknown'> => {
  if (!navigator.permissions || !navigator.permissions.query) {
    return 'unknown';
  }
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch (error) {
    return 'unknown';
  }
};
