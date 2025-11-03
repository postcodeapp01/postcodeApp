// components/profile/ProfileHeader.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartIcon from '../../../common/CartIcon';

interface Props {
  title: string;
  onBack: () => void;
  navigation?: any;
  showCart?: boolean;
}

const HeaderWithNoIcons: React.FC<Props> = ({
  title,
  onBack,
  navigation,
  showCart = false,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <View style={styles.circleButton}>
          <Icon name="arrow-back" size={22} color="#000" />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {showCart && (
        <View style={styles.iconButton}>
          <CartIcon size={17} color="#222" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#464646',
    left: 15,
    top: 2,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  iconButton: {
    paddingHorizontal: 3,
  },
  circleButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default HeaderWithNoIcons;
