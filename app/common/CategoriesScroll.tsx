import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

export interface CategoryItem {
  id: number | string;
  name?: string;
  image?: string | null;
  [key: string]: any;
}

type CategoriesScrollProps = {
  items: CategoryItem[];
  onItemPress?: (item: CategoryItem, e?: GestureResponderEvent) => void;
  backgroundColor?: string;
};

const CategoriesScroll: React.FC<CategoriesScrollProps> = ({
  items,
  onItemPress = () => {},
  backgroundColor = 'transparent',

 
}) => {
  return (
    <View
      style={[
        styles.wrapper,
        {backgroundColor, height: 120}
      ]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.secondscrollRow}>
        {items.map((sub: any) => (
          <TouchableOpacity
            key={sub.id}
            style={styles.subItem}
            onPress={() => onItemPress(sub)}>
            <View style={styles.imageWrapper}>
              <Image source={{uri: sub.image}} style={styles.subImage} />
              <View style={styles.overlay}>
                <Text style={styles.subText}>{sub.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoriesScroll;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  secondscrollRow: {
    width: '100%',
    paddingVertical: 5,
  },
  subItem: {
    marginLeft: 6,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: 72,
    height: 110,
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
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  subText: {
    color: '#fff',
    fontWeight: '600',
    width: '100%',
    fontSize: 10,
    textAlign: 'center',
    backgroundColor: '#9747FF',
    lineHeight: 20,
    letterSpacing: -0.32,
  },
});
