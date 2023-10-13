import type { Meta, StoryObj } from '@storybook/react';

import TaiwanMap from '../components/base/TaiwanMap'
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'base/TaiwanMap',
  component: TaiwanMap,
  tags: ['autodocs'],
  argTypes: {

  },
} satisfies Meta<typeof TaiwanMap>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Raw: Story = {
}


