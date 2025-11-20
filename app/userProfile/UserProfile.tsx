
import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {logout} from '../../reduxSlices/UserSlice';
import axiosInstance from '../../config/Api';

// Components
import ProfileHeader from './components/Profile/HeaderWithNoIcons';
import UserProfileCard from './components/Profile/UserProfileCard';
import QuickActions from './components/Profile/QuickActions';
import MenuSection, {MenuItem} from './components/Profile/MenuSection';
import SigninSignup from './components/Profile/SigninSignup';

type UserProfile = {
  name: string;
  phone: string;
  email: string;
  gender: string;
  avatar?: string;
};

const ProfileScreen = ({navigation}: any) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/user/profile');
      const data = res.data.data;
      const mappedProfile: UserProfile = {
        name: data.name ?? 'Guest User',
        phone: data.phone,
        email: data.email,
        gender: data.gender,
        avatar: data.avatar,
      };
      setUserProfile(mappedProfile);
    } catch (err) {
      console.error('Profile fetch error:', err);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleMenuPress = (itemId: string) => {
    switch (itemId) {
      case 'my-orders':
        navigation.navigate('MyOrdersScreen');
        break;
      case 'wishlist':
        navigation.navigate('WishlistScreen');
        break;
      case 'address':
        navigation.navigate('AddressScreen');
        break;
      case 'my-stores':
        navigation.navigate('MyStores');
        break;
      case 'payment-methods':
        navigation.navigate('SavedPaymentMethods');
        break;
      case 'coupons':
        navigation.navigate('Coupons');
        break;
      case 'notifications':
        navigation.navigate('Notifications');
        break;
      case 'help':
        navigation.navigate('HelpAndSupport');
        break;
      case 'terms':
        navigation.navigate('TermsAndPolicies');
        break;
      case 'about':
        navigation.navigate('AboutTrendRush');
        break;
      default:
        console.log('Menu item pressed:', itemId);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
            dispatch(logout());
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  // Menu Data
 const accountMenuItems: MenuItem[] = [
  {
    id: 'my-stores',
    title: 'My Stores',
    icon: 'storefront-outline',
    iconType: 'ionicons',
    onPress: () => handleMenuPress('my-stores'),
  },
  {
    id: 'payment-methods',
    title: 'Saved Payment Methods',
    icon: 'card-outline',
    iconType: 'ionicons',
    onPress: () => handleMenuPress('payment-methods'),
  },
  {
    id: 'coupons',
    title: 'Coupons & Rewards',
    icon: 'pricetag-outline',
    iconType: 'ionicons',
    onPress: () => handleMenuPress('coupons'),
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'notifications-outline',
    iconType: 'ionicons',
    onPress: () => handleMenuPress('notifications'),
  },
];

// Support & Info Section - with icons
const supportMenuItems: MenuItem[] = [
  {
    id: 'help',
    title: 'Help & Support',
    icon: 'call-outline',
    iconType: 'ionicons',
    onPress: () => handleMenuPress('help'),
  },
  {
    id: 'terms',
    title: 'Terms & Policies',
    icon: 'document-text-outline',
    iconType: 'ionicons',
    onPress: () => handleMenuPress('terms'),
  },
  {
    id: 'about',
    title: 'About TrendRush',
    icon: 'information-circle-outline',
    iconType: 'ionicons',
    onPress: () => handleMenuPress('about'),
  },
];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileHeader title="Profile" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader title="Profile" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        {userProfile? (
          <>
          <UserProfileCard
            userProfile={userProfile}
            onEdit={() =>
              navigation.navigate('EditProfile', {
                initialProfile: userProfile,
                onSave: (updated: UserProfile) => setUserProfile(updated),
              })
            }
          />
          {/* Quick Actions */}
        <QuickActions
          onMyOrdersPress={() => handleMenuPress('my-orders')}
          onWishlistPress={() => handleMenuPress('wishlist')}
          onAddressPress={() => handleMenuPress('address')}
        />
          </>
        ):(
          <SigninSignup onPress={() => navigation.navigate('Login')} />
        )}

        

        {/* My Account Section */}
        <MenuSection title="My Account Section" items={accountMenuItems} />

        {/* Support & Info Section */}
        <MenuSection title="Support & Info" items={supportMenuItems} />

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    // height:40,
    backgroundColor: '#FF5964',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 20,
    letterSpacing:0.1,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ProfileScreen;
