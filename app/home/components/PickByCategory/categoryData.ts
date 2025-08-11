// components/PickByCategory/categoryData.ts
import { Category } from './types';

export const categoryData: Category[] = [
  {
    id: '1',
    subcategory: 'Women',
    image: require('../../../../sources/images/women-cat.png'),
    category: 'Women',
  },
  {
    id: '2',
    subcategory: 'Men',
    image: require('../../../../sources/images/men-cat.png'),
    category: 'Men',
  },
  // Subcategories for Women
  {
    id: '3',
    subcategory: 'Dresses',
    image: require('../../../../sources/images/dresses-wc.png'),
    category: 'Women',
  },
  {
    id: '4',
    subcategory: 'Top wear',
    image: require('../../../../sources/images/top-wear-wc.png'),
    category: 'Women',
  },
  {
    id: '5',
    subcategory: 'Bottom wear',
    image: require('../../../../sources/images/bottom-wear-wc.png'),
    category: 'Women',
  },
  {
    id: '6',
    subcategory: 'Ethnic wear',
    image: require('../../../../sources/images/ethnic-wear-wc.png'),
    category: 'Women',
  },
//   {
//     id: '7',
//     subcategory: 'Bottom wear',
//     image: require('../../../../sources/images/dresses-wc.png'),
//     category: 'Women',
//   },

  // Subcategories for Men
  {
    id: '8',
    subcategory: 'Top wear',
    image: require('../../../../sources/images/top-wear-mc.png'),
    category: 'Men',
  },
  {
    id: '9',
    subcategory: 'Bottom wear',
    image: require('../../../../sources/images/bottom-wear-mc.png'),
    category: 'Men',
  },
  {
    id: '10',
    subcategory: 'Ethnic wear',
    image: require('../../../../sources/images/ethnic-wear-mc.png'),
    category: 'Men',
  },
  {
    id: '11',
    subcategory: 'Sports wear',
    image: require('../../../../sources/images/shoes-mc.png'),
    category: 'Men',
  },
  {
    id: '12',
    subcategory: 'Ethnic wear',
    image: require('../../../../sources/images/dresses-wc.png'),
    category: 'Men',
  },
];
