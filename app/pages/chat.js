import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! What can I help you with?", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    const newMessage = { id: messages.length + 1, text: inputText, sender: "user" };
    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { id: prevMessages.length + 1, text: "I'm still learning!", sender: "bot" }]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Chatbot</Text>
        <Icon name="robot" size={24} color="#fff" />
      </View>

      {/* Chat Area */}
      <ScrollView style={styles.chatContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#AFAFAF"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Icon name="paper-plane" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAC0FF',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#5A189A',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#C195FF',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd'
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#AFAFAF',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#000',
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#5A189A',
    padding: 10,
    borderRadius: 20,
  },
});

export default ChatbotScreen;
