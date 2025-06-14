import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Pressable,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLogin = () => {
    if (username === 'Admin' && password === 'Admin') {
      navigation.navigate('Home');
    } else {
      alert('Invalid username or password');
    }
  };
  const animateLoginPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(handleLogin);
  };


  return (
      <View style={styles.container}>
      
      <Image 
        source={require('../assets/logo.png')} 
        style={{ width: 230, height: 230, marginTop: -30, tintColor: '#5A189A', resizeMode: 'contain', marginBottom: 20, position: 'absolute', top: 80, opacity: 0.8 }}
      />

      <Text style={styles.header}>Relief Nest</Text>

      <View style={styles.inputView}>
        <Ionicons name="person-outline" size={24} color="#024802" style={styles.icon} />
        <TextInput
          style={styles.TextInput}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputView}>
        <Ionicons name="lock-closed-outline" size={24} color="#024802" style={styles.icon} />
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable style={styles.loginBtn} onPress={animateLoginPress}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
      </Animated.View>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('CreateProfile')}>
        <Text style={styles.secondaryText}>Create New Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 42,
    marginTop: 130,
    marginBottom: 40,
    color: '#024802',
    fontWeight: '900',
    textShadowColor: '#DAC0FF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 2 },
    shadowRadius: 1,
    fontStyle: 'italic',
    fontFamily: ''

  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DAC0FF',
    borderRadius: 30,
    width: '85%',
    height: 55,
    marginBottom: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  icon: {
    marginRight: 10,
  },
  TextInput: {
    flex: 1,
    fontSize: 18,
    color: '#024802',
    fontWeight: '600',
    paddingVertical: 10,
  },
  forgot_button: {
    fontSize: 16,
    color: '#024802',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 25,
  },
  loginBtn: {
    width: 230,
    backgroundColor: '#C195FF',
    borderRadius: 30,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    width: 230,
    borderRadius: 30,
    height: 55,
    borderColor: '#C195FF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryText: {
    color: '#C195FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
