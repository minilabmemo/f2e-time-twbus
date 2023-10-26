import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../styles/theme';
import ButtonEffect from '../components/btn/ButtonEffect';
import { ComponentProps } from 'react';

const meta: Meta<typeof ButtonEffect> = {
  title: 'base/ButtonEffect',
  component: ButtonEffect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof meta>;

const ButtonWithHooks = (args: ComponentProps<typeof ButtonEffect>) => {
  const onSearch = () => {
    console.log('onSearch', onSearch);
  };

  return (
    <ThemeProvider theme={theme}>
      <ButtonEffect onClick={() => onSearch()} touchRipple={args.touchRipple} isLoading>
        <span>點擊</span>
      </ButtonEffect>
    </ThemeProvider>
  );
};

export const Default: Story = {
  args: {},
  render: (args: ComponentProps<typeof ButtonEffect>) => <ButtonWithHooks {...args} />,
};
export const NoTouchRipple: Story = {
  args: { touchRipple: false },
  render: (args: ComponentProps<typeof ButtonEffect>) => <ButtonWithHooks {...args} />,
};
