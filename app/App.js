import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './pages/navigationRef'; // Import the navigate function

// Screens
import HomeScreen from './pages/home';
import LogIn from './pages/login';
import ForgotPasswordScreen from './pages/password';
import NewProfile from './pages/new_profile';
import ChatbotScreen from './pages/chat';
import Report from './pages/report';


// Create a stack navigator
const Stack = createStackNavigator();

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  // Request permissions
  useEffect(() => {
    const getNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission for notifications not granted!');
      }
    };
    getNotificationPermission();
  }, []);

  // Schedule notification
  useEffect(() => {
    const scheduleNotification = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync(); // optional: prevent duplicates
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Check-in",
          body: "Did you experience any migraine/headache today?",
          data: { type: 'headache-check' },
        },
        trigger: {
          hour: 15, // trigger notification at 3:30PM
          minute: 30,
          repeats: true,
        },
      });
    };
    scheduleNotification();
  }, []);

  // Handle notification response
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;
  
      if (data.type === 'headache-check') {
        // Save log (same as before)
        const logEntry = {
          type: 'Headache Check',
          response: 'User tapped the notification.',
          timestamp: new Date().toISOString(),
        };
  
        AsyncStorage.getItem('logs').then((logs) => {
          const updatedLogs = logs ? JSON.parse(logs) : [];
          updatedLogs.push(logEntry);
          AsyncStorage.setItem('logs', JSON.stringify(updatedLogs));
        });
  
        // 👉 Navigate to Home
        navigate('Login'); // Use the navigate function from navigationRef
      }
    });
  
    return () => subscription.remove();
  }, []);
  
  // Main app navigation
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
}
