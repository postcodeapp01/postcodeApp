import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomActionBar: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="apps-outline" size={20} color="#fff" />
        <Text style={styles.actionText}>Sort</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="grid-outline" size={20} color="#fff" />
        <Text style={styles.actionText}>Category</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="filter-outline" size={20} color="#fff" />
        <Text style={styles.actionText}>Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default BottomActionBar;
