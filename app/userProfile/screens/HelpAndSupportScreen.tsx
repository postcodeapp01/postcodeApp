// screens/HelpAndSupportScreen.tsx
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SupportOptionCard, {SupportOption} from '../components/Support/SupportOptionCard';
import { Header } from '@react-navigation/elements';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

const HelpAndSupportScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const supportOptions: SupportOption[] = [
    {
      id: '1',
      title: 'Chat with support',
      icon: 'chatbubble-outline',
      iconType: 'ionicons',
      action: 'chat',
    },
    {
      id: '2',
      title: 'Call Us',
      icon: 'call-outline',
      iconType: 'ionicons',
      action: 'call',
    },
    {
      id: '3',
      title: 'Email Support',
      subtitle: 'Support@trendrush.com',
      icon: 'mail-outline',
      iconType: 'ionicons',
      action: 'email',
    },
  ];

  const handleChatSupport = () => {
    Alert.alert(
      'Chat Support',
      'Opening chat with support team...',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Chat',
          onPress: () => {
            // Navigate to chat screen or open external chat
            // navigation.navigate('ChatSupport');
            console.log('Opening chat support');
          },
        },
      ],
    );
  };

  const handleCallUs = () => {
    Alert.alert(
      'Call Us',
      'Would you like to call our support team?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Call',
          onPress: async () => {
            const phoneNumber = 'tel:+911234567890';
            const supported = await Linking.canOpenURL(phoneNumber);
            if (supported) {
              await Linking.openURL(phoneNumber);
            } else {
              Alert.alert('Error', 'Unable to make a call');
            }
          },
        },
      ],
    );
  };

  const handleEmailSupport = () => {
    const email = 'support@trendrush.com';
    const subject = 'Support Request';
    const body = 'Hi TrendRush Team,\n\nI need help with...';
    
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(emailUrl).catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const handleOptionPress = (option: SupportOption) => {
    switch (option.action) {
      case 'chat':
        navigation.navigate('ChatSupport');
        break;
      case 'call':
        // handleCallUs();
        break;
      case 'email':
        // handleEmailSupport();
        break;
      default:
        console.log('Unknown action:', option.action);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
        <HeaderWithNoIcons title="Help & Support" onBack={() => navigation.goBack()} />
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsContainer}>
          {supportOptions.map((option, index) => (
            <SupportOptionCard
              key={option.id}
              option={option}
              onPress={() => handleOptionPress(option)}
            />
          ))}
        </View>

       
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

export default HelpAndSupportScreen;
