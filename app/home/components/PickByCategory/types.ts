
// components/PickByCategory/types.ts
import { ImageSourcePropType } from 'react-native';

export interface Category {
  category: string;
  id: number;
  image: ImageSourcePropType;
  level:number;
  name: string;
}
