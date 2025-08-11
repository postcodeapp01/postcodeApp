import {DeliveryProduct} from './types';

export const deliveryProductsData: DeliveryProduct[] = [
  {
    id: '1',
    name: 'Lil Cutie Set',
    price: 800,
    image: require('../../../../sources/images/lil-cute-del.png'), // Adjust path as needed
    deliveryTime: '1 Hr Delivery',
    category: 'Kids Fashion',
    store: 'Trends, Kothapet',
  },
  {
    id: '2',
    name: 'Lil Cutie Set',
    price: 800,
    image: require('../../../../sources/images/del2.png'),
    deliveryTime: '1 Hr Delivery',
    category: 'Men Fashion',
    store: 'Trends, Kothapet',
  },
  {
    id: '3',
    name: 'ChanelChance Perfume',
    price: 800,
    image: require('../../../../sources/images/del3.png'),
    deliveryTime: '1 Hr Delivery',
    category: 'Accessories',
    store: 'Trends, Kothapet',
  },
  {
    id: '4',
    name: 'Ethnic Kurti',
    price: 800,
    image: require('../../../../sources/images/del4.png'),
    deliveryTime: '1 Hr Delivery',
    category: 'Women Fashion',
    store: 'Trends, Kothapet',
  },
  {
    id: '5',
    name: 'Casual Shoes',
    price: 800,
    image: require('../../../../sources/images/lil-cute-del.png'),
    deliveryTime: '1 Hr Delivery',
    category: 'Footwear',
    store: 'Trends, Kothapet',
  },
  // Add more products as needed
];
