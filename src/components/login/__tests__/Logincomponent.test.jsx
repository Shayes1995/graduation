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

  const emailInput = screen.getByLabelText(/E-post \*/i);
  expect(emailInput).toBeInTheDocument();

  const passwordInput = screen.getByLabelText(/Lösenord \*/i);
  expect(passwordInput).toBeInTheDocument();
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('password123');
});
