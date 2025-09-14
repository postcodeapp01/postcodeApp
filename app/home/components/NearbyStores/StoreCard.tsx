import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Store} from './types';

interface StoreCardProps {
  store: Store;
  onPress: () => void;
}

const BORDER_WIDTH = 2;
const OUTER_RADIUS = 10;

const StoreCard: React.FC<StoreCardProps> = ({store, onPress}) => {
  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  const imageSource =
    typeof store.logo === 'string' ? {uri: store.logo} : (store.logo as any);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}>
      {/* Gradient wrapper acts as the border */}
      <LinearGradient
        colors={['#FF5964', '#0072F0']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={[
          styles.gradientBorder,
          {borderRadius: OUTER_RADIUS, padding: BORDER_WIDTH},
        ]}>
        {/* Inner card with background to "cut out" center of gradient */}
        <View
          style={[
            styles.card,
            {
              borderRadius: OUTER_RADIUS - BORDER_WIDTH,
            },
          ]}>
          <View style={styles.logoContainer}>
            <Image
              source={imageSource}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.metaText}>
            {store.distance} km | {truncateText(store.location, 8)}
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {store.status === 'Open' ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    width: 95,
    height: 80,
  },
  gradientBorder: {
    flex: 1,
    // keep alignment so child view fills
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff', // inner background
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignItems: 'center',
    // subtle inner border to match image
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  logoContainer: {
    marginBottom: 6,
  },
  logo: {
    width: 48,
    height: 29,
  },
  metaText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
    lineHeight: 10,
    textAlign: 'center',
  },
  statusBadge: {
    backgroundColor: '#f9fcf9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#AAAAAA',
  },
  statusText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#000',
    letterSpacing: 0.1,
  },
});

export default StoreCard;
