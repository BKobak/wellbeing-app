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
import { getChatResponse } from "./chatbotAPI";

const faqData = [
  {
    question: "➜ What are the symptoms of migraine?",
    answer: "Fetching answer...",
    fetchAnswer: async () => {
      const response = await getChatResponse("What are the symptoms of migraine? (short answer)");
      return response || "Unable to fetch answer.";
    },
  },
  {
    question: "➜ What are the common triggers for migraine?",
    answer: "Fetching answer...",
    fetchAnswer: async () => {
      const response = await getChatResponse("What are the common triggers for migraine? (short answer)");
      return response || "Unable to fetch answer.";
    },
  },
  {
    question: "➜ What is the difference between migraine and headache?",
    answer: "Fetching answer...",
    fetchAnswer: async () => {
      const response = await getChatResponse("What is the difference between migraine and headache? (short answer)");
      return response || "Unable to fetch answer.";
    },
  },
  {
    question: "➜ How to prevent migraine?",
    answer: "Fetching answer...",
    fetchAnswer: async () => {
      const response = await getChatResponse("How to prevent migraine? (short answer)");
      return response || "Unable to fetch answer.";
    },
  },
  {
    question: "➜ Can migraines be cured?",
    answer: "Fetching answer...",
    fetchAnswer: async () => {
      const response = await getChatResponse("Can migraines be cured? (short answer)");
      return response || "Unable to fetch answer.";
    },
  },
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

    const botReply = await getChatResponse(inputText);

    setMessages(prevMessages => [
      ...prevMessages,
      { id: prevMessages.length + 1, text: botReply, sender: "bot" }
    ]);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  const renderFAQButtons = () => {
      return faqData.map((faq, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <TouchableOpacity
            style={styles.faqButton}
            onPress={async () => {
              if (expandedFAQ === faq.question) {
                setExpandedFAQ(null);
              } else {
                const answer = await faq.fetchAnswer();
                faq.answer = answer; // Update the answer dynamically
                setExpandedFAQ(faq.question);
              }
            }}
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
                numberOfLines={3}
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
