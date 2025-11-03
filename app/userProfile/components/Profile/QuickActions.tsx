import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  onMyOrdersPress: () => void;
  onWishlistPress: () => void;
  onAddressPress: () => void;
}

const QuickActions: React.FC<Props> = ({
  onMyOrdersPress,
  onWishlistPress,
  onAddressPress,
}) => {
  return (
    <View style={styles.container}>
      {/* My Orders */}
      <TouchableOpacity style={styles.actionItem} onPress={onMyOrdersPress}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="package-variant" size={45} color="#666" />
        </View>
        <Text style={styles.actionLabel}>My Orders</Text>
      </TouchableOpacity>

      {/* My Wishlist */}
      <TouchableOpacity style={styles.actionItem} onPress={onWishlistPress}>
        <View style={styles.iconContainer}>
          <Ionicons name="heart-outline" size={45} color="#666" />
        </View>
        <Text style={styles.actionLabel}>My Wishlist</Text>
      </TouchableOpacity>

      {/* Saved Addresses */}
      <TouchableOpacity style={styles.actionItem} onPress={onAddressPress}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={45} color="#666" />
        </View>
        <Text style={styles.actionLabel}>Saved Addresses</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    borderBottomColor: '#E5E5E5',
    gap: 10,
    marginBottom: 10,
  },
  actionItem: {
    height:110,
    backgroundColor: '#fff',
    width:120,
    alignItems: 'center',
    flex: 1,
    borderRadius: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    top:13,
    // backgroundColor: '#d46363ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,

  },
  actionLabel: {
    fontSize: 14,
    color: '#222',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
    top:5,
    letterSpacing: 0.1,
  },
});

export default QuickActions;
