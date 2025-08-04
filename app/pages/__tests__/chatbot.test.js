import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatbotScreen from './chatbot';
import { Alert } from 'react-native';

global.fetch = jest.fn();

jest.spyOn(Alert, 'alert');

describe('ChatbotScreen', () => {
  beforeEach(() => {
    fetch.mockReset();
    Alert.alert.mockClear();
  });

  it('renders input and send button', () => {
    const { getByPlaceholderText, getByText } = render(<ChatbotScreen />);
    expect(getByPlaceholderText('Type your message...')).toBeTruthy();
    expect(getByText('Send')).toBeTruthy();
  });

  it('sends a message and displays both user and bot messages', async () => {
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: 'This is a test response from the bot.' } }],
        }),
    });

    const { getByPlaceholderText, getByText, findByText } = render(<ChatbotScreen />);
    const input = getByPlaceholderText('Type your message...');
    
    fireEvent.changeText(input, 'What causes migraines?');
    fireEvent.press(getByText('Send'));

    // User message should appear
    expect(await findByText('You: What causes migraines?')).toBeTruthy();

    // Bot reply should appear
    expect(await findByText('Bot: This is a test response from the bot.')).toBeTruthy();
  });

  it('does not send request if input is empty', async () => {
    const { getByText } = render(<ChatbotScreen />);
    fireEvent.press(getByText('Send'));
    expect(fetch).not.toHaveBeenCalled();
  });

  it('handles fetch failure and shows alert', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { getByPlaceholderText, getByText } = render(<ChatbotScreen />);
    fireEvent.changeText(getByPlaceholderText('Type your message...'), 'Hello?');
    fireEvent.press(getByText('Send'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to get response from the bot.');
    });
  });
});
