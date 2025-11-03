// components/home/RecommendedForYou.tsx
import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import StoreRecommendationCard, {StoreRecommendation} from './StoreRecommendationCard';

interface Props {
  stores: StoreRecommendation[];
  onStorePress: (store: StoreRecommendation) => void;
}

const RecommendedForYou: React.FC<Props> = ({stores, onStorePress}) => {
  const renderStore = ({item}: {item: StoreRecommendation}) => (
    <StoreRecommendationCard store={item} onPress={() => onStorePress(item)} />
  );

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <Text style={styles.sectionTitle}>Recommended For You</Text>

      {/* Stores List */}
      <FlatList
        data={stores}
        renderItem={renderStore}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false} // If inside a parent ScrollView
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',

  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    lineHeight:20,
    letterSpacing:.1,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 8,
  },
});

export default RecommendedForYou;
