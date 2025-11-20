// // OfferSection.tsx
// import React from 'react';
// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

// const OfferSection = ({offers, appliedOffer, onApplyOffer}) => (
//   <View style={styles.container}>
//     {offers.map((offer, idx) => {
//       const isApplied = appliedOffer?.code === offer.code;
//       return (
//         <View key={idx} style={styles.offerCard}>
//           {/* Left orange strip */}
//           <View style={styles.discountStrip}>
//             <Text style={styles.discountText}>{offer.discount}</Text>
//           </View>

//           {/* Offer details */}
//           <View style={styles.offerDetails}>
//             <View style={styles.topRow}>
//               <Text style={styles.offerCode}>{offer.code}</Text>
//               <TouchableOpacity
//                 disabled={isApplied}
//                 onPress={() => onApplyOffer(offer)}>
//                 <Text
//                   style={[
//                     styles.apply,
//                     isApplied && {color: 'green', opacity: 0.7},
//                   ]}>
//                   {isApplied ? 'APPLIED' : 'APPLY'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.saveText}>{offer.description}</Text>
//             <View style={styles.dottedLine} />
//             <Text style={styles.subText}>
//               Use code {offer.code} & get {offer.description}
//             </Text>
//           </View>
//         </View>
//       );
//     })}
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginBottom: 5,
//   },
//   offerCard: {
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 6,
//     overflow: 'hidden',
//     marginBottom: 10,
//   },
//   discountStrip: {
//     backgroundColor: '#FF6B00',
//     paddingVertical: 8,
//     paddingHorizontal: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   discountText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '700',
//     transform: [{rotate: '-90deg'}],
//   },
//   offerDetails: {
//     flex: 1,
//     padding: 8,
//   },
//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   offerCode: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#000',
//   },
//   apply: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#FF6B00',
//   },
//   saveText: {
//     fontSize: 12,
//     color: 'green',
//     marginTop: 2,
//   },
//   dottedLine: {
//     borderStyle: 'dotted',
//     borderWidth: 0.8,
//     borderColor: '#B1B1B1',
//     marginVertical: 4,
//   },
//   subText: {
//     fontSize: 11,
//     color: '#999',
//   },
// });

// export default OfferSection;

// // OfferSection.tsx
// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';

// interface Offer {
//   code: string;
//   discount: string;
//   description: string;
// }

// interface OfferSectionProps {
//   offers: Offer[];
//   appliedOffer?: Offer | null;
//   onApplyOffer: (offer: Offer) => void;
// }

// const OfferSection: React.FC<OfferSectionProps> = ({
//   offers,
//   appliedOffer,
//   onApplyOffer,
// }) => {
//   return (
//     <View style={styles.container}>
//       {offers.map((offer, idx) => {
//         const isApplied = appliedOffer?.code === offer.code;
//         return (
//           <View key={idx} style={styles.offerCardWrapper}>
//             {/* Gradient Border */}
//             <LinearGradient
//               colors={['#FF5964', '#306CFE']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.gradientBorder}
//             >
//               <View style={styles.offerCard}>
//                 {/* Offer Info */}
//                 <View style={styles.offerInfo}>
//                   <Text style={styles.discountText}>{offer.discount}</Text>
//                   <Text style={styles.offerDescription}>{offer.description}</Text>

//                   {/* View All Link */}
//                   <TouchableOpacity style={styles.viewAllButton}>
//                     <Text style={styles.viewAllText}>view all</Text>
//                     <Icon name="chevron-forward" size={14} color="#FF5964" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Apply Button */}
//                 <TouchableOpacity
//                   disabled={isApplied}
//                   onPress={() => onApplyOffer(offer)}
//                   style={[
//                     styles.applyButton,
//                     isApplied && styles.appliedButton,
//                   ]}
//                   activeOpacity={0.7}
//                 >
//                   <Text
//                     style={[
//                       styles.applyButtonText,
//                       isApplied && styles.appliedButtonText,
//                     ]}
//                   >
//                     {isApplied ? 'Applied' : 'Apply Coupon'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </LinearGradient>
//           </View>
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },

