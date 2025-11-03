import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

interface Props {
  activeTab: 'details' | 'reviews';
  setActiveTab: (tab: 'details' | 'reviews') => void;
}

const TabSwitcher: React.FC<Props> = ({activeTab, setActiveTab}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'details' && styles.activeTab]}
        onPress={() => setActiveTab('details')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'details' && styles.activeTabText,
          ]}>
          Product Details
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
        onPress={() => setActiveTab('reviews')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'reviews' && styles.activeTabText,
          ]}>
          Reviews
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabSwitcher;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    // backgroundColor: '#bcebb6ff',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    // borderBottomWidth: 3, // Reduced thickness
    borderColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: '#F8BDC1',
    borderBottomLeftRadius: 8, // Rounded corners
    borderBottomRightRadius: 8,
    borderBottomEndRadius: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
});
