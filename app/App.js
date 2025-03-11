import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications'; // Import Notifications
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import HomeScreen from './pages/home';
import LogIn from './pages/login';
import ForgotPasswordScreen from './pages/password';
import NewProfile from './pages/new_profile';
import ChatbotScreen from './pages/chat';
import Report from './pages/report';

const Stack = createStackNavigator();

export default function App() {
  /*
  useEffect(() => {
    const getNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log("Permission Status:", status);
      if (status !== 'granted') {
        alert('Permission for notifications not granted!');
      }
    };
  
    getNotificationPermission();
  }, []); // Only run once on app load

  useEffect(() => {
    // Schedule daily notification to ask about headache/migraine
    const scheduleNotification = async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Check-in",
          body: "Did you experience any migraine/headache today?", // Custom message
          data: { type: 'headache-check' }, // Custom data to track response type
        },
        trigger: {
          seconds: 10, // Send notification after 10 seconds for quick testing
          repeats: true, // Repeat daily (for testing, adjust time as needed)
        },
      });
    };

    scheduleNotification();
  }, []); // Only run once on app load

  useEffect(() => {
    // Handle notification response (when user taps on the notification)
    const handleNotificationResponse = (response) => {
      const { data } = response;
      if (data.type === 'headache-check') {
        // Log the user's response here
        const logEntry = {
          type: 'Headache Check',
          response: 'User checked in for headache/migraine.', // This could be modified based on user input if available
          timestamp: new Date().toISOString(),
        };

        AsyncStorage.getItem('logs').then((logs) => {
          const updatedLogs = logs ? JSON.parse(logs) : [];
          updatedLogs.push(logEntry);
          AsyncStorage.setItem('logs', JSON.stringify(updatedLogs));
        });
      }
    };

    // Add the listener for notification response
    Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    // Cleanup the listener on component unmount
    return () => {
      Notifications.removeNotificationResponseReceivedListener(handleNotificationResponse);
    };
  }, []); // Only run once when the app starts
  */

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LogIn} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="CreateProfile" component={NewProfile} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="Reports" component={Report} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
