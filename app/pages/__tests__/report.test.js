import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Report from './report';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

// Mock PDF and Sharing functions
jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(() => Promise.resolve({ uri: 'file://dummy.pdf' })),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
}));

describe('Report Screen', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockReset();
    Print.printToFileAsync.mockClear();
    Sharing.shareAsync.mockClear();
  });

  it('loads and displays report logs', async () => {
    const mockLogs = JSON.stringify([
      {
        type: 'Migraine',
        symptoms: ['nausea', 'blurred_vision'],
        timestamp: '2025-07-13T15:00:00Z',
      },
    ]);

    AsyncStorage.getItem.mockResolvedValue(mockLogs);

    const { findByText } = render(<Report />);

    const typeText = await findByText(/Migraine/);
    const symptomsText = await findByText(/nausea, blurred_vision/);
    const timestampText = await findByText(/2025/); // Date will be formatted

    expect(typeText).toBeTruthy();
    expect(symptomsText).toBeTruthy();
    expect(timestampText).toBeTruthy();
  });

  it('downloads PDF when button is pressed', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([
      { type: 'Headache', symptoms: ['dizziness'], timestamp: '2025-07-13T10:00:00Z' },
    ]));

    const { getByText } = render(<Report />);

    await waitFor(() => getByText('Download PDF'));
    fireEvent.press(getByText('Download PDF'));

    await waitFor(() => {
      expect(Print.printToFileAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalledWith('file://dummy.pdf');
    });
  });
});
