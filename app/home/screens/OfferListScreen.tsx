import React from 'react';
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderWithNoIcons from '../../userProfile/components/Profile/HeaderWithNoIcons';

type Offer = {
  code: string;
  discount: string;
  description: string;
};

type Params = {
  offers: Offer[];
  prevRouteName?: string;
  appliedOfferCode?: string | null;
};

const OfferListScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, Params>, string>>();
  const {offers = [], prevRouteName, appliedOfferCode} = route.params ?? {};

  const handleApply = (offer: Offer) => {
    if (prevRouteName) {
      navigation.navigate(
        prevRouteName as never,
        {appliedOffer: offer} as never,
      );
    } else {
      navigation.setParams({appliedOffer: offer} as any);
    }
    navigation.goBack();
  };

  const renderItem = ({item}: {item: Offer}) => {
    const isApplied = appliedOfferCode === item.code;
    return (
      <View style={styles.cardWrap}>
        <LinearGradient
          colors={['#FF5964', '#306CFE']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradientBorder}>
          <View style={styles.card}>
            <View style={{flex: 1}}>
              <Text style={styles.discount}>{item.discount}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>

            <TouchableOpacity
              disabled={isApplied}
              onPress={() => handleApply(item)}
              style={[styles.applyButton, isApplied && styles.appliedButton]}>
              <Text style={[styles.applyText, isApplied && styles.appliedText]}>
                {isApplied ? 'Applied' : 'Apply Coupon'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <HeaderWithNoIcons
        title="All Offers"
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={offers}
        keyExtractor={i => i.code}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
        contentContainerStyle={{padding: 16}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardWrap: {marginBottom: 12},
  gradientBorder: {borderRadius: 8, padding: 1.5},
  card: {
    backgroundColor: '#fff',
    borderRadius: 7,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  discount: {fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 4},
  desc: {fontSize: 12, color: '#666', marginBottom: 6},
  applyButton: {
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#FF5964',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  appliedButton: {borderColor: '#4CAF50', backgroundColor: '#f0f9f4'},
  applyText: {color: '#FF5964', fontWeight: '700'},
  appliedText: {color: '#4CAF50'},
});

export default OfferListScreen;
