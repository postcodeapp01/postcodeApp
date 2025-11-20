
import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import SupportOptionCard, {
  SupportOption,
} from '../components/Support/SupportOptionCard';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

const HelpAndSupportScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [openOptionId, setOpenOptionId] = useState<string | null>(null);

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
      // subtitle: 'Support@trendrush.com',
      icon: 'mail-outline',
      iconType: 'ionicons',
      action: 'email',
    },
  ];

  const handleCallAction = async (phone: string) => {
    const phoneNumber = `tel:${phone}`;
    const supported = await Linking.canOpenURL(phoneNumber);
    if (supported) {
      await Linking.openURL(phoneNumber);
    } else {
      Alert.alert('Error', 'Unable to make a call');
    }
  };

  const handleEmailAction = (email: string) => {
    const subject = 'Support Request';
    const body = 'Hi TrendRush Team,\n\nI need help with...';
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
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
      case 'email':
        // toggle dropdown
        setOpenOptionId(prev => (prev === option.id ? null : option.id));
        break;
      default:
        console.log('Unknown action:', option.action);
    }
  };

  // Dropdown contents for Call and Email - match UX in provided image
  const renderDropdownFor = (option: SupportOption) => {
    if (!option) return null;
    if (option.action === 'call') {
      // Use the real phone you want here
      const phone = '+919876543210';
      return (
        <View style={styles.dropdownCard}>
          <View style={styles.dropdownLeft}>
            <Text style={styles.dropdownTitle}>Customer Care</Text>
            <Text style={styles.dropdownPrimary}>{phone}</Text>
            <Text style={styles.dropdownSub}>Available: 8 AM - 10 PM</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionCircle}
            onPress={() => handleCallAction(phone)}
            accessibilityRole="button"
            accessibilityLabel="Call support">
            <Text style={styles.actionEmoji}>📞</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (option.action === 'email') {
      const email = option.subtitle ?? 'support@trendrush.com';
      return (
        <View style={styles.dropdownCard}>
          <View style={styles.dropdownLeft}>
            <Text style={styles.dropdownTitle}>Customer Care</Text>
            <Text style={styles.dropdownPrimary}>{email}</Text>
            <Text style={styles.dropdownSub}>
              Response time: within 24 hours
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionCircle}
            onPress={() => handleEmailAction(email)}
            accessibilityRole="button"
            accessibilityLabel="Email support">
            <Text style={styles.actionEmoji}>✉️</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderWithNoIcons
        title="Help & Support"
        onBack={() => navigation.goBack()}
      />
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsContainer}>
          {supportOptions.map(option => (
            <View key={option.id}>
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => handleOptionPress(option)}>
                
                
                <SupportOptionCard
                  key={option.id}
                  option={option}
                  onPress={() => handleOptionPress(option)}
                  isOpen={openOptionId === option.id}
                />
              </TouchableOpacity>

              {/* Dropdown (renders directly below the card) */}
              {openOptionId === option.id &&
                (option.action === 'call' || option.action === 'email') && (
                  <View style={styles.dropdownWrapper}>
                    {renderDropdownFor(option)}
                  </View>
                )}
            </View>
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
    paddingHorizontal: 10,
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dropdownWrapper: {
    paddingHorizontal: 12,
  },
  dropdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    
  },
  dropdownLeft: {
    flex: 1,
    paddingRight: 10,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  dropdownPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  dropdownSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
   
  },
  actionEmoji: {
    fontSize: 22,
  },
});

export default HelpAndSupportScreen;
