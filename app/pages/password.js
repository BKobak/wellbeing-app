import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

const ForgotPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Function to handle password reset
  const handleResetPassword = () => {
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      alert('Password reset successful!');
      navigation.navigate('Login');
    } else {
      alert('Passwords do not match or are too short!');
    }
  };

  // Function to animate button press
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => handleResetPassword());
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.header}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter a new password for your account</Text>

      <View style={styles.inputView}>
        <Ionicons name="lock-closed-outline" size={24} color="#024802" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#003f5c"
          secureTextEntry
          onChangeText={setNewPassword}
        />
      </View>

      <View style={styles.inputView}>
        <Ionicons name="lock-closed-outline" size={24} color="#024802" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#003f5c"
          secureTextEntry
          onChangeText={setConfirmPassword}
        />
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable style={styles.button} onPress={animatePress}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAC0FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#024802',
    marginBottom: 10,
    textShadowColor: '#BBAFFF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
    width: '80%',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '85%',
    height: 55,
    marginBottom: 25,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#024802',
    fontWeight: '600',
  },
  button: {
    width: 200,
    backgroundColor: '#C195FF',
    borderRadius: 30,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
