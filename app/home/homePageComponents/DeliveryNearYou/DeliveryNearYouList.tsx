import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import StoreCard from "./StoreCard";

import type { Store } from "./StoreCard";

interface Props {
  stores: Store[];
  onStorePress?: (store: Store) => void;
}

const DeliveryNearYouList: React.FC<Props> = ({ stores, onStorePress }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.scrollContent}
    style={styles.scrollView}
  >
    {stores.map((store) => (
      <StoreCard key={store.id} store={store} onPress={onStorePress} />
    ))}
  </ScrollView>
);

export default DeliveryNearYouList;

const styles = StyleSheet.create({
  scrollView: { paddingLeft: 16 },
  scrollContent: { paddingRight: 16 },
});
