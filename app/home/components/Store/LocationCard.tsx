import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

interface LocationCardProps {
  name: string;
  address: string;
  rating: number;
  ratingCount: string;
  deliveryTime: string;
  distance: string;
  isHighlighted?: boolean;
}

const BORDER_WIDTH = 3;
const BORDER_COLORS = ['#FFAEAD', '#CBA3FE'];

const LocationCard: React.FC<LocationCardProps> = ({
  name,
  address,
  rating,
  ratingCount,
  deliveryTime,
  distance,
  isHighlighted = false,
}) => {
  const Content = (
    <View style={styles.innerCard}>
      <Text style={[styles.name]} numberOfLines={1}>
        {name}
      </Text>

      {/* Address */}
      <Text style={styles.address} numberOfLines={1}>
        {address}
      </Text>

      {/* Info Row: Delivery Time, Distance, Closing Time */}
      <View style={styles.infoRow}>
        <Icon name="star" size={12} color="#F4B400" />
        <Text style={styles.rating}>{rating}</Text>
        <Text style={styles.ratingCount}>({ratingCount} Ratings)</Text>
        <Text style={styles.separator}>|</Text>
        <View style={styles.infoBadge}>
          {/* <Icon
            name="time-outline"
            size={14}
            color={isHighlighted ? '#333' : '#666'}
          /> */}
          <Text style={[styles.infoText]}>{deliveryTime}</Text>
        </View>

        <Text style={styles.separator}>|</Text>

        <View style={styles.infoBadge}>
          {/* <Icon
            name="location-outline"
            size={14}
            color={isHighlighted ? '#333' : '#666'}
          /> */}
          <Text style={styles.infoText}>{distance}</Text>
        </View>

        <Text style={styles.separator}>|</Text>

        <Text style={styles.infoText}>Closes at 9 PM</Text>
      </View>
    </View>
  );

  if (isHighlighted) {
    return (
      <LinearGradient
        colors={BORDER_COLORS}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.gradientBorder, {padding: BORDER_WIDTH}]}>
        <View style={[styles.innerWrapper]}>{Content}</View>
      </LinearGradient>
    );
  }

  // normal non-highlighted card
  return <View style={styles.card}>{Content}</View>;
};

const styles = StyleSheet.create({
  card: {
    // height: 82,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#AAAAAA',
  },

  gradientBorder: {
    borderRadius: 10,
    marginBottom: 12,
  },

  innerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
  },
  innerCard: {
    // padding: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  rating: {
    fontSize: 10,
    fontWeight: '400',
    color: '#222',
    marginLeft: 3,
    lineHeight: 20,
    letterSpacing: -0.32,
  },

  ratingCount: {
    fontSize: 10,
    fontWeight: '400',
    color: '#222',
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  address: {
    fontSize: 12,
    color: '#222',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: 8,
  },

  infoText: {
    fontSize: 10,
    color: '#222',
    fontWeight: '400',
    marginLeft: 3,
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  separator: {
    color: '#AAAAAA',
    fontSize: 15,
    marginHorizontal: 3,
  },
});

export default LocationCard;
