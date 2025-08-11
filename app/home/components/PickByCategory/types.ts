
// components/PickByCategory/types.ts
import { ImageSourcePropType } from 'react-native';

export interface Category {
  subcategory: string;
  id: string;
  image: ImageSourcePropType;
  category: string;
}
