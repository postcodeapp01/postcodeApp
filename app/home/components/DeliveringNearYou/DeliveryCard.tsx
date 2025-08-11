import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import { DeliveryProduct } from './types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For icons

interface DeliveryCardProps {
  product: DeliveryProduct;
  onPress: () => void;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.card}>
        {/* Product Image */}
        <Image
          source={product.image}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.productPrice}>₹ {product.price}</Text>

          {/* Delivery Badge */}
          <View style={styles.deliveryBadge}>
            <Icon name="truck-delivery-outline" size={12} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.deliveryText}>{product.deliveryTime}</Text>
          </View>

          {/* Store Location */}
          <View style={styles.locationRow}>
            <Icon name="map-marker-outline" size={12} color="#426ACD" style={{ marginRight: 2 }} />
            <Text style={styles.locationText} numberOfLines={1}>
              {product.store}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 4,
  },
  card: {
    width: 100,
    height: 145,
    backgroundColor: '#fff',
    // borderRadius: 8,
    overflow: 'hidden',
    // borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius:10,
  },
  infoContainer: {
    paddingHorizontal: 4,
    paddingTop: 2,
    flex: 1,
  },
  productName: {
    fontSize: 9,
    fontWeight: '500',
    color: '#AAAAAA',
  },
  productPrice: {
    fontSize: 10,
    fontWeight: '600',
    color: '#AAAAAA',
    marginBottom: 2,
  },
  deliveryBadge: {
    flexDirection: 'row',
    height:20,
    alignItems: 'center',
    backgroundColor: '#426ACD',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
    left:-2,
  },
  deliveryText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#fff',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 8,
    color: '#000000',
    fontWeight:'500',
    flexShrink: 1,
    lineHeight: 10,
    letterSpacing:0.1,
  },
});

export default DeliveryCard;
