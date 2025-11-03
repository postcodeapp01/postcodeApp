// screens/TermsAndPoliciesScreen.tsx
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PolicyTextContent from '../components/TermsAndPolicies/PolicyTextContent';
import {termsAndConditionsText} from '../components/TermsAndPolicies/policyData';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

const TermsAndPoliciesScreen: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      
        <HeaderWithNoIcons title="Terms & policies" onBack={() => navigation.goBack()} />
      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <PolicyTextContent content={termsAndConditionsText} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default TermsAndPoliciesScreen;
