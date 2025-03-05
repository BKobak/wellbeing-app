import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [entryType, setEntryType] = useState('Headache'); 
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const symptomsList = [
    { id: 'headache', name: 'Headache', icon: 'medkit' },
    { id: 'nausea', name: 'Nausea', icon: 'exclamation-circle' },
    { id: 'dizziness', name: 'Dizziness', icon: 'heartbeat' },
    { id: 'blurred_vision', name: 'Blurred Vision', icon: 'eye' },
    { id: 'light_sensitivity', name: 'Light Sensitivity', icon: 'lightbulb-o' },
    { id: 'sound_sensitivity', name: 'Sound Sensitivity', icon: 'volume-up' },
  ];

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prevSymptoms) =>
      prevSymptoms.includes(id)
        ? prevSymptoms.filter((symptom) => symptom !== id)
        : [...prevSymptoms, id]
    );
  };

  const handleSaveEntry = async () => {
    const newEntry = {
        type: entryType,
        symptoms: selectedSymptoms,
        timestamp: new Date().toISOString(),
    };

    try {
        const existingLogs = await AsyncStorage.getItem('logs');
        const logs = existingLogs ? JSON.parse(existingLogs) : [];

        logs.push(newEntry);

        await AsyncStorage.setItem('logs', JSON.stringify(logs));

        setModalVisible(false);
    } catch (error) {
        console.error("Error saving log:", error);
    }
};

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chatbot')}>
          <Icon name="comments" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
          <Icon name="bar-chart" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Migraine & Headache Diary</Text>
      <Text style={styles.subtitle}>Track your symptoms, triggers, and relief methods</Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Log New Entry</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>

      {/* Pop-up Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log New Episode</Text>

            {/* Type Selection (Headache/Migraine) */}
            <Text style={styles.sectionTitle}>Entry Type:</Text>
            <SegmentedControl
              values={["Headache", "Migraine"]}
              selectedIndex={entryType === "Headache" ? 0 : 1}
              onChange={(event) => setEntryType(event.nativeEvent.value)}
              style={styles.segmentControl}
              tintColor="#C195FF"
            />

            {/* Symptom Selection */}
            <Text style={styles.sectionTitle}>Select Symptoms:</Text>
            <View style={styles.symptomsContainer}>
              {symptomsList.map((symptom) => (
                <TouchableOpacity
                  key={symptom.id}
                  style={[
                    styles.symptomButton,
                    selectedSymptoms.includes(symptom.id) && styles.selectedSymptom,
                  ]}
                  onPress={() => toggleSymptom(symptom.id)}
                >
                  <Icon
                    name={symptom.icon}
                    size={30}
                    color={selectedSymptoms.includes(symptom.id) ? "#fff" : "#024802"}
                  />
                  <Text
                    style={[
                      styles.symptomText,
                      selectedSymptoms.includes(symptom.id) && styles.selectedSymptomText,
                    ]}
                  >
                    {symptom.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSaveEntry}>
              <Text style={styles.buttonText}>Save Entry</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles (Including Navigation Bar)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#DAC0FF',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '120%',
    height: 80,
    backgroundColor: '#5A189A',
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#024802',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#C195FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#024802',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#024802',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#024802',
    marginBottom: 10,
  },
  segmentControl: {
    width: '100%',
    marginBottom: 15,
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  symptomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    backgroundColor: '#DAC0FF',
    margin: 5,
    borderRadius: 15,
    padding: 10,
  },
  selectedSymptom: {
    backgroundColor: '#C195FF',
  },
  symptomText: {
    fontSize: 14,
    color: '#024802',
    marginTop: 5,
    textAlign: 'center',
  },
  selectedSymptomText: {
    color: '#fff',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#C195FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
