import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface Props {
  title: string;
  details: string[];
  description: string;
}

const ProductDescription: React.FC<Props> = ({title, details, description}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.detailHeading}>Details:</Text>
      {details.map((item, index) => (
        <Text key={index} style={styles.detail}>
          • {item}
        </Text>
      ))}
    </View>
  );
};

export default ProductDescription;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    lineHeight: 20,
    fontSize: 16,
    letterSpacing: 0.1,
    fontWeight: '500',
    color: '#222222',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 15,
    letterSpacing: 0.1,
    color: '#636363',
  },
  detailHeading: {
    lineHeight: 20,
    letterSpacing: 0.1,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '400',
    color: '#222222',
  },
  detail: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#8e8989ff',
  },
});
