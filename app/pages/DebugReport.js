import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';

const DebugReportTestScreen = () => {
  const [reportOutput, setReportOutput] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const mockLogs = [
    {
      timestamp: '2025-08-01T10:00:00Z',
      type: 'Migraine',
      symptoms: ['nausea', 'dizziness'],
    },
    {
      timestamp: '2025-08-03T12:00:00Z',
      type: 'Headache',
      symptoms: ['light sensitivity'],
    },
  ];

  const runTest = () => {
    const results = [];
    const report = {};

    try {
      mockLogs.forEach((log, index) => {
        if (!log || typeof log !== 'object' || !log.timestamp || !log.type) {
          return;
        }

        const date = new Date(log.timestamp);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

        if (!report[monthYear]) {
          report[monthYear] = {
            headacheCount: 0,
            migraineCount: 0,
            symptomFrequency: {},
            episodeDates: [],
          };
        }

        if (log.type === 'Headache') {
          report[monthYear].headacheCount++;
        } else if (log.type === 'Migraine') {
          report[monthYear].migraineCount++;
        }

        const symptoms = Array.isArray(log.symptoms) ? log.symptoms : [];
        symptoms.forEach((symptom) => {
          if (!report[monthYear].symptomFrequency[symptom]) {
            report[monthYear].symptomFrequency[symptom] = 0;
          }
          report[monthYear].symptomFrequency[symptom]++;
        });

        report[monthYear].episodeDates.push(date.getTime());
      });

      // Store the report for display
      setReportOutput(report);

      // Add test cases
      const monthKeys = Object.keys(report);
      results.push({
        name: 'Report has month entry',
        pass: monthKeys.length > 0,
        error: monthKeys.length > 0 ? null : 'No month entries found',
      });

      const data = report[monthKeys[0]];
      results.push({
        name: 'Includes migraine count',
        pass: data.migraineCount === 1,
        error: data.migraineCount !== 1 ? `Expected 1, got ${data.migraineCount}` : null,
      });

      results.push({
        name: 'Includes headache count',
        pass: data.headacheCount === 1,
        error: data.headacheCount !== 1 ? `Expected 1, got ${data.headacheCount}` : null,
      });

      results.push({
        name: 'Includes symptom "nausea"',
        pass: data.symptomFrequency.nausea === 1,
        error: !data.symptomFrequency.nausea ? 'Missing symptom: nausea' : null,
      });

      results.push({
        name: 'Includes symptom "dizziness"',
        pass: data.symptomFrequency.dizziness === 1,
        error: !data.symptomFrequency.dizziness ? 'Missing symptom: dizziness' : null,
      });

      results.push({
        name: 'Includes symptom "light sensitivity"',
        pass: data.symptomFrequency['light sensitivity'] === 1,
        error: !data.symptomFrequency['light sensitivity'] ? 'Missing symptom: light sensitivity' : null,
      });

    } catch (error) {
      results.push({
        name: 'Report generation failed',
        pass: false,
        error: error.message,
      });
    }

    setTestResults(results);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🧪 Debug Report Test</Text>

      <Button title="Run Report Generation Test" onPress={runTest} />

      {testResults.length > 0 && (
        <View style={styles.resultsBox}>
          <Text style={styles.subHeader}>Test Results:</Text>
          {testResults.map((result, index) => (
            <Text
              key={index}
              style={{
                color: result.pass ? 'green' : 'red',
                marginBottom: 5,
              }}
            >
              {result.pass ? '✅' : '❌'} {result.name}
              {result.error ? ` — ${result.error}` : ''}
            </Text>
          ))}
        </View>
      )}

      {reportOutput && (
        <View style={styles.outputBox}>
          <Text style={styles.subHeader}>Generated Report:</Text>
          {Object.entries(reportOutput).map(([month, data]) => (
            <View key={month} style={styles.reportCard}>
              <Text style={styles.month}>{month}</Text>
              <Text>📝 Headaches: {data.headacheCount}</Text>
              <Text>📝 Migraines: {data.migraineCount}</Text>
              <Text>⚠️ Symptoms:</Text>
              {Object.entries(data.symptomFrequency).map(([symptom, count]) => (
                <Text key={symptom}>- {symptom}: {count}</Text>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F0F0FF' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  outputBox: { marginTop: 10 },
  resultsBox: { marginTop: 20 },
  reportCard: {
    backgroundColor: '#EDE7FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  month: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
});

export default DebugReportTestScreen;
