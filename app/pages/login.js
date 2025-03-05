import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Placeholder states
  const [usernamePlaceholder, setUsernamePlaceholder] = useState('Username');
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('Password');

  const navigation = useNavigation();

  const handleLogin = () => {
    if (username === 'Admin' && password === 'Admin') {
      navigation.navigate('Home');
    } else {
      alert('Invalid username or password');
    }
  };

  const forgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const createProfile = () => {
    navigation.navigate('CreateProfile');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>WELCOME</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder={usernamePlaceholder}
          placeholderTextColor="#003f5c"
          onChangeText={setUsername}
          onFocus={() => setUsernamePlaceholder('')}
          onBlur={() => username === '' && setUsernamePlaceholder('Username')}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder={passwordPlaceholder}
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={setPassword}
          onFocus={() => setPasswordPlaceholder('')}
          onBlur={() => password === '' && setPasswordPlaceholder('Password')}
        />
      </View>

      <TouchableOpacity onPress={forgotPassword}>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={createProfile}>
        <Text style={styles.loginText}>CREATE NEW PROFILE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#024802',
  },
  inputView: {
    backgroundColor: '#DAC0FF',
    borderRadius: 30,
    width: '70%',
    height: 60,
    marginBottom: 20,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  header: {
    fontSize: 50,
    marginBottom: 40,
    color: '#024802',
    fontWeight: 'bold',
    textShadowColor: '#171717',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
    fontSize: 18,
    color: '#024802',
    fontWeight: 'bold',
  },
  loginBtn: {
    width: '45%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#C195FF',
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
