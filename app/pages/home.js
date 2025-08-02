import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [entryType, setEntryType] = useState('Headache'); 
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [logs, setLogs] = useState([]); // Store log history
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('18:00');



  useEffect(() => {
    // Load settings from storage
    const loadSettings = async () => {
      const storedDarkMode = await AsyncStorage.getItem('darkMode');
      const storedNotifications = await AsyncStorage.getItem('notificationsEnabled');
      const storedTime = await AsyncStorage.getItem('notificationTime');
      if (storedDarkMode !== null) setDarkMode(JSON.parse(storedDarkMode));
      if (storedNotifications !== null) setNotificationsEnabled(JSON.parse(storedNotifications));
      if (storedTime !== null) setNotificationTime(storedTime);
    };
    loadSettings();
  }, []);

  // Save settings to AsyncStorage
  const saveSettings = async () => {
    await AsyncStorage.setItem('darkMode', JSON.stringify(darkMode));
    await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
    await AsyncStorage.setItem('notificationTime', notificationTime);
    setSettingsModalVisible(false);
  };


  // List of symptoms with icons
  const symptomsList = [
    { id: 'headache', name: 'Headache', icon: 'medkit' },
    { id: 'nausea', name: 'Nausea', icon: 'exclamation-circle' },
    { id: 'dizziness', name: 'Dizziness', icon: 'heartbeat' },
    { id: 'blurred_vision', name: 'Blurred Vision', icon: 'eye' },
    { id: 'light_sensitivity', name: 'Light Sensitivity', icon: 'lightbulb-o' },
    { id: 'sound_sensitivity', name: 'Sound Sensitivity', icon: 'volume-up' },
  ];

  // Toggle symptom selection
  const toggleSymptom = (id) => {
    setSelectedSymptoms((prevSymptoms) =>
      prevSymptoms.includes(id)
        ? prevSymptoms.filter((symptom) => symptom !== id)
        : [...prevSymptoms, id]
    );
  };

// Handle saving a new log entry
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

    // Reset symptoms and close the modal
    setSelectedSymptoms([]);  // Clears previous symptoms
    setModalVisible(false);
};

// Handle deleting a log entry
const handleDeleteLog = async (timestampToDelete) => {
  try {
    const existingLogs = await AsyncStorage.getItem('logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];

    const updatedLogs = logs.filter((log) => log.timestamp !== timestampToDelete);
    await AsyncStorage.setItem('logs', JSON.stringify(updatedLogs));
    setLogs(updatedLogs); // Update UI
  } catch (error) {
    console.error('Error deleting log:', error);
    alert('Failed to delete log.');
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
      <Text style={styles.subtitle}>Track your symptoms and relief methods</Text>

      {/* Log New Entry Button */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Log New Entry</Text>
      </TouchableOpacity>

      {/* View History Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          try {
            const storedLogs = await AsyncStorage.getItem('logs');
            setLogs(storedLogs ? JSON.parse(storedLogs) : []);
          } catch (error) {
            console.error('Error loading logs:', error);
          }
          setHistoryModalVisible(true);
        }}>
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>

      {/* Settings Button */}
      <TouchableOpacity style={styles.button} onPress={() => setSettingsModalVisible(true)}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>



      {/* Pop-up Modal for New Logs*/}
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

      {/* History Modal */}
      <Modal animationType="slide" transparent={true} visible={historyModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>History</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <View key={log.timestamp} style={styles.historyItem}>
                    <Text style={styles.historyText}>📝 {log.type}</Text>
                    <Text style={styles.historyText}>🕒 {new Date(log.timestamp).toLocaleString()}</Text>
                    <Text style={styles.historyText}>⚠️ Symptoms: {(log.symptoms && Array.isArray(log.symptoms)) ? log.symptoms.join(', ') : 'None'}</Text>
                    <TouchableOpacity onPress={() => handleDeleteLog(log.timestamp)}>
                      <Text style={styles.deleteText}>❌ Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))
                
              ) : (
                <Text style={{ textAlign: 'center', color: '#555' }}>No logs available</Text>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={() => setHistoryModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal animationType="slide" transparent={true} visible={settingsModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
              <Text>Enable Notifications</Text>
              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            </View>

            <View style={{ width: '100%', marginBottom: 10 }}>
              <Text>Notification Time (e.g. 20:00)</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  padding: 8,
                  marginTop: 5
                }}
                placeholder="HH:MM"
                value={notificationTime}
                onChangeText={setNotificationTime}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={saveSettings}>
              <Text style={styles.buttonText}>Save Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setSettingsModalVisible(false)}>
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
    padding: 30,
    backgroundColor: '#F4ECFF',
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
    fontSize: 35,
    fontWeight: '800',
    marginBottom: 20,
    color: '#024802',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#C195FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 12,
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
  historyItem: { 
    backgroundColor: '#EDE7FF',
    padding: 10, 
    borderRadius: 10, 
    marginVertical: 5 
  },
  historyText: { 
    fontSize: 16, 
    color: '#333', 
    marginVertical: 2 
  },
  deleteText: {
    color: '#D00000',
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    minWidth: 80,
    textAlign: 'center',
  }
  
});

export default HomeScreen;
