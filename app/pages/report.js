import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Report = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const storedLogs = await AsyncStorage.getItem('logs');
                if (storedLogs) {
                    setLogs(JSON.parse(storedLogs));
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        };

        fetchLogs();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Log History</Text>
            {logs.length === 0 ? (
                <Text style={styles.noLogsText}>No logs recorded yet.</Text>
            ) : (
                <FlatList
                    data={logs}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.logItem}>
                            <Text style={styles.logType}>{item.type}</Text>
                            <Text style={styles.logSymptoms}>Symptoms: {item.symptoms.join(', ')}</Text>
                            <Text style={styles.logTimestamp}>Date: {new Date(item.timestamp).toLocaleString()}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DAC0FF',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#024802',
    },
    noLogsText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#555',
    },
    logItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    logType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5A189A',
    },
    logSymptoms: {
        fontSize: 16,
        color: '#333',
    },
    logTimestamp: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});

export default Report;
