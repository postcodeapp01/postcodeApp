import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '../../config/Api';
import { useDispatch } from 'react-redux';
import { logout } from '../../reduxSlices/UserSlice';

type UserProfile = {
  name: string;
  phone: string;
  email: string;
  gender: string;
  avatar?: string | undefined;
};

type MenuItem = {
  id: string;
  title: string;
  icon: string;
  isLogout?: boolean;
};

type MenuSection = {
  id: string;
  title?: string;
  items: MenuItem[];
};

const ProfileScreen = ({navigation}: any) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/user/profile');
      const data = res.data.data;
      console.log(data);
      const mappedProfile: UserProfile = {
        name: data.name ?? 'Guest User', 
        phone: data.phone,
        email: data.email,
        gender: data.gender,
        avatar: data.avatar,
      };
      console.log(mappedProfile);
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
  const menuItems: MenuSection[] = [
    {
      id: 'orders',
      title: 'Orders & Activity',
      items: [
        {id: 'my-orders', title: 'My Orders', icon: 'shopping-bag'},
        {id: 'wishlist', title: 'Wishlist', icon: 'favorite-border'},
      ],
    },
    {
      id: 'offers',
      title: 'Offers & Wallet',
      items: [
        {id: 'coupons', title: 'Coupons & Discounts', icon: 'local-offer'},
        {
          id: 'trendrush-wallet',
          title: 'Trendrush Wallet',
          icon: 'account-balance-wallet',
        },
      ],
    },
    {
      id: 'earn',
      title: 'Earn with Trendrush',
      items: [
        {id: 'sell-trendrush', title: 'Sell on Trendrush', icon: 'store'},
      ],
    },
  ];
  const supportItems: MenuItem[] = [
    {id: 'about-us', title: 'About Us', icon: 'info-outline'},
    {
      id: 'notifications',
      title: 'Notification Settings',
      icon: 'notifications-none',
    },
    {id: 'help', title: 'Help & Support', icon: 'help-outline'},
    {id: 'logout', title: 'Logout', icon: 'logout', isLogout: true},
  ];

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => (n ? n[0] : ''))
      .join('')
      .toUpperCase();
  };

  const handleMenuPress = (itemId: string) => {
    switch (itemId) {
      case 'my-orders':
        navigation.navigate('MyOrdersScreen');
        break;
      case 'wishlist':
        navigation.navigate('WishlistScreen');
        break;
      case 'coupons':
        navigation.navigate('Coupons');
        break;
      case 'trendrush-wallet':
        navigation.navigate('Wallet');
        break;
      case 'sell-trendrush':
        navigation.navigate('SellerOnboarding');
        break;
      case 'about-us':
        navigation.navigate('AboutScreen');
        break;
      case 'notifications':
        navigation.navigate('NotificationSettings');
        break;
      case 'help':
        navigation.navigate('HelpSupport');
        break;
      case 'logout':
        handleLogout();
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

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#282C3F" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Profile</Text>

      <TouchableOpacity style={styles.moreButton}>
        <Icon name="more-vert" size={24} color="#282C3F" />
      </TouchableOpacity>
    </View>
  );

  const renderUserInfo = () => (
    <View style={styles.userSection}>
      <View style={styles.avatarContainer}>
        {userProfile?.avatar ? (
          <Image source={{uri: userProfile.avatar}} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {getUserInitials(userProfile?.name)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={styles.userName}>{userProfile?.name}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('EditProfile', {
                initialProfile: userProfile,
                onSave: (updated: UserProfile) => {
                  // handle save here (update state, call API, etc.)
                  setUserProfile(updated); // if you keep userProfile in parent state
                },
              })
            }>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.userPhone}>{userProfile?.phone}</Text>
        <Text style={styles.userEmail}>{userProfile?.email}</Text>
      </View>
    </View>
  );

  const renderDeliveryAddress = () => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigation.navigate('AddressScreen')}>
      <MaterialCommunityIcons
        name="truck-outline"
        size={18}
        color="#AAAAAA"
        style={styles.menuIcon}
      />
      <Text style={styles.menuText}>Delivery Addresses</Text>
      <Icon name="keyboard-arrow-right" size={24} color="#94969F" />
    </TouchableOpacity>
  );
  const renderMenuSection = (section: MenuSection) => (
    <View key={section.id} style={styles.menuSection}>
      {section.title ? (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      ) : null}
      {section.items.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuItem, item.isLogout && styles.logoutItem]}
          onPress={() => handleMenuPress(item.id)}>
          <Icon
            name={item.icon}
            size={16}
            color={item.isLogout ? '#FF3366' : '#AAAAAA'}
            style={styles.menuIcon}
          />
          <Text style={[styles.menuText, item.isLogout && styles.logoutText]}>
            {item.title}
          </Text>
          <Icon name="keyboard-arrow-right" size={24} color="#94969F" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSupportSection = () => (
    <View style={styles.supportContainer}>
      {supportItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuItem, item.isLogout && styles.logoutItem]}
          onPress={() => handleMenuPress(item.id)}>
          {/* <Icon
            name={item.icon}
            size={18}
            color={item.isLogout ? '#FF3366' : '#AAAAAA'}
            style={styles.menuIcon}
          /> */}
          <Text style={[styles.menuText2, item.isLogout && styles.logoutText]}>
            {item.title}
          </Text>
          <Icon name="keyboard-arrow-right" size={24} color="#94969F" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderProfileHeader()}

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderUserInfo()}
          {renderDeliveryAddress()}
          {menuItems.map(renderMenuSection)}
          <View style={styles.sectionWrapper2}>{renderSupportSection()}</View>
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 2,
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
    marginLeft: 8,
  },
  moreButton: {
    padding: 8,
    marginRight: -8,
  },

  content: {
    flex: 1,
  },

  // User Section
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F1F1F1',
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF5964',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5964',
    // lineHeight: 20,
  },
  userPhone: {
    fontSize: 12,
    color: '#000',
    marginTop: 5,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  userEmail: {
    fontSize: 12,
    color: '#000',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  // Menu Items
  sectionWrapper2: {
    marginTop: -14,
    // backgroundColor: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#fff',
    height: 48,
  },
  menuIcon: {
    marginRight: 5,
    width: 22,
    textAlign: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF3366',
    fontWeight: '500',
    fontSize: 16,
  },

  // Recently Viewed
  recentSection: {
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  recentScroll: {
    paddingHorizontal: 16,
  },
  recentItem: {
    marginRight: 12,
    width: 100,
  },
  recentImageContainer: {
    width: 100,
    height: 120,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  recentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recentPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282C3F',
    textAlign: 'center',
  },
  recentOriginalPrice: {
    fontSize: 12,
    color: '#94969F',
    textDecorationLine: 'line-through',
    textAlign: 'center',
    marginTop: 2,
  },
  menuSection: {
    marginBottom: 8,
  },
  supportContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
  },
  menuText2: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bottomSpacing: {
    height: 30,
  },
});
