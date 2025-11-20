import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type MenuItem = {
  id: string;
  title: string;
  screen?: string;
  url?: string;
};

type Props = {
  navigation: any;
};

const AboutScreen: React.FC<Props> = ({ navigation }) => {
  const menuItems: MenuItem[] = [
    {
      id: 'terms',
      title: 'Terms of Service',
      screen: 'TermsOfService',
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      screen: 'PrivacyPolicy',
    },
    {
      id: 'refund',
      title: 'Refund & Return Policy',
      screen: 'RefundPolicy',
    },
    {
      id: 'licenses',
      title: 'Licenses & Credits',
      screen: 'LicensesCredits',
    },
    {
      id: 'contact',
      title: 'Contact Us',
      screen: 'ContactUs',
    },
  ];

  const appVersion = 'v1.0.0';

  const handleMenuPress = (item: MenuItem) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.url) {
      console.log('Opening URL:', item.url);
    }
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item)}
      activeOpacity={0.6}
    >
      <Text style={styles.menuItemText}>{item.title}</Text>
      <Icon name="keyboard-arrow-right" size={24} color="#94969F" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#282C3F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionLabel}>App Version:</Text>
          <Text style={styles.versionText}>{appVersion}</Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#282C3F',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
  },

  // Menu Items
  menuContainer: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#282C3F',
  },

  // App Version
  versionContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  versionLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#282C3F',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94969F',
  },

  // Bottom Spacing
  bottomSpacing: {
    height: 40,
  },
});