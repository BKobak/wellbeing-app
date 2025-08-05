import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { testChatbot } from '../tests/chatbot.test';
import { testHome } from '../tests/home.test';
import { Button } from 'react-native-web';
import DebugReportTestScreen from './DebugReport';

export default function DebugTestsScreen() {
  const results = [
    ...testChatbot(),
    ...testHome(),
  ];


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>🧪 Manual Debug Test Results</Text>
      {results.map((r, idx) => (
        <View key={idx} style={[styles.resultBox, r.pass ? styles.pass : styles.fail]}>
          <Text style={styles.testName}>{r.name}</Text>
          <Text>{r.pass ? '✅ Passed' : `❌ Failed: ${r.error}`}</Text>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  resultBox: { padding: 10, marginBottom: 8, borderRadius: 6 },
  testName: { fontWeight: '600' },
  pass: { backgroundColor: '#d4edda' },
  fail: { backgroundColor: '#f8d7da' },
});
