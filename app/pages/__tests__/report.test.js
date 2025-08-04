import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Report from './report';
import { Alert } from 'react-native';

// Mocks
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(() => Promise.resolve({ uri: 'file://dummy.pdf' })),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

global.fetch = jest.fn();

jest.spyOn(Alert, 'alert');

describe('Report Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders report summary from logs', async () => {
    const logs = [
      {
        type: 'Migraine',
        symptoms: ['nausea', 'blurred_vision'],
        timestamp: '2025-07-13T15:00:00Z',
      },
      {
        type: 'Headache',
        symptoms: ['dizziness'],
        timestamp: '2025-07-15T10:00:00Z',
      },
    ];

    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(logs));

    const { findByText } = render(<Report />);

    expect(await findByText('Monthly Report')).toBeTruthy();
    expect(await findByText(/7\/2025/)).toBeTruthy();
    expect(await findByText(/Headaches: 1/)).toBeTruthy();
    expect(await findByText(/Migraines: 1/)).toBeTruthy();
    expect(await findByText(/nausea: 1 times/)).toBeTruthy();
    expect(await findByText(/blurred_vision: 1 times/)).toBeTruthy();
    expect(await findByText(/dizziness: 1 times/)).toBeTruthy();
  });

  it('renders AI insights correctly', async () => {
    const logs = [
      {
        type: 'Migraine',
        symptoms: ['nausea'],
        timestamp: '2025-07-13T10:00:00Z',
      },
      {
        type: 'Headache',
        symptoms: ['nausea'],
        timestamp: '2025-07-15T10:00:00Z',
      },
    ];

    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(logs));

    const { findByText } = render(<Report />);
    
    expect(await findByText('🔮 AI Insights')).toBeTruthy();
    expect(await findByText(/Next expected episode:/)).toBeTruthy();
    expect(await findByText(/nausea/)).toBeTruthy();
  });

  it('handles empty logs gracefully', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const { findByText } = render(<Report />);
    expect(await findByText('No logs available for reporting.')).toBeTruthy();
  });

  it('generates and shares PDF when download button is pressed', async () => {
    const logs = [
      { type: 'Migraine', symptoms: ['nausea'], timestamp: '2025-07-13T10:00:00Z' },
    ];

    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(logs));

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ html: '<html><body>Report</body></html>' }),
    });

    const { findByText, getByText } = render(<Report />);
    await findByText('Download PDF Report');

    fireEvent.press(getByText('📥 Download PDF Report'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:3000/report',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(Print.printToFileAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalledWith('file://dummy.pdf');
    });
  });

  it('shows alert if report generation fails', async () => {
    const logs = [
      { type: 'Headache', symptoms: [], timestamp: '2025-07-13T10:00:00Z' },
    ];

    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(logs));

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Something went wrong' }),
    });

    const { findByText, getByText } = render(<Report />);
    await findByText('Download PDF Report');
    fireEvent.press(getByText('📥 Download PDF Report'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Report Generation Failed',
        'Something went wrong'
      );
    });
  });

  it('shows alert when no logs found for PDF generation', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const { findByText, getByText } = render(<Report />);
    await findByText('Download PDF Report');

    fireEvent.press(getByText('📥 Download PDF Report'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'No logs found',
        'Please add some logs before generating a report.'
      );
    });
  });
});
