// app/components/More/SubCategoryCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

type Category = {
  id: string;
  name: string;
  imageUrl: string;
};

type Props = {
  category: Category;
  onPress: () => void;
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 120 - 48) / 3; // Sidebar width - paddings / 3 columns

const SubCategoryCard: React.FC<Props> = ({ category, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: category.imageUrl }}
          style={styles.image}
          defaultSource={require('../../../../sources/images/c1.png')}
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

export default SubCategoryCard;

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginBottom: 10,
    // backgroundColor:'#a0d8fdff',
    height:85,
    width:70,
  },
  imageContainer: {
    width: 60,
    height:60,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing:-0.32,
  },
});