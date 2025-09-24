import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import CartItem, { CartItemType } from './CartItem';
import CartSummary from './CartSummary';
import { CartData } from '../../screens/CartScreen';

interface CartStepProps {
  cartData: CartData;
  onUpdateItem: (cartId: string, qty: number, size?: string, colorId?: string) => void;
  onRemoveItem: (cartId: string) => void;
  onNext: () => void;
}

const CartStep: React.FC<CartStepProps> = ({
  cartData,
  onUpdateItem,
  onRemoveItem,
  onNext,
}) => {
  // console.log("hiii",cartData)
  return (
    <View style={styles.container}>
      <FlatList
        data={cartData.items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onQtyChange={qty => onUpdateItem(item.cartId, qty)}
            onRemove={() => onRemoveItem(item.cartId)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      
      <CartSummary
        total={cartData.total}
        buttonText="Confirm & Pay"
        onConfirm={onNext}
      />
    </View>
  );
};

export default CartStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 120, // Space for fixed bottom summary
  },
});
