import type { Meta, StoryFn } from '@storybook/react';
import MenuItem from '../components/base/MenuItem'


export default {
  title: 'base/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },

  argTypes: {
  }

} as Meta<typeof MenuItem>;



//Template 寫法 這裡面參數在畫面上是可以改的
const Template: StoryFn<typeof MenuItem> = (args) => (

  <MenuItem key={1} item={args.item} subItems={args.subItems} />

);

//置換 Template 的參數
export const Default = Template.bind({});
Default.args = {
  item: '主要選項',
  subItems: ['次選項1', '次選項2', '次選項3']
};
