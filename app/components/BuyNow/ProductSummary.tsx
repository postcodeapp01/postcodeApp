import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProductSummary = ({product}) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('XS');
  const [showQtyDropdown, setShowQtyDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const quantities = [1, 2, 3, 4, 5];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const renderDropdown = (data, onSelect) => (
    <FlatList
      data={data}
      keyExtractor={item => item.toString()}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={() => {
            onSelect(item);
          }}>
          <Text style={styles.dropdownText}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Product Image */}
        <Image
          source={require('../../../sources/images/c1.png')}
          style={styles.image}
        />

        {/* Product Details */}
        <View style={styles.details}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.subtitle}>{product.brand}</Text>

          {/* Price Row */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            <Text style={styles.discount}>{product.discount}% OFF</Text>
          </View>

          {/* Dropdown Row */}
          <View style={styles.dropdownRow}>
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowQtyDropdown(!showQtyDropdown)}>
                <Text style={styles.dropdownButtonText}>Qty {quantity}</Text>
                <Icon
                  name={showQtyDropdown ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#333"
                  style={{top:-1}}
                />
              </TouchableOpacity>
              {showQtyDropdown && (
                <View style={styles.dropdownList}>
                  {renderDropdown(quantities, item => {
                    setQuantity(item);
                    setShowQtyDropdown(false);
                  })}
                </View>
              )}
            </View>

            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowSizeDropdown(!showSizeDropdown)}>
                <Text style={styles.dropdownButtonText}>Size {size}</Text>
                <Icon
                  name={showSizeDropdown ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#333"
                  style={{top:-1}}
                />
              </TouchableOpacity>
              {showSizeDropdown && (
                <View style={styles.dropdownList}>
                  {renderDropdown(sizes, item => {
                    setSize(item);
                    setShowSizeDropdown(false);
                  })}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Express Delivery Row */}
      <View style={styles.deliveryRow}>
        <Icon name="truck-fast-outline" size={18} color="#FF4C4C" />
        <Text style={styles.express}>
          <Text style={styles.expressBold}>Express</Text> Delivery in 45 Mins
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 74,
  },
  image: {
    width: 64,
    height: 74,
    marginRight: 12,
    borderRadius: 6,
  },
  details: {
    flex: 1,
    height: 74,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    marginVertical: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222222',
    marginRight: 3,
  },
  originalPrice: {
    fontSize: 12,
    color: '#AAAAAA',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  discount: {
    fontSize: 12,
    color: '#B51C0F',
    fontWeight: '600',
  },
  dropdownRow: {
    flexDirection: 'row',
    marginTop: 6,
    height: 20,
    gap: 5,
  },
  dropdown: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 4,
    // paddingVertical: 5,
    padding: 2,
    width: 55,
    // backgroundColor: '#f9f9f9',
    // backgroundColor: '#b71616ff',
  },
  dropdownButtonText: {
    fontSize: 10,
    color: '#000',
  },
  dropdownList: {
    position: 'absolute',
    top: 26,
    width: 54,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 11,
    color: '#333',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 6,
  },
  express: {
    fontSize: 12,
    marginLeft: 4,
    color: '#333',
  },
  expressBold: {
    fontWeight: '600',
    color: '#FF4C4C',
  },
});

export default ProductSummary;
