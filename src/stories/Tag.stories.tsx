import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../style/theme';
import Tag from '../components/base/Tag';

import { ComponentProps } from 'react';

const meta: Meta<typeof Tag> = {
  title: 'base/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '已打疫苗',
    tagType: undefined,
  },
};

const Component = (args: ComponentProps<typeof Tag>) => {
  return (
    <>
      <Tag text="已打疫苗" tagType="primary" />
      <Tag text="已絕育" tagType="primary" />
      <Tag text="未打疫苗" tagType="warning" />
    </>
  );
};

export const GroupTags: Story = {
  render: (args) => <Component {...args} />,
};
