import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const FestivalOffersSection: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const handleShopNowPress = () => {
    navigation.navigate('FestivalDeals');
  };

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        {/* Decorative border */}
        <View style={styles.decorativeBorder}>
          <View style={styles.borderPattern} />
        </View>
        
        {/* Main content */}
        <View style={styles.contentContainer}>
          <View style={styles.leftContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.festivalText}>Festival</Text>
              <Text style={styles.offersText}>Offers</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={handleShopNowPress}
              activeOpacity={0.8}
            >
              <Text style={styles.shopButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.rightContent}>
            <Image 
              source={require('../../../sources/images/festive.png')}
              style={styles.charactersImage}
              defaultSource={require('../../../sources/images/c1.png')}
            />
          </View>
        </View>
        
        {/* Bottom decorative border */}
        <View style={styles.bottomBorder}>
          <View style={styles.borderPattern} />
        </View>
      </View>
    </View>
  );
};

export default FestivalOffersSection;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  bannerContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  decorativeBorder: {
    height: 20,
    backgroundColor: '#FFD54F',
    position: 'relative',
  },
  borderPattern: {
    height: '100%',
    backgroundColor: '#FFD54F',
    // Add pattern styling here if needed
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: 120,
  },
  leftContent: {
    flex: 1,
    paddingRight: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  festivalText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6F00',
    // textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  offersText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF8F00',
    marginTop: -4,
  },
  shopButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rightContent: {
    width: 100,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  charactersImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  bottomBorder: {
    height: 20,
    backgroundColor: '#FFD54F',
  },
});