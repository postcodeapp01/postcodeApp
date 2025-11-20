
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';

interface OfferCardProps {
  image: ImageSourcePropType | string;
  discount: string;
  category: string;
  brandLogo?: ImageSourcePropType | string;
  brandName?: string;
  onPress: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  image,
  discount,
  category,
  brandLogo,
  brandName,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Background Image */}
      <Image
        source={typeof image === 'string' ? {uri: image} : image}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.discount}>{discount}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>

      {/* Brand Logo */}
      {brandLogo && (
        <View style={styles.brandContainer}>
          <Image
            source={typeof brandLogo === 'string' ? {uri: brandLogo} : brandLogo}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 170,
    height: 230,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  discount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  category: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  brandContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  brandLogo: {
    height: 28,
    width: '100%',
  },
});

export default OfferCard;
