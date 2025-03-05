import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './pages/home';
import LogIn from './pages/login';
import ForgotPasswordScreen from './pages/password';
import NewProfile from './pages/new_profile';
import ChatbotScreen from './pages/chat';
import Report from './pages/report';

const Stack = createStackNavigator();

export default function App() {
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