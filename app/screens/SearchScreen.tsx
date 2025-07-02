// app/screens/SearchScreen.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  keywords: string[];
};

const SearchScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  const handleSearch = async () => {
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for products or categories"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>₹{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  card: {

    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, color: '#555' },
});
