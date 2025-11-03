// components/support/SupportOptionCard.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface SupportOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconType?: 'material' | 'ionicons';
  action: 'chat' | 'call' | 'email';
}

interface Props {
  option: SupportOption;
  onPress: () => void;
}

const SupportOptionCard: React.FC<Props> = ({option, onPress}) => {
  const IconComponent = option.iconType === 'material' 
    ? MaterialCommunityIcons 
    : Ionicons;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <IconComponent name={option.icon} size={18} color="#666" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{option.title}</Text>
        {option.subtitle && (
          <Text style={styles.subtitle}>{option.subtitle}</Text>
        )}
      </View>

      <Ionicons name="chevron-forward" size={18} color="#AAAAAA" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#75ef6eff',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
    lineHeight:20,
    letterSpacing:0.1,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
});

export default SupportOptionCard;
