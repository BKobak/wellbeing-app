import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatbotScreen from './chatbot';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      choices: [{ message: { content: "This is a test response from the bot." } }]
    }),
  })
);

describe('ChatbotScreen', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders input and send button', () => {
    const { getByPlaceholderText, getByText } = render(<ChatbotScreen />);
    expect(getByPlaceholderText('Type your message...')).toBeTruthy();
    expect(getByText('Send')).toBeTruthy();
  });

  it('sends a message and receives a response', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<ChatbotScreen />);
    
    const input = getByPlaceholderText('Type your message...');
    fireEvent.changeText(input, 'What causes migraines?');

    fireEvent.press(getByText('Send'));

    // Wait for bot response to appear
    const botReply = await findByText('This is a test response from the bot.');
    expect(botReply).toBeTruthy();
  });
});
