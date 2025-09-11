import React, {memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { RenderStars } from '../../common/RenderStars';


interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  avatar: string;
  text: string;
  images: string[];
}

interface Props {
  reviews: Review[];
}

/**
 * Renders reviews as plain Views (no FlatList) so they can be safely hosted
 * inside a parent ScrollView without causing Fabric child-removal issues.
 */
const ReviewsComponent: React.FC<Props> = ({reviews}) => {
  if (!reviews || reviews.length === 0) {
    return (
      <View style={styles.emptyWrapper}>
        <Text style={styles.emptyText}>No reviews yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reviews.map(item => (
        <View key={String(item.id)} style={styles.card}>
          <View style={styles.headerRow}>
            <Image source={{uri: item.avatar}} style={styles.avatar} />
            <View style={{flex: 1}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>{item.date}</Text>
              {RenderStars(item.rating)}
            </View>
          </View>

          <Text style={styles.text}>{item.text}</Text>

          {item.images && item.images.length > 0 && (
            <View style={styles.imageRow}>
              {item.images.map((img, index) => (
                <TouchableOpacity
                  key={`${item.id}-${index}`}
                  activeOpacity={0.8}
                  onPress={() => {
                    /* optional: open image viewer */
                  }}>
                  <Image source={{uri: img}} style={styles.reviewImage} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default memo(ReviewsComponent);

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  emptyWrapper: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
  },
  card: {
    padding: 10,
    marginBottom: 14,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: '#555',
  },
  text: {
    fontSize: 13,
    color: '#444',
    marginVertical: 8,
    lineHeight: 18,
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  reviewImage: {
    width: 64,
    height: 64,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#eee',
  },
});
