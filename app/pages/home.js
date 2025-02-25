import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Migraine & Headache Diary</Text>
      <Text style={styles.subtitle}>Track your symptoms, triggers, and relief methods</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LogEntry')}>
        <Text style={styles.buttonText}>Log New Entry</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Settings</Text>
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
  title: {
    fontSize: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#024802',
    textShadowColor: '#171717',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#024802',
    textAlign: 'center',
    marginBottom: 50,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#C195FF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: '70%',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#024802',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
