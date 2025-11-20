
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface Props {
  content: string;
}

const PolicyTextContent: React.FC<Props> = ({content}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#000',
    textAlign: 'justify',
    letterSpacing:-0.32,
  },
});

export default PolicyTextContent;
