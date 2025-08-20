import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {renderStars} from '../../common/renderStars';

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

const ReviewsComponent: React.FC<Props> = ({reviews}) => {
  const renderReview = ({item}: {item: Review}) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image source={{uri: item.avatar}} style={styles.avatar} />
        <View style={{flex: 1}}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.date}>{item.date}</Text>
          {renderStars(item.rating)}
          {/* <View style={styles.starsContainer}>{renderStars(item.rating)}</View> */}
        </View>
      </View>
      <Text style={styles.text}>{item.text}</Text>
      <View style={styles.imageRow}>
        {item.images.map((img, index) => (
          <TouchableOpacity key={index} activeOpacity={0.7}>
            <Image source={{uri: img}} style={styles.reviewImage} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <FlatList
      data={reviews}
      keyExtractor={item => item.id}
      renderItem={renderReview}
      contentContainerStyle={{padding: 12}}
    />
  );
};

export default ReviewsComponent;

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 8,
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
    marginVertical: 4,
    lineHeight: 18,
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  reviewImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: '#eee',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
});
