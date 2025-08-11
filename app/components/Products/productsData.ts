interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: any;
  rating: string;
  discount?: string;
  category: string;
  subcategory: string;
}

// Mock products data
export const allProducts: Product[] = [
  // Women's Products
  {
    id: '1',
    name: 'Floral Summer Dress',
    price: '1599',
    originalPrice: '2499',
    image: require('../../../sources/images/store.png'),
    rating: '4.5',
    discount: '36% OFF',
    category: 'Women',
    subcategory: 'Dresses',
  },
  {
    id: '2',
    name: 'Casual White Top',
    price: '899',
    originalPrice: '1299',
    image: require('../../../sources/images/store.png'),
    rating: '4.2',
    discount: '31% OFF',
    category: 'Women',
    subcategory: 'Top wear',
  },
  {
    id: '3',
    name: 'High Waisted Jeans',
    price: '2299',
    image: require('../../../sources/images/store.png'),
    rating: '4.7',
    category: 'Women',
    subcategory: 'Bottom wear',
  },
  {
    id: '4',
    name: 'Ethnic Kurta Set',
    price: '1899',
    originalPrice: '2799',
    image: require('../../../sources/images/store.png'),
    rating: '4.4',
    discount: '32% OFF',
    category: 'Women',
    subcategory: 'Ethnic wear',
  },
  // Men's Products
  {
    id: '5',
    name: 'Cotton Casual Shirt',
    price: '1299',
    originalPrice: '1899',
    image: require('../../../sources/images/store.png'),
    rating: '4.1',
    discount: '32% OFF',
    category: 'Men',
    subcategory: 'Top wear',
  },
  {
    id: '6',
    name: 'Slim Fit Chinos',
    price: '1799',
    image: require('../../../sources/images/store.png'),
    rating: '4.3',
    category: 'Men',
    subcategory: 'Bottom wear',
  },
  {
    id: '7',
    name: 'Slim Fit Chinos',
    price: '799',
    image: require('../../../sources/images/store.png'),
    rating: '4.3',
    category: 'Men',
    subcategory: 'Bottom wear',
  },
  {
    id: '8',
    name: 'Traditional Kurta',
    price: '1599',
    originalPrice: '2199',
    image: require('../../../sources/images/store.png'),
    rating: '4.6',
    discount: '27% OFF',
    category: 'Men',
    subcategory: 'Ethnic wear',
  },
  // Add more products as needed
];

export const getProductsByCategory = (category: string, subcategory?: string): Product[] => {
  let filtered = allProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );

  if (subcategory) {
    filtered = filtered.filter(product => 
      product.subcategory.toLowerCase() === subcategory.toLowerCase()
    );
  }

  return filtered;
};

export const getProductById = (id: string): Product | undefined => {
  return allProducts.find(product => product.id === id);
};
