import React from 'react';

import { render, screen } from '@testing-library/react';
import App from './App';

test('render app component', () => {
  render(<App />);
  const headerElement = screen.getByTestId('header-component');
  expect(headerElement).toBeInTheDocument();
});

test('render app toMatchSnapshot', () => {
  const view = render(<App />);
  expect(view).toMatchSnapshot();
});

test('renders the title with the correct text', () => {
  render(<App></App>);

  const titleElement = screen.getByText('查詢條件');
  expect(titleElement).toBeInTheDocument();
});
