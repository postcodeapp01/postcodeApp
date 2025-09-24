import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface CartItemType {
  cartId: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  qty: number;
  image: string;
  returns?: string;
  estimatedTime?: string;
  deliveryTag?: string; // e.g. "Delivery in 60mins"
  size?: string;
}

interface Props {
  item: CartItemType;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
  onSizeChange?: (size: string) => void;
}

const sampleSizes = ['XS', 'S', 'M', 'L', 'XL'];

const formatPrice = (p: number) => `₹${p}`;

const CartItem: React.FC<Props> = ({
  item,
  onQtyChange,
  onRemove,
  onSizeChange,
}) => {
  const {
    name,
    brand,
    price,
    originalPrice,
    discount,
    qty,
    image,
    returns: ret,
    estimatedTime,
    size,
  } = item;
  // console.log('Card item', item);
  const [qtyInput, setQtyInput] = useState(String(qty));
  const deliveryTag = 'Delivery in 60mins';
  const handleQtyIncrease = (e?: GestureResponderEvent) => {
    const next = qty + 1;
    onQtyChange(next);
  };
  const handleQtyDecrease = (e?: GestureResponderEvent) => {
    const next = qty <= 1 ? 1 : qty - 1;
    onQtyChange(next);
  };
  const handleSizePress = () => {
    if (!onSizeChange) return;
    const curIndex = sampleSizes.indexOf(size ?? 'XS');
    const next = sampleSizes[(curIndex + 1) % sampleSizes.length];
    onSizeChange(next);
  };
  const handleQtyInputChange = (text: string) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    setQtyInput(numericValue);

    if (numericValue) {
      const parsedQty = Math.max(1, Math.min(99, parseInt(numericValue, 10)));
      onQtyChange(parsedQty);
    }
  };
  useEffect(() => {
    setQtyInput(String(qty)); // keep input in sync when qty changes externally
  }, [qty]);
  return (
    <View style={styles.card}>
      {/* Delivery Tag Overlapping */}
      {deliveryTag ? (
        <View style={styles.topBadge}>
          <Ionicons
            name="time-outline"
            size={24}
            color="#FF5964"
            style={{marginRight: 6}}
          />
          <Text style={styles.topBadgeText}>{deliveryTag}</Text>
        </View>
      ) : null}

      {/* Main Content */}
      <View style={styles.row}>
        <Image
          source={
            image ? {uri: image} : require('../../../sources/images/c1.png')
          }
          style={styles.image}
        />

        <View style={styles.main}>
          {/* Title + subname */}
          <View>
            <Text style={styles.name} numberOfLines={2}>
              {name}
            </Text>
            {name ? <Text style={styles.subname}>{brand}</Text> : null}
          </View>

          {/* Price row */}
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{formatPrice(price)}</Text>
            {originalPrice ? (
              <Text style={styles.originalPrice}>
                {formatPrice(originalPrice)}
              </Text>
            ) : null}
            {discount ? (
              <View style={styles.discountPill}>
                <Text style={styles.discountText}>{discount}% OFF</Text>
              </View>
            ) : null}
          </View>

          {/* Qty & Size */}
          <View style={styles.selectRow}>
            <View style={styles.selectBox}>
              <Text style={styles.selectLabel}>Qty</Text>
              <View style={styles.selectValueRow}>
                {/* <Text style={styles.selectValue}> {qty<10?'0'+qty:qty}</Text> */}
                <TextInput
                  value={qtyInput}
                  onChangeText={handleQtyInputChange}
                  keyboardType="numeric"
                  maxLength={2} // optional: limit to 2 digits
                  style={[styles.selectValue, styles.qtyInput]} // add extra style for input
                />
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    left: -11,
                  }}>
                  <TouchableOpacity onPress={handleQtyDecrease}>
                    <MaterialIcons
                      name="arrow-drop-up"
                      color={'#B1B1B1'}
                      size={20}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleQtyIncrease}>
                    <MaterialIcons
                      name="arrow-drop-down"
                      color={'#B1B1B1'}
                      size={20}
                      style={{marginTop: -11}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.selectBox, {marginLeft: 10}]}
              onPress={handleSizePress}
              activeOpacity={0.75}>
              <Text style={styles.selectLabel}>Size</Text>
              <View style={styles.selectValueRow}>
                <Text style={styles.selectValue}>{size ? size : 'S'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Pills */}
          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <MaterialIcons
                name="autorenew"
                size={16}
                color="#2F80ED"
                style={{marginRight: 8, left: 4}}
              />
              <Text style={styles.pillText}>
                {ret ?? '1 day Return and Exchange'}
              </Text>
            </View>

            <View style={[styles.pill, styles.estimatedPill]}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#18B58A"
                style={{marginRight: 8, left: 1}}
              />
              <Text style={styles.pillText2}>
                {estimatedTime ?? 'Estimated time within 45mins'}
              </Text>
            </View>
          </View>

          {/* Separator + Remove */}
        </View>
      </View>
      <View style={styles.separatorAndRemove}>
        <View style={styles.dashedSeparator} />
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={onRemove}
          activeOpacity={0.75}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={15}
            color="#AAAAAAAA"
          />
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  card: {
    height: 230,
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 5,
    overflow: 'hidden',
    position: 'relative',
  },

  // Delivery Tag overlaps card
  topBadge: {
    top: -2,
    height: 24,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBadgeText: {
    top: 2,
    fontSize: 14,
    lineHeight: 15,
    letterSpacing: 0.1,
    fontWeight: '500',
    color: '#000000',
  },

  row: {
    top: -12,
    height: 130,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },

  image: {
    width: 100,
    height: 130,
    resizeMode: 'cover',
    backgroundColor: '#f2f2f2',
    marginRight: 10,
  },

  main: {
    flex: 1,
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    lineHeight: 15,
  },
  subname: {
    fontSize: 10,
    color: '#AAAAAA',
    lineHeight: 15,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
    color: '#111',
    letterSpacing: -0.32,
  },
  originalPrice: {
    fontSize: 12,
    color: '#AAAAAA',
    textDecorationLine: 'line-through',
    marginRight: 1,
  },
  discountPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    color: '#B51C0F',
    fontWeight: '600',
    letterSpacing: -0.32,
  },

  selectRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  selectBox: {
    width: 55,
    height: 20,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 6,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  selectLabel: {
    fontSize: 10,
    color: '#B1B1B1',
  },
  selectValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectValue: {
    color: '#000',
    fontSize: 10,
    fontWeight: '400',
    marginRight: 4,
  },
  qtyInput: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '400',
    paddingVertical: -1,
    paddingHorizontal: -4,
  },
  pillRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    left: -8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  estimatedPill: {
    marginLeft: 8,
    backgroundColor: '#F3F0F0',
    borderRadius: 10,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 15,
    letterSpacing: 0.1,
    color: '#AAAAAA',
  },
  pillText2: {
    left: -1,
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 15,
    letterSpacing: 0.1,
    color: '#000',
  },
  separatorAndRemove: {
    alignItems: 'flex-end',
  },
  dashedSeparator: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#AAAAAA',
    width: '100%',
    marginBottom: 10,
  },
  removeBtn: {
    width: 150,
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#AAAAAA',
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  removeText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#AAAAAAAA',
    fontWeight: '700',
  },
});
