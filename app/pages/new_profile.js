import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NewProfile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Placeholder states
  const [usernamePlaceholder, setUsernamePlaceholder] = useState('Username');
  const [emailPlaceholder, setEmailPlaceholder] = useState('Email');
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('Password');

  const navigation = useNavigation();

  const handleCreateProfile = () => {
    if (username && email && password) {
      alert('Profile created successfully!');
      navigation.navigate('LogIn');
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Profile</Text>

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
          placeholder={emailPlaceholder}
          placeholderTextColor="#003f5c"
          keyboardType="email-address"
          onChangeText={setEmail}
          onFocus={() => setEmailPlaceholder('')}
          onBlur={() => email === '' && setEmailPlaceholder('Email')}
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

      <TouchableOpacity style={styles.createBtn} onPress={handleCreateProfile}>
        <Text style={styles.createText}>Create Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 30,
    marginBottom: 30,
    color: '#024802',
    fontWeight: 'bold',
  },
  inputView: {
    backgroundColor: '#DAC0FF',
    borderRadius: 30,
    width: '80%',
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  TextInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#024802',
  },
  createBtn: {
    width: '50%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C195FF',
    marginTop: 20,
  },
  createText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
