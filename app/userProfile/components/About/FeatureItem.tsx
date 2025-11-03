import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  title: string;
  description: string;
}

const FeatureItem: React.FC<Props> = ({title, description}) => {
  return (
    <View style={styles.featureItem}>
      <View style={styles.checkmark}>
        <Ionicons name="checkmark-circle" size={20} color="#FF6B6B" />
      </View>
      <View style={styles.content}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkmark: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default FeatureItem;
