import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { PermissionsAndroid, Alert, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ReportScreen = () => {
  const [monthlyReport, setMonthlyReport] = useState({});
  const [aiInsights, setAiInsights] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem('logs');
        const logs = storedLogs ? JSON.parse(storedLogs) : [];
        generateMonthlyReport(logs);
      } catch (error) {
        console.error('Error loading logs:', error);
      }
    };

    fetchLogs();
  }, []);

  const generateMonthlyReport = (logs) => {
    if (!Array.isArray(logs)) {
      console.warn("Logs is not an array:", logs);
      return;
    }
  
    const report = {};
  
    logs.forEach((log, index) => {
      if (!log || typeof log !== 'object' || !log.timestamp || !log.type) {
        console.warn(`Skipping invalid log at index ${index}:`, log);
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
  
    setMonthlyReport(report);
    generateAIInsights(report);
  };
  

  const generateAIInsights = (summary) => {
    let allSymptoms = {};
    let allEpisodes = [];

    Object.entries(summary).forEach(([month, data]) => {
      allEpisodes.push(...data.episodeDates);

      Object.entries(data.symptomFrequency).forEach(([symptom, count]) => {
        if (!allSymptoms[symptom]) {
          allSymptoms[symptom] = 0;
        }
        allSymptoms[symptom] += count;
      });
    });

    // Predict Future Symptoms
    const mostCommonSymptoms = Object.entries(allSymptoms)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([symptom]) => symptom);

    // Predict Next Headache/Migraine
    let predictedNextEpisode = 'Insufficient data for prediction';
    if (allEpisodes.length > 1) {
      allEpisodes.sort((a, b) => a - b);
      let intervals = [];

      for (let i = 1; i < allEpisodes.length; i++) {
        intervals.push(allEpisodes[i] - allEpisodes[i - 1]);
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const nextEpisodeDate = new Date(allEpisodes[allEpisodes.length - 1] + avgInterval);
      predictedNextEpisode = nextEpisodeDate.toDateString();
    }

    setAiInsights({
      predictedSymptoms: mostCommonSymptoms,
      nextEpisode: predictedNextEpisode,
    });
  };

  // Function to generate and download/share/print PDF report
  const generatePDF = async () => {
    const htmlContent = `
      <h1 style="text-align:center;">Relief Nest Monthly Report</h1><br>
    ${Object.entries(monthlyReport).map(([month, data]) => `
      <h2>${month}</h2>
      <p>Headaches: ${data.headacheCount}</p>
      <p>Migraines: ${data.migraineCount}</p>
      <p>Symptoms:</p>
      <ul>
        ${Object.entries(data.symptomFrequency).map(([symptom, count]) => `<li>${symptom}: ${count} times</li>`).join('')}
      </ul>
    `).join('')}
    
    <h2>AI Insights</h2>
    <p>Next expected episode: ${aiInsights?.nextEpisode || 'N/A'}</p>
    <p>Likely symptoms: ${aiInsights?.predictedSymptoms?.join(', ') || 'N/A'}</p>
    <p style="font-size:10px; text-align:center; font-style:italic;">This is not a medical diagnosis and should not be treated as such.</p>
  `;
  
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
  
      if (!(await Sharing.isAvailableAsync())) {
        alert('Sharing is not available on your device');
        return;
      }
  
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to create or share PDF");
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Monthly Report</Text>
      {Object.keys(monthlyReport).length > 0 ? (
        Object.entries(monthlyReport).map(([month, data]) => (
          <View key={month} style={styles.reportCard}>
            <Text style={styles.monthTitle}>{month}</Text>
            <Text>📝 Headaches: {data.headacheCount}</Text>
            <Text>📝 Migraines: {data.migraineCount}</Text>
            <Text>⚠️ Symptoms:</Text>
            {Object.entries(data.symptomFrequency).map(([symptom, count]) => (
              <Text key={symptom} style={styles.symptomText}>
                - {symptom}: {count} times
              </Text>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No logs available for reporting.</Text>
      )}

      {aiInsights && (
        <View style={styles.aiInsights}>
          <Text style={styles.insightTitle}>🔮 AI Insights</Text>
          <Text>📅 Next expected episode: {aiInsights.nextEpisode}</Text>
          <Text>⚠️ Likely symptoms: {aiInsights.predictedSymptoms.join(', ') || 'No prediction available'}</Text>
          <Text>📊 Migraines and headaches occured: </Text>


          <Text style={{ fontSize: 10, marginTop: 15, textAlign:'center', fontStyle: 'italic'}}> This is not a medical diagnosis and should not be treated as such.</Text>

        </View>
      )}

      <TouchableOpacity style={styles.downloadBtn} onPress={generatePDF}>
        <Text style={styles.downloadText}>📥 Download PDF Report</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#DAC0FF' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  reportCard: { backgroundColor: '#EDE7FF', padding: 15, borderRadius: 10, marginBottom: 10 },
  monthTitle: { fontSize: 22, fontWeight: 'bold', color: '#5A189A' },
  symptomText: { fontSize: 16, marginLeft: 10 },
  noDataText: { textAlign: 'center', color: '#555', marginTop: 20 },
  aiInsights: { backgroundColor: '#FFF3CD', padding: 15, borderRadius: 10, marginTop: 20 },
  insightTitle: { fontSize: 22, fontWeight: 'bold', color: '#856404', marginBottom: 5 },
  downloadBtn: { backgroundColor: '#5A189A', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  downloadText: { color: '#fff', fontSize: 16, fontWeight: 'bold'},
  
});

export default ReportScreen;
