import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface SigninSignupProps {
  onPress: () => void;
}

const SigninSignup: React.FC<SigninSignupProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      {/* User Icon */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="account" size={65} color="#999" />
      </View>

      {/* Signin/Signup Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Signin/Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 20,
    marginHorizontal: 16,
    marginVertical: 10,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    flex: 1,
    backgroundColor: '#FF5964',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height:50,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
});

export default SigninSignup;
