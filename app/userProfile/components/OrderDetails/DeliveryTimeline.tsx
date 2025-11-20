
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface TimelineItem {
  label: string;
  address: string;
  isActive?: boolean;
}

interface DeliveryTimelineProps {
  items: TimelineItem[];
}

const DeliveryTimeline: React.FC<DeliveryTimelineProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.timelineItem}>
          {/* Icon/Dot */}
          <View style={styles.iconContainer}>
            <View style={[styles.dot, item.isActive && styles.activeDot]}>
              <Icon
                name={item.isActive ? 'arrow-up' : item.label === 'Home' ? 'arrow-down' : 'ellipse'}
                size={item.label === 'Home' ? 16 : 12}
                color={item.isActive ? '#FF6B00' : '#999'}
              />
            </View>
            {index < items.length - 1 && <View style={styles.line} />}
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={[styles.label, item.isActive && styles.activeLabel]}>
              {item.label}
            </Text>
            <Text style={styles.address} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 24,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeDot: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF6B00',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  activeLabel: {
    color: '#FF6B00',
  },
  address: {
    fontSize: 12,
    color: '#999',
  },
});

export default DeliveryTimeline;
