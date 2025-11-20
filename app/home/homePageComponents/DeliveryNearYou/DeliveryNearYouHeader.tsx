import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  onSeeAll?: () => void;
}

const DeliveryNearYouHeader: React.FC<Props> = ({onSeeAll}) => (
  <View style={styles.header}>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Delivering in 1hr Near You</Text>
    </View>
    <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
      <Text style={styles.seeAllText}>see all</Text>
      <Icon name="chevron-right" size={18} color="#222" />
    </TouchableOpacity>
  </View>
);

export default DeliveryNearYouHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    color: '#222',
    marginRight: 4,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});
