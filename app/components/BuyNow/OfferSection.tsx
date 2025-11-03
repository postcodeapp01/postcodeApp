// OfferSection.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const OfferSection = ({offers, appliedOffer, onApplyOffer}) => (
  <View style={styles.container}>
    {offers.map((offer, idx) => {
      const isApplied = appliedOffer?.code === offer.code;
      return (
        <View key={idx} style={styles.offerCard}>
          {/* Left orange strip */}
          <View style={styles.discountStrip}>
            <Text style={styles.discountText}>{offer.discount}</Text>
          </View>

          {/* Offer details */}
          <View style={styles.offerDetails}>
            <View style={styles.topRow}>
              <Text style={styles.offerCode}>{offer.code}</Text>
              <TouchableOpacity
                disabled={isApplied}
                onPress={() => onApplyOffer(offer)}>
                <Text
                  style={[
                    styles.apply,
                    isApplied && {color: 'green', opacity: 0.7},
                  ]}>
                  {isApplied ? 'APPLIED' : 'APPLY'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.saveText}>{offer.description}</Text>
            <View style={styles.dottedLine} />
            <Text style={styles.subText}>
              Use code {offer.code} & get {offer.description}
            </Text>
          </View>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
  },
  offerCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  discountStrip: {
    backgroundColor: '#FF6B00',
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    transform: [{rotate: '-90deg'}],
  },
  offerDetails: {
    flex: 1,
    padding: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  apply: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B00',
  },
  saveText: {
    fontSize: 12,
    color: 'green',
    marginTop: 2,
  },
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 0.8,
    borderColor: '#B1B1B1',
    marginVertical: 4,
  },
  subText: {
    fontSize: 11,
    color: '#999',
  },
});

export default OfferSection;
