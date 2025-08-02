import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

export default function NewProfile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Function to handle profile creation
  const handleCreateProfile = () => {
    if (username && email && password) {
      alert('Profile created successfully!');
      navigation.navigate('LogIn');
    } else {
      alert('Please fill in all fields.');
    }
  };

  // Function to animate button press
  const animateCreatePress = () => {
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
    ]).start(() => handleCreateProfile());
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.header}>Create New Profile</Text>

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
        <Ionicons name="mail-outline" size={24} color="#024802" style={styles.icon} />
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          keyboardType="email-address"
          onChangeText={setEmail}
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
        <Pressable style={styles.createBtn} onPress={animateCreatePress}>
          <Text style={styles.createText}>Create Profile</Text>
        </Pressable>
      </Animated.View>
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
    paddingBottom: 60,
  },
  header: {
    fontSize: 36,
    marginBottom: 30,
    color: '#024802',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#DAC0FF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1.5,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DAC0FF',
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
  TextInput: {
    flex: 1,
    fontSize: 18,
    color: '#024802',
    fontWeight: '600',
  },
  createBtn: {
    width: 250,
    backgroundColor: '#C195FF',
    borderRadius: 30,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  createText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
