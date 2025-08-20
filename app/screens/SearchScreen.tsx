// // app/screens/SearchScreen.tsx
// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   FlatList,
//   Image,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Keyboard,
// } from 'react-native';

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
//   keywords: string[];
// };

// const SearchScreen = ({ navigation }: any) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [results, setResults] = useState<Product[]>([]);

//   const handleSearch = async () => {
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Search for products or categories"
//         value={searchQuery}
//         onChangeText={text => setSearchQuery(text)}
//         style={styles.input}
//         returnKeyType="search"
//         onSubmitEditing={handleSearch}
//       />

//       <FlatList
//         data={results}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() => navigation.navigate('ProductDetails', { product: item })}
//           >
//             <Image source={{ uri: item.imageUrl }} style={styles.image} />
//             <View>
//               <Text style={styles.name}>{item.name}</Text>
//               <Text style={styles.price}>₹{item.price}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// export default SearchScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   card: {

//     marginBottom: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   image: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
//   name: { fontSize: 16, fontWeight: '600' },
//   price: { fontSize: 14, color: '#555' },
// });

// app/screens/SearchScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  keywords: string[];
  category: string;
  searchCount?: number; // 👈 NEW
};

type Store = {
  id: string;
  name: string;
  logoUrl: string;
  searchCount?: number; // 👈 NEW
};

const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Apple iPhone 15',
    price: 79999,
    imageUrl: 'https://via.placeholder.com/100x100.png?text=iPhone+15',
    keywords: ['apple', 'iphone', 'mobile', 'electronics'],
    category: 'Mobiles',
    searchCount: 1200,
  },
  {
    id: '2',
    name: 'Nike Running Shoes',
    price: 4999,
    imageUrl: 'https://via.placeholder.com/100x100.png?text=Nike+Shoes',
    keywords: ['shoes', 'nike', 'sports', 'sneakers'],
    category: 'Shoes',
    searchCount: 980,
  },
  {
    id: '3',
    name: 'Adidas Hoodie',
    price: 2499,
    imageUrl: 'https://via.placeholder.com/100x100.png?text=Adidas+Hoodie',
    keywords: ['hoodie', 'adidas', 'winterwear', 'clothing'],
    category: 'Clothing',
    searchCount: 750,
  },
  {
    id: '4',
    name: 'Sony Headphones',
    price: 3999,
    imageUrl: 'https://via.placeholder.com/100x100.png?text=Sony+Headphones',
    keywords: ['headphones', 'sony', 'music', 'electronics'],
    category: 'Electronics',
    searchCount: 620,
  },
  {
    id: '5',
    name: 'Levi’s Jeans',
    price: 2999,
    imageUrl: 'https://via.placeholder.com/100x100.png?text=Levis+Jeans',
    keywords: ['jeans', 'denim', 'levis', 'clothing'],
    category: 'Clothing',
    searchCount: 500,
  },
];

const DUMMY_STORES: Store[] = [
  {
    id: '1',
    name: 'Apple Store',
    logoUrl: 'https://via.placeholder.com/50x50.png?text=Apple',
    searchCount: 2000,
  },
  {
    id: '2',
    name: 'Nike Outlet',
    logoUrl: 'https://via.placeholder.com/50x50.png?text=Nike',
    searchCount: 1800,
  },
  {
    id: '3',
    name: 'Adidas Originals',
    logoUrl: 'https://via.placeholder.com/50x50.png?text=Adidas',
    searchCount: 1400,
  },
  {
    id: '4',
    name: 'Sony Center',
    logoUrl: 'https://via.placeholder.com/50x50.png?text=Sony',
    searchCount: 1100,
  },
];

const TRENDING_SEARCHES = [
  'Men’s T-shirts',
  'Sneakers',
  'Apple iPhone 15',
  'Adidas Hoodie',
  'Sony Headphones',
];

