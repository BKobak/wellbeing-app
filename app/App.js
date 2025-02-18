import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { use } from 'react';
import { TextInput } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>WELCOME</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="username"
          placeholderTextColor="#003f5c"
          onChangeText={(username) => setUsername(username)}
        /> 
      </View> 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        /> 
      </View>

    </View>
    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  inputView: {
    backgroundColor: '#FFC0CB',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 50,
    marginBottom: 40,
    color: 'black',
  },
});
