import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Logincomponent from '../Logincomponent';

test('renders login form and handles input', () => {
  render(
    <Router>
      <Logincomponent />
    </Router>
  );

  // Check if the email input is rendered
  const emailInput = screen.getByLabelText(/E-post \*/i);
  expect(emailInput).toBeInTheDocument();

  // Check if the password input is rendered
  const passwordInput = screen.getByLabelText(/Lösenord \*/i);
  expect(passwordInput).toBeInTheDocument();

  // Simulate user input
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Check if the inputs have the correct values
  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('password123');
});
