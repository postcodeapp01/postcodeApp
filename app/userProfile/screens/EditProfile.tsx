import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance from '../../../config/Api';

type UserProfile = {
  name: string;
  phone: string;
  email: string;
  gender: 'Female' | 'Male';
};

type EditProfileProps = {
  navigation: any;
  route: {
    params: {
      initialProfile: UserProfile;
      onSave: (updated: UserProfile) => void;
    };
  };
};

const EditProfile: React.FC<EditProfileProps> = ({navigation, route}) => {
  const {initialProfile, onSave} = route.params;

  // split initial name
  const [firstName, setFirstName] = useState(() => {
    const parts = initialProfile.name.split(' ');
    return parts[0] || '';
  });
  const [lastName, setLastName] = useState(() => {
    const parts = initialProfile.name.split(' ');
    return parts.slice(1).join(' ') || '';
  });
  const [email, setEmail] = useState(initialProfile.email);
  const [gender, setGender] = useState<UserProfile['gender']>(
    initialProfile.gender,
  );
  const [phone, setPhone] = useState(
    initialProfile.phone.replace(/^\+?\d{0,3}/, ''),
  );

  const handleUpdate = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      Alert.alert('All fields are required');
      return;
    }
    const updated: UserProfile = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      gender,
      phone: `+91 ${phone.trim()}`,
    };
    try {
      const res = await axiosInstance.put('/user/profile', updated);
      console.log('In EditProfile', res.data);
      onSave(res.data);

      navigation.goBack();
    } catch (err) {
      console.error('Profile update error:', err);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Your Profile</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.section}>
          <Text style={styles.label}>First Name*</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            placeholderTextColor="#C7C7CD"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Last Name*</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            placeholderTextColor="#C7C7CD"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email Address*</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#C7C7CD"
          />
        </View>

        <View style={styles.genderSection}>
          <Text style={styles.genderLabel}>Gender</Text>
          <View style={styles.genderOptions}>
            {(['Female', 'Male'] as UserProfile['gender'][]).map(g => (
              <TouchableOpacity
                key={g}
                style={styles.genderOption}
                onPress={() => setGender(g)}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.radioOuter,
                    gender === g && styles.radioOuterSelected,
                  ]}>
                  {gender === g && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.genderText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Phone Number (+91)*</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            placeholderTextColor="#C7C7CD"
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
  marginRight: 8, 
},
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.32,
    color: '#000',
    
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 120, // Extra space for the fixed button
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#A8A8A8',
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
  },
  genderSection: {
    marginBottom: 30,
  },
  genderLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
    fontWeight: '400',
  },
  genderOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 32,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: '#FFD700',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  genderText: {
    fontSize: 16, 
    color: '#000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
   
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  updateButton: {
    backgroundColor: '#FF5E5B',
    paddingVertical: 16,
    
    alignItems: 'center',
  },
  updateText: {
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '600',
  },
});
