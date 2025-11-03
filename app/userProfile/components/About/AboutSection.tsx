import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface Props {
  title: string;
  content: string;
}

const AboutSection: React.FC<Props> = ({title, content}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    lineHeight:20,
    letterSpacing:-0.32,
  },
  sectionContent: {
    fontSize: 14,
    color: '#636363',
    lineHeight:20,
    letterSpacing:-0.32,
    textAlign: 'justify',
  },
});

export default AboutSection;
