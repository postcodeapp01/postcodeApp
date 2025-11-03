// components/profile/UserProfileCard.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar?: string;
}

interface Props {
  userProfile: UserProfile;
  onEdit: () => void;
}

const UserProfileCard: React.FC<Props> = ({userProfile, onEdit}) => {
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => (n ? n[0] : ''))
      .join('')
      .toUpperCase();
  };

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {userProfile?.avatar ? (
          <Image source={{uri: userProfile.avatar}} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {getUserInitials(userProfile?.name || 'User')}
            </Text>
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.userDetails}>{userProfile.email}</Text>
        <Text style={styles.userDetails}>{userProfile.phone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 10,
    height:80,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    lineHeight:20,
    letterSpacing:0.1,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#222',
    lineHeight:20,
    letterSpacing:0.1,
  },
  editText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    lineHeight:20,
    letterSpacing:0.1,
  },
  userDetails: {
    fontSize: 12,
    fontWeight: '400',
    color: '#222222',
    marginBottom: 2,
    letterSpacing:0.1,
  },
});

export default UserProfileCard;
