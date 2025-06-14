import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ViewMoreText from 'react-native-view-more-text';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getGPTResponse } from "./chatbotAPI";

const chatFAQ = [
  {
    question: "➜ What are the symptoms of migraine?",
    answer: "Common symptoms of migraine include severe headache, nausea, vomiting, sensitivity to light and sound, and sometimes visual disturbances such as aura.",
  },
  {
    question: "➜ What are the common triggers for migraine?",
    answer: "Common triggers for migraines include stress, certain foods (like aged cheese, processed meats, and alcohol), hormonal changes, lack of sleep, and environmental factors such as bright lights or strong smells.",
  },
  {
    question: "➜ What is the difference between migraine and headache?",
    answer: "A migraine is a specific type of headache that is often more severe and can be accompanied by other symptoms like nausea and sensitivity to light. Regular headaches are usually less intense and do not have these additional symptoms.",
  },
  {
    question: "➜ How to prevent migraine?",
    answer: "Preventing migraines may involve lifestyle changes such as regular exercise, maintaining a healthy diet, managing stress, avoiding triggers, and possibly medication prescribed by a healthcare provider.",
  },
  {
    question: "➜ Can migraines be cured?",
    answer: "Currently, there is no cure for migraines, but they can often be managed effectively with lifestyle changes, medications, and other treatments.",
  }
];

const ChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! What can I help you with?", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const scrollViewRef = useRef(null);

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const newMessage = { id: messages.length + 1, text: inputText, sender: "user" };
    setMessages([...messages, newMessage]);
    setInputText('');

    const botReply = await getGPTResponse(inputText);

    setMessages(prevMessages => [
      ...prevMessages,
      { id: prevMessages.length + 1, text: botReply, sender: "bot" }
    ]);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleFAQ = (question) => {
    setExpandedFAQ(prev => prev === question ? null : question);
  };

  const renderFAQButtons = () => {
    return chatFAQ.map((faq, index) => (
      <View key={index} style={{ marginBottom: 10 }}>
        <TouchableOpacity
          style={styles.faqButton}
          onPress={() => handleFAQ(faq.question)}
        >
          <Text style={{ color: '#000', fontSize: 18 }}>{faq.question}</Text>
        </TouchableOpacity>

        {expandedFAQ === faq.question && (
          <View style={styles.faqAnswerContainer}>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        )}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Chatbot</Text>
        <Icon name="comments" size={24} color="#fff" />
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userMessage : styles.botMessage
              ]}
            >
              
              <ViewMoreText
                renderViewMore={onPress => <Text style={{ color: '#5A189A' }} onPress={onPress}>View More</Text>}
                renderViewLess={onPress => <Text style={{ color: '#5A189A' }} onPress={onPress}>View Less</Text>}
              >
                <Text style={styles.messageText}>
                  {message.text}
                  {message.sender === 'bot' && message.id === 1}
                </Text>
              </ViewMoreText>

              {/* Render FAQs below the first bot message */}
              {message.sender === 'bot' && message.id === 1 && (
                <View style={{ marginTop: 10 }}>
                  {renderFAQButtons()}
                </View>
              )}
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
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icon name="paper-plane" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    padding: 25,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 20,
    marginVertical: 6,
    borderRadius: 20,
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
    fontSize: 18,
    color: '#000',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 35,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  input: {
    flex: 1,
    maxHeight: 80,
    fontSize: 18,
    color: '#000',
    paddingRight: 10,
    left: 10,
  },
  sendButton: {
    backgroundColor: '#5A189A',
    padding: 10,
    borderRadius: 20,
  },
  faqButton: {
    backgroundColor: '#C195FF',
    padding: 15,
    borderRadius: 25,
  },
  faqAnswerContainer: {
    marginTop: 8,
    backgroundColor: '#EFEAFF',
    padding: 15,
    borderRadius: 25,
  },
  faqAnswer: {
    fontSize: 18,
    color: '#333',
  }
});

export default ChatbotScreen;
