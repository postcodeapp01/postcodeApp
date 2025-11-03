// components/profile/MenuSection.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


export interface MenuItem {
   id: string;
  title: string;
  icon: string;
  iconType?: 'material' | 'ionicons';
  onPress: () => void;
}

interface Props {
  title?: string;
  items: MenuItem[];
}

const MenuSection: React.FC<Props> = ({title, items}) => {
   const renderIcon = (item: MenuItem) => {
    if (!item.icon) return null;

    const IconComponent = item.iconType === 'material' ? Icon : Ionicons;
    
    return (
      <IconComponent
        name={item.icon}
        size={20}
        color="#666"
        style={styles.menuIcon}
      />
    );
  };
  return (
    <View >
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.menuContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index === items.length - 1 && styles.lastMenuItem,
            ]}
            onPress={item.onPress}>
              {renderIcon(item)}
            <Text style={styles.menuText}>{item.title}</Text>
            <Icon name="keyboard-arrow-right" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical:12,
    backgroundColor: '#FFF',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  menuContainer: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    lineHeight: 20,
    letterSpacing: 0.1,
    flex: 1,
  },
});

export default MenuSection;
