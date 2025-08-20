// components/NearbyStores/types.ts
import { ImageSourcePropType } from 'react-native';

// export interface Store {
//   id: number;
//   name: string;
//   logo: ImageSourcePropType;
//   distance: string;
//   location: string;
//   status: string;
//   isOpen: boolean;
// }
export interface Store {
  id: number;
  name: string;
  logo:   ImageSourcePropType;      // URL from backend
  distance?: string;   // optional, calculate later
  location: string;
  status: string;      // "Open" / "Closed"
  isOpen: boolean;     // derived from status
  // latitude: number;
  // longitude: number;
  // created_at: string;
}
