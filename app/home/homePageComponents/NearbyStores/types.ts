import { ImageSourcePropType } from 'react-native';


export interface Store {
  id: number;
  name: string;
  logo:   ImageSourcePropType;      // URL from backend
  distance?: string;   // optional, calculate later
  distanceKm?: string;
  location: string;
  status: string;      // "Open" / "Closed"
  isOpen: boolean;     // derived from status
  latitude: number;
  longitude: number;
  // created_at: string;
}
