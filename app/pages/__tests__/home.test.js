import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './home';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title and buttons', () => {
    const { getByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);
    expect(getByText('Migraine & Headache Diary')).toBeTruthy();
    expect(getByText('Log New Entry')).toBeTruthy();
    expect(getByText('View History')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('opens the modal when "Log New Entry" is pressed', async () => {
    const { getByText, queryByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);
    expect(queryByText('Log New Episode')).toBeNull();
    fireEvent.press(getByText('Log New Entry'));

    await waitFor(() => {
      expect(getByText('Log New Episode')).toBeTruthy();
    });
  });

  it('selects symptoms and saves a new entry', async () => {
    const { getByText, getAllByText, getByPlaceholderText, getByA11yLabel } = render(
      <HomeScreen navigation={{ navigate: jest.fn() }} />
    );

    fireEvent.press(getByText('Log New Entry'));

    await waitFor(() => {
      expect(getByText('Log New Episode')).toBeTruthy();
    });

    // Select symptom
    fireEvent.press(getByText('Headache'));

    // Save entry
    fireEvent.press(getByText('Save Entry'));

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('logs');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'logs',
        expect.stringContaining('"type":"Headache"')
      );
    });
  });

  it('displays history after saving and opens history modal', async () => {
    // Simulate a stored log
    const fakeLog = [{
      type: 'Migraine',
      symptoms: ['nausea', 'dizziness'],
      timestamp: new Date().toISOString(),
    }];

    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'logs') return Promise.resolve(JSON.stringify(fakeLog));
      return Promise.resolve(null);
    });

    const { getByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);
    fireEvent.press(getByText('View History'));

    await waitFor(() => {
      expect(getByText('History')).toBeTruthy();
      expect(getByText(/Migraine/)).toBeTruthy();
      expect(getByText(/nausea, dizziness/)).toBeTruthy();
    });
  });

  it('opens and saves settings', async () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);

    fireEvent.press(getByText('Settings'));

    await waitFor(() => {
      expect(getByText('Save Settings')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('HH:MM'), '20:30');
    fireEvent.press(getByText('Save Settings'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('notificationTime', '20:30');
    });
  });
});
