import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordPlaceholder, setNewPasswordPlaceholder] = useState('New Password');
  const [confirmPasswordPlaceholder, setConfirmPasswordPlaceholder] = useState('Confirm Password');

  const navigation = useNavigation();

  const handleResetPassword = () => {
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      alert('Password reset successful!');
      navigation.navigate('Login');
    } else {
      alert('Passwords do not match or are too short!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter a new password for your account</Text>
      
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder={newPasswordPlaceholder}
          placeholderTextColor="#003f5c"
          secureTextEntry
          onChangeText={setNewPassword}
          onFocus={() => setNewPasswordPlaceholder('')}
          onBlur={() => newPassword === '' && setNewPasswordPlaceholder('New Password')}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder={confirmPasswordPlaceholder}
          placeholderTextColor="#003f5c"
          secureTextEntry
          onChangeText={setConfirmPassword}
          onFocus={() => setConfirmPasswordPlaceholder('')}
          onBlur={() => confirmPassword === '' && setConfirmPasswordPlaceholder('Confirm Password')}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#DAC0FF',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#024802',
    marginBottom: 10,
    textShadowColor: '#171717',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputView: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: '80%',
    height: 50,
    marginBottom: 15,
    justifyContent: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: '#024802',
  },
  button: {
    backgroundColor: '#C195FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '50%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
