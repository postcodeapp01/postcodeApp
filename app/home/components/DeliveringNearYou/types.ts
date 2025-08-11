import { ImageSourcePropType } from 'react-native';

export interface DeliveryProduct {
  id: string;
  name: string;
  price:number;
  image: ImageSourcePropType;
  deliveryTime: string;
  category: string;
  store:string;
}
