import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartIcon from '../../common/CartIcon';

interface ProductsHeaderProps {
  title?: string;
  onBack: () => void;
  store?: boolean;
  isBookmarked?: boolean;
  onBookmarkPress?: () => void;
  bookmarkLoading?: boolean;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  title,
  onBack,
  store = false,
  isBookmarked = false,
  onBookmarkPress,
  bookmarkLoading = false,
}) => {
  const navigation = useNavigation();

  // Store header layout
  if (store) {
    return (
      <View style={styles.storeHeader}>
        <View style={styles.storeHeaderContent}>
          {/* Left: Back Button */}
          <TouchableOpacity onPress={onBack}>
            <View style={styles.circleButton}>
              <Ionicons name="chevron-back" size={17} color="#000" />
            </View>
          </TouchableOpacity>

          {/* Center: Search Bar */}
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchScreen')}
            style={styles.searchBar}>
            <Ionicons name="search" size={16} color="#999" />
            <Text style={styles.searchPlaceholder}>Search...</Text>
          </TouchableOpacity>

          {/* Right Icons: Wishlist, Cart, Bookmark */}
          <View style={styles.rightIconsStore}>
            <TouchableOpacity
              onPress={onBookmarkPress}
              disabled={bookmarkLoading || !onBookmarkPress}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <View style={[styles.circleButton, bookmarkLoading && {opacity: 0.8}]}>
                {bookmarkLoading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Ionicons
                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={17}
                    color={isBookmarked ? '#FF6B6B' : '#222'}
                  />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('WishlistScreen' as never)}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <View style={styles.circleButton}>
                <Ionicons name="heart-outline" size={17} color="#222" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <View style={styles.circleButton}>
                <CartIcon size={17} color="#222" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Original header layout
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onBack}>
          <View style={styles.circleButton}>
            <Ionicons name="chevron-back" size={17} color="#000" />
          </View>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {' '}
            {title}
          </Text>
        </View>

        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchScreen')}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            style={styles.iconButton}>
            <View style={styles.circleButton}>
              <Ionicons name="search" size={17} color="#222" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('WishlistScreen' as never)}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            style={styles.iconButton}>
            <View style={styles.circleButton}>
              <Ionicons name="heart-outline" size={17} color="#222" />
            </View>
          </TouchableOpacity>

          <View style={styles.iconButton}>
            <CartIcon size={17} color="#222" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Original header styles
  header: {
    backgroundColor: '#fff',
    height: 55,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    left: 8,
    top: 2,
    fontSize: 20,
    fontWeight: '600',
    color: '#464646',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 3,
  },
  circleButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  // Store header styles
  storeHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  storeHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  rightIconsStore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default ProductsHeader;
