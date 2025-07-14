import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from './home';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('HomeScreen', () => {
  it('renders the title and buttons', () => {
    const { getByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);

    expect(getByText('Migraine & Headache Diary')).toBeTruthy();
    expect(getByText('Log New Entry')).toBeTruthy();
    expect(getByText('View History')).toBeTruthy();
  });

  it('opens the modal when "Log New Entry" is pressed', async () => {
    const { getByText, queryByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);

    expect(queryByText('Log New Episode')).toBeNull(); // modal not yet open

    fireEvent.press(getByText('Log New Entry'));

    await waitFor(() => {
      expect(getByText('Log New Episode')).toBeTruthy(); // modal opened
    });
  });
});
