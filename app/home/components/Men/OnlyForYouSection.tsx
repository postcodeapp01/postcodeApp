
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type Product = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 80) / 4; // 4 cards with proper spacing

const OnlyForYouSection: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const products: Product[] = [
    {
      id: '1',
      name: 'Ethnic Wear',
      imageUrl: 'https://images.unsplash.com/photo-1576666043310-01f8a3b5b0b0?q=80&w=800&auto=format&fit=crop',
      category: 'ethnic-wear',
    },
    {
      id: '2',
      name: 'blazers',
      imageUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop',
      category: 'blazers',
    },
    {
      id: '3',
      name: 'sweatpants',
      imageUrl: 'https://images.unsplash.com/photo-1593034241759-6015aa8b11cb?q=80&w=800&auto=format&fit=crop',
      category: 'sweatpants',
    },
    {
      id: '4',
      name: 'winter jackets',
      imageUrl: 'https://images.unsplash.com/photo-1516826957135-7f6c0c7d0b2f?q=80&w=800&auto=format&fit=crop',
      category: 'winter-jackets',
    },
  ];

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductsScreen', {
      category: product.category,
      title: product.name,
    });
  };

  const renderProduct = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
          defaultSource={require('../../../../sources/images/c1.png')}
        />
      </View>
      <Text style={styles.productName}>{product.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Decorative Header with Zigzag Border */}
      <View style={styles.headerSection}>
        {/* Top zigzag border
        <View style={styles.topZigzag}>
          <View style={styles.zigzagContainer}>
            {Array.from({ length: Math.floor(width / 15) }, (_, i) => (
              <View key={i} style={styles.zigzagPoint} />
            ))}
          </View>
        </View> */}
        
        {/* Header content with gradient background */}
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>Only For You 😍</Text>
        </View>
        
        {/* Bottom zigzag border */}
        {/* <View style={styles.bottomZigzag}>
          <View style={styles.zigzagContainer}>
            {Array.from({ length: Math.floor(width / 15) }, (_, i) => (
              <View key={i} style={[styles.zigzagPoint, styles.zigzagPointInverted]} />
            ))}
          </View>
        </View> */}
      </View>

      {/* Products horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      >
        {products.map(renderProduct)}
      </ScrollView>
    </View>
  );
};

export default OnlyForYouSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginVertical: 16,
  },

  // Header Section with Zigzag Borders
  headerSection: {
    marginHorizontal: 0,
    marginBottom: 16,
  },
  
  topZigzag: {
    height: 12,
    backgroundColor: '#FF6B9D',
    overflow: 'hidden',
  },
  
  bottomZigzag: {
    height: 12,
    backgroundColor: '#FF6B9D',
    overflow: 'hidden',
  },
  
  zigzagContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'flex-end',
  },
  
  zigzagPoint: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7.5,
    borderRightWidth: 7.5,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  
  zigzagPointInverted: {
    borderTopWidth: 0,
    borderBottomWidth: 12,
    borderBottomColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  
  headerContent: {
    backgroundColor: '#FFE1EC',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    textAlign: 'center',
  },

  // Products Container
  productsContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  
  productCard: {
    alignItems: 'center',
    marginRight: 16,
    width: cardWidth,
  },
  
  imageContainer: {
    width: 93,
    height: 160, // Tall oval shape
    overflow: 'hidden',
    backgroundColor: '#F8F8F8',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopLeftRadius:40,
    borderTopRightRadius:40
  },
  
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
    textTransform: 'capitalize',
    lineHeight: 16,
  },
});
