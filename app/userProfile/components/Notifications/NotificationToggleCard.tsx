
import React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';

interface Props {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

const NotificationToggleCard: React.FC<Props> = ({
  title,
  description,
  value,
  onValueChange,
}) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={{flex: 1}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: '#DDD', true: '#34C759'}}
        thumbColor="#fff"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    // backgroundColor: '#f09f9fff',
    marginHorizontal: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
   
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
    lineHeight:20,
    letterSpacing:0.1,
  },
  description: {
    color: '#636363',
    fontSize: 14,
    fontWeight:'400',
    lineHeight:20,
    letterSpacing:0.1,
  },
});

export default NotificationToggleCard;
