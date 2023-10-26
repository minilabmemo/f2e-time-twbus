import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { RefreshBar } from '../components/base/RefreshBar';

const meta: Meta<typeof RefreshBar> = {
  title: 'base/RefreshBar',
  component: RefreshBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof meta>;

const ButtonComponent = (args: ComponentProps<typeof RefreshBar>) => {
  const doSomething = () => {

    alert("refreshAction")
  };
  return (

    <RefreshBar initialCountdown={args.initialCountdown} refreshAction={doSomething} updateTime={"test"}></RefreshBar>

  );
};

export const Default: Story = {
  args: { initialCountdown: 30 },
  render: (args: ComponentProps<typeof RefreshBar>) => <ButtonComponent {...args} />,
};
export const LongTime: Story = {
  args: { initialCountdown: 100 },
  render: (args: ComponentProps<typeof RefreshBar>) => <ButtonComponent {...args} />,
};
