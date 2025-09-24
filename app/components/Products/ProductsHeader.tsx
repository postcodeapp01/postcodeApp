import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ProductsHeaderProps {
  title: string;
  productCount?: number;
  onBack: () => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ title, productCount, onBack }) => {
  const navigation=useNavigation();
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}> {title}</Text>
          {productCount !== undefined && (
            <Text style={styles.subtitle}>  ({productCount} items)</Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.searchButton} onPress={()=>navigation.navigate('SearchScreen')}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    flexDirection:'row',
    alignItems:'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  searchButton: {
    padding: 4,
  },
});

export default ProductsHeader;
