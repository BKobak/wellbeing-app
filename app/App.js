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
  useEffect(() => {
    // Request notification permissions
    const getNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('Permission Status:', status);
      if (status !== 'granted') {
        alert('Permission for notifications not granted!');
      }
    };

    getNotificationPermission();
  }, []);

  useEffect(() => {
    // Schedule a notification to test
    const scheduleNotification = async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Check-In',
          body: 'Did you experience any migraine today?',
        },
        trigger: {
          seconds: 5, // Send the notification in 5 seconds for quick testing
        },
      });
    };

    scheduleNotification();
  }, []);

  useEffect(() => {
    // Handle notification received in the foreground
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // Handle notification response
    const handleNotificationResponse = (response) => {
      const { data } = response;
      if (data.type === 'headache-check') {
        // Log the user's response here
        const logEntry = {
          type: 'Headache Check',
          response: 'User checked in for headache/migraine.',
          timestamp: new Date().toISOString(),
        };
        AsyncStorage.getItem('logs').then((logs) => {
          const updatedLogs = logs ? JSON.parse(logs) : [];
          updatedLogs.push(logEntry);
          AsyncStorage.setItem('logs', JSON.stringify(updatedLogs));
        });
      }
    };

    // Add listener for notification response (background)
    const responseListener = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    // Cleanup listeners on component unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []); // Only run once when the app starts

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