//   offerCardWrapper: {
//     marginBottom: 12,
//   },

//   gradientBorder: {
//     borderRadius: 8,
//     padding: 1.5, // Border thickness
//   },

//   offerCard: {
//     backgroundColor: '#fff',
//     borderRadius: 7,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//   },

//   offerInfo: {
//     flex: 1,
//     marginRight: 12,
//   },

//   discountText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },

//   offerDescription: {
//     fontSize: 11,
//     color: '#666',
//     marginBottom: 8,
//   },

//   viewAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 2,
//   },

//   viewAllText: {
//     fontSize: 12,
//     color: '#FF5964',
//     fontWeight: '500',
//   },

//   applyButton: {
//     backgroundColor: '#fff',
//     borderWidth: 1.5,
//     borderColor: '#FF5964',
//     borderRadius: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     minWidth: 100,
//     alignItems: 'center',
//   },

//   appliedButton: {
//     borderColor: '#4CAF50',
//     backgroundColor: '#f0f9f4',
//   },

//   applyButtonText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#FF5964',
//     letterSpacing: 0.3,
//   },

//   appliedButtonText: {
//     color: '#4CAF50',
//   },
// });

// export default OfferSection;
// components/OfferSection.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';

interface Offer {
  code: string;
  discount: string;
  description: string;
}

interface OfferSectionProps {
  offers: Offer[];
  appliedOffer?: Offer | null;
  onApplyOffer: (offer: Offer) => void;
  // optional screen name for the full offer list (defaults to "OfferList")
  offerListScreenName?: string;
}

const OfferSection: React.FC<OfferSectionProps> = ({
  offers,
  appliedOffer,
  onApplyOffer,
  offerListScreenName = 'OfferList',
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  // show only the first offer card (if present)
  const firstOffer = offers?.length ? offers[0] : null;

  const openOfferList = () => {
    // pass all offers and current route name so OfferList can return selection
    const prevRouteName = route.name ?? 'Unknown';
    navigation.navigate(
      offerListScreenName as never,
      {
        offers,
        prevRouteName,
        appliedOfferCode: appliedOffer?.code ?? null,
      } as never,
    );
  };

  return (
    <View style={styles.container}>
      {firstOffer ? (
        <View style={styles.offerCardWrapper}>
          <LinearGradient
            colors={['#FF5964', '#306CFE']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientBorder}>
            <View style={styles.offerCard}>
              <View style={styles.offerInfo}>
                <Text style={styles.discountText}>{firstOffer.discount}</Text>
                <Text style={styles.offerDescription}>
                  {firstOffer.description}
                </Text>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={openOfferList}
                  activeOpacity={0.7}>
                  <Text style={styles.viewAllText}>view all</Text>
                  <Icon name="chevron-forward" size={14} color="#FF5964" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                disabled={appliedOffer?.code === firstOffer.code}
                onPress={() => onApplyOffer(firstOffer)}
                style={[
                  styles.applyButton,
                  appliedOffer?.code === firstOffer.code &&
                    styles.appliedButton,
                ]}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.applyButtonText,
                    appliedOffer?.code === firstOffer.code &&
                      styles.appliedButtonText,
                  ]}>
                  {appliedOffer?.code === firstOffer.code
                    ? 'Applied'
                    : 'Apply Coupon'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      ) : (
        <Text style={styles.noOfferText}>No offers available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  offerCardWrapper: {
    marginBottom: 12,
  },
  gradientBorder: {
    borderRadius: 8,
    padding: 1.5,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  offerInfo: {
    flex: 1,
    marginRight: 12,
  },
  discountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 12,
    color: '#FF5964',
    fontWeight: '500',
    marginRight: 6,
  },
  applyButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#FF5964',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  appliedButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f9f4',
  },
  applyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF5964',
    letterSpacing: 0.3,
  },
  appliedButtonText: {
    color: '#4CAF50',
  },
  noOfferText: {
    color: '#999',
  },
});

export default OfferSection;
