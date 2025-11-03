// components/ui/CartIcon.tsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons bag-outline
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Store';

type Props = {
  size?: number;
  color?: string;
  showZero?: boolean; // whether to show badge when count is 0
};

const CartIcon: React.FC<Props> = ({ size = 18, color = '#222', showZero = false }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  // derive count: sum of qty across items so quantity is represented
  const count = useSelector((state: RootState) => {
    const items = state.cart?.items ?? [];
    return items.reduce((s: number, it: any) => s + (Number(it.qty) || 0), 0);
  });
  const displayCount = useMemo(() => {
    if (!showZero && (!count || count <= 0)) return 0;
    return count;
  }, [count, showZero]);

  const onPress = () => {
    navigation.navigate('CartScreen' as never);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.touchable}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityLabel="Open cart"
      accessibilityHint="Opens cart screen"
    >
      <View style={styles.iconWrap}>
        <Icon name="bag-outline" size={size} color={color} />
        {displayCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {displayCount > 99 ? '99+' : String(displayCount)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    // paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
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
    shadowOpacity: .25,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
});

export default CartIcon;
