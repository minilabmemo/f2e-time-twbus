import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../style/theme';
import SwitchButton from '../components/btn/SwitchButton';


import { ComponentProps } from 'react';
import DogSvg from '../components/Icons/DogSvg';
import SaveSvg from '../components/Icons/SaveSvg';

const meta: Meta<typeof SwitchButton> = {
  title: 'base/SwitchButton',
  component: SwitchButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isActive: {
      options: [true, false],
      control: { type: 'boolean' },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

const DogIcon = <DogSvg width="2.1em" height="2.1em" fill="#FAFAFA" />;
const SaveIcon = <SaveSvg width="24px" height="24px" />;


//Template 寫法 這裡面參數在畫面上是可以改的
const Template: StoryFn<typeof SwitchButton> = (args) => {
  const [isDog, setIsDog] = useState(args.isActive);
  return (
    <ThemeProvider theme={theme}>
      <SwitchButton
        isActive={isDog}
        onClick={() => setIsDog(!isDog)}
        text={args.text}
        icon={args.icon}
        btnType="select"
      />
    </ThemeProvider>
  );
};

//置換 Template 的參數
export const TypeBtn = Template.bind({});

TypeBtn.args = {
  isActive: true,
  icon: DogIcon,
  text: '狗',
};

const ButtonWithHooks = (args: ComponentProps<typeof SwitchButton>) => {
  const [isDog, setIsDog] = useState(args.isActive);

  return (
    <ThemeProvider theme={theme}>
      <SwitchButton
        isActive={isDog}
        onClick={() => setIsDog(!isDog)}
        icon={args.icon}

        btnType={args.btnType}
        text={args.text}
      />
    </ThemeProvider>
  );
};

export const SaveBtn: Story = {
  args: {
    isActive: true,
    icon: SaveIcon,
    btnType: 'save',
  },
  render: (args) => <ButtonWithHooks {...args} />,
};

export const TextBtn: Story = {
  args: {
    isActive: true,
    text: '公',
    btnType: 'text',
  },
  render: (args) => <ButtonWithHooks {...args} />,
};
