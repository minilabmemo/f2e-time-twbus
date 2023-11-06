import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RefreshBar } from './RefreshBar';

describe('RefreshBar', () => {
  const mockRefreshAction = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts the countdown and triggers refresh action when countdown reaches 0', async () => {
    render(<RefreshBar initialCountdown={5} refreshAction={mockRefreshAction} updateTime="2023-11-06T14:30:00" />);

    // Ensure that the initial countdown is displayed
    expect(screen.getByText('5 秒後更新')).toBeInTheDocument();

    // Fast forward time to reach countdown 0
    jest.advanceTimersByTime(5000);

    // Wait for the refresh action to be triggered
    await waitFor(() => {
      expect(mockRefreshAction).toHaveBeenCalledTimes(1);
    });

    // Ensure that the countdown has reset to the initial value (5 in this case)
    expect(screen.getByText('5 秒後更新')).toBeInTheDocument();
  });

  it('triggers refresh action and resets countdown when "立即更新" button is clicked', async () => {
    render(<RefreshBar initialCountdown={10} refreshAction={mockRefreshAction} updateTime="2023-11-06T14:30:00" />);

    // Ensure that the initial countdown is displayed
    expect(screen.getByText('10 秒後更新')).toBeInTheDocument();

    // Click the "立即更新" button
    fireEvent.click(screen.getByText('立即更新 14:30:00'));

    // Ensure that the refresh action is triggered
    expect(mockRefreshAction).toHaveBeenCalledTimes(1);
    expect(screen.getByText('10 秒後更新')).toBeInTheDocument();
  });
});
