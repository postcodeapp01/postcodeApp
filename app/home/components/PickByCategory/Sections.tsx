import React, { useMemo } from 'react';
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { RootState } from '../../../../Store';
import { useSelector } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type SectionProps = {
  parentId: number;
};

export const MenSection: React.FC<SectionProps> = ({ parentId }) => {
  const { categories } = useSelector((state: RootState) => state.categories);
  const navigation = useNavigation<NavigationProp<any>>();

  // Compute second-level children of the given parent
  const subCategories = useMemo(
    () => categories.filter((c: any) => c.parent_id === parentId && c.level === 2),
    [categories, parentId],
  );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Men's Products</Text>

      {/* Render second-level subcategories at the top */}
      {subCategories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.secondscrollRow}
        >
          {subCategories.map((sub: any) => (
            <TouchableOpacity
              key={sub.id}
              style={styles.subItem}
              onPress={() => {
                console.log('Pressed id:', sub.id);
                navigation.navigate('ProductsScreen', { id: sub.id });
              }}
            >
              <View style={styles.imageWrapper}>
                <Image source={{ uri: sub.image }} style={styles.subImage} />
                <View style={styles.overlay}>
                  <Text style={styles.subText}>{sub.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* You can render other section-specific content below */}
    </View>
  );
  
};

export const WomenSection: React.FC<SectionProps> = ({parentId}) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Women's Products</Text>

    <Text>Showing products for parentId: {parentId}</Text>
  </View>
);

export const KidsSection: React.FC<SectionProps> = ({parentId}) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Kids' Products</Text>

    <Text>Showing products for parentId: {parentId}</Text>
  </View>
);

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  banner: {
    width: '100%',
    height: 150,
    marginBottom: 16,
    borderRadius: 8,
  },
  secondscrollRow: {
    // backgroundColor: '#0cf53fff',
    width: '100%',
    height: 110,
    left: 10,
  },
    subItem: {
    marginRight: 12,
    alignItems: 'center',
    height: 111,
  },
  imageWrapper: {
    position: 'relative',
    width: 72,
    height: 100,
    // borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    overflow: 'hidden',
  },
  subImage: {
    width: 72,
    height: 100,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills entire image
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  subText: {
    color: '#fff',
    fontWeight: 'bold',
    width: '100%',
    fontSize: 10,
    textAlign: 'center',
    backgroundColor: '#9747FF',
  },
});
