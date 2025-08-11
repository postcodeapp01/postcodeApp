// components/NearbyStores/types.ts
import { ImageSourcePropType } from 'react-native';

export interface Store {
  id: string;
  name: string;
  logo: ImageSourcePropType;
  distance: string;
  location: string;
  status: string;
  isOpen: boolean;
}
