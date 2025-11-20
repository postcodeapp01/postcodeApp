import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import BrandCard from './BrandCard';
import axiosInstance from '../../../../config/Api';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../../navigators/stacks/HomeStack';

export interface Brand {
  id: string;
  name: string;
  logo?: ImageSourcePropType;
}

const ShopByBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  useEffect(() => {
    let mounted = true;
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/brands');
        setBrands(res.data ?? []);
      } catch (err) {
        console.error('Failed to fetch brands', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBrands();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop By Brands</Text>

      {loading ? (
        <View style={{height: 56, justifyContent: 'center', paddingLeft: 12}}>
          <ActivityIndicator size="small" color="#FF5964" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          {brands.map(brand => (
            <View key={brand.id} style={styles.brandSpacing}>
              <BrandCard
                brand={brand}
                onPress={() =>
                  navigation.navigate('BrandProducts', {
                    id: brand.id,
                    name: brand.name, 
                  })
                }
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 95,
  },
  title: {
    top: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 15,
    paddingHorizontal: 10,
    letterSpacing: 0.5,
    left: 4,
  },
  scrollContainer: {},
  brandSpacing: {
    marginRight: -8,
  },
});

export default ShopByBrands;