const SearchScreen = ({navigation}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<(Product | Store)[]>([]);
  const [suggestions, setSuggestions] = useState<(Product | Store)[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentStores, setRecentStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  // Load dummy recents
  useEffect(() => {
    setRecentProducts([DUMMY_PRODUCTS[0]]);
    setRecentStores([DUMMY_STORES[1]]);
  }, []);

  const handleSearch = (query?: string) => {
    const q = query || searchQuery;
    if (!q.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const productMatches = DUMMY_PRODUCTS.filter(
        p =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.keywords.some(k => k.toLowerCase().includes(q.toLowerCase())),
      );

      const storeMatches = DUMMY_STORES.filter(s =>
        s.name.toLowerCase().includes(q.toLowerCase()),
      );

      setResults([...productMatches, ...storeMatches]);

      // 👇 Save to recent searches separately
      if (productMatches.length > 0) {
        setRecentProducts(prev => [
          productMatches[0],
          ...prev.filter(p => p.id !== productMatches[0].id),
        ]);
      }
      if (storeMatches.length > 0) {
        setRecentStores(prev => [
          storeMatches[0],
          ...prev.filter(s => s.id !== storeMatches[0].id),
        ]);
      }

      setLoading(false);
    }, 600);
  };

  const handleTyping = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    const matches = [
      ...DUMMY_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()),
      ),
      ...DUMMY_STORES.filter(s =>
        s.name.toLowerCase().includes(q.toLowerCase()),
      ),
    ];
    setSuggestions(matches.slice(0, 5));
  };

  const renderChips = (items: (Product | Store)[], isProduct: boolean) => (
    <View style={styles.chipContainer}>
      {items.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.chip}
          onPress={() => {
            setSearchQuery(item.name);
            handleSearch(item.name);
          }}>
          <Ionicons
            name="time-outline"
            size={14}
            color="#333"
            style={{marginRight: 4}}
          />
          <Text style={styles.chipText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Delivery Location</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#888"
          style={{marginHorizontal: 6}}
        />
        <TextInput
          placeholder="Search for brands, products & more"
          value={searchQuery}
          onChangeText={handleTyping}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch()}
        />
        <TouchableOpacity>
          <Ionicons
            name="camera-outline"
            size={20}
            color="#888"
            style={{marginHorizontal: 6}}
          />
        </TouchableOpacity>
      </View>

      {/* Suggestions Dropdown */}
      {searchQuery.length > 0 && suggestions.length > 0 && (
        <View style={styles.suggestionBox}>
          {suggestions.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.suggestionItem}
              onPress={() => handleSearch(item.name)}>
              <Image
                source={{
                  uri: 'price' in item ? item.imageUrl : item.logoUrl,
                }}
                style={styles.suggestionImage}
              />
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionName}>{item.name}</Text>
                <Text style={styles.suggestionMeta}>
                  {item.searchCount || Math.floor(Math.random() * 500)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recently searched */}
      <ScrollView style={{marginTop: 16}}>
        {recentProducts.length > 0 && (
          <View style={{marginBottom: 20}}>
            <Text style={styles.sectionTitle}>Recently Searched Products</Text>
            {renderChips(recentProducts, true)}
          </View>
        )}

        {recentStores.length > 0 && (
          <View style={{marginBottom: 20}}>
            <Text style={styles.sectionTitle}>Recently Searched Stores</Text>
            {renderChips(recentStores, false)}
          </View>
        )}

        <View>
          <Text style={styles.sectionTitle}>Trending Searches</Text>
          {renderChips(
            TRENDING_SEARCHES.map((t, i) => ({
              id: String(i),
              name: t,
              logoUrl: '',
            })) as Store[],
            false,
          )}
        </View>
      </ScrollView>

      {/* Search Results */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{marginTop: 20}} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            if ('price' in item) {
              // Product
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('ProductDetails', {product: item})
                  }>
                  <Image source={{uri: item.imageUrl}} style={styles.image} />
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>₹{item.price}</Text>
                  </View>
                </TouchableOpacity>
              );
            } else {
              // Store
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('StoreDetails', {store: item})
                  }>
                  <Image source={{uri: item.logoUrl}} style={styles.image} />
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              );
            }
          }}
        />
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 12},
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  headerTitle: {fontSize: 16, fontWeight: 'bold', marginLeft: 12},
  searchBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#EAEAEA',
  },
  input: {flex: 1, padding: 8, fontSize: 14},
  sectionTitle: {
    fontWeight: '500',
    marginBottom: 6,
    fontSize: 14,
    color: '#111',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A8A8A8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 4,
  },
  chipText: {fontSize: 13, color: '#000'},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f0f0',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
  },
  image: {width: 60, height: 60, borderRadius: 6, marginRight: 12},
  name: {fontSize: 14, fontWeight: '600'},
  price: {fontSize: 12, color: '#555'},
  suggestionBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginTop: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  suggestionContent: {
    flex: 1, // take remaining width
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // name left, count right
  },

  suggestionName: {
    fontSize: 14,
    color: '#111',
  },

  suggestionMeta: {
    fontSize: 12,
    color: '#666',
  },

  suggestionImage: {width: 30, height: 30, marginRight: 10, borderRadius: 4},
  // suggestionMeta: {fontSize: 12, color: '#666'},
});
