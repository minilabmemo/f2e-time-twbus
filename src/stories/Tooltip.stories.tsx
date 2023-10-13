import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import Tooltip from '../components/base/Tooltip'
import Button from '@mui/material/Button';


export default {
  title: 'Tooltip',
  component: Tooltip,
  // 調整 story 的呈現的位置， https://storybook.js.org/docs/react/configure/story-layout
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        code: ` <Tooltip
      content={<div><div>Tooltip</div><div>test!</div></div>}
      placement="top"
      gap={12}
      color={'red'}
    >
   {chidren}
    </Tooltip>` }
    }
  },
  //https://storybook.js.org/docs/react/essentials/controls
  argTypes: {
    placement: {
      options: ['top', 'bottom'],
      control: { type: "select" }
    },
  }

} as Meta<typeof Tooltip>;

export const Raw = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, width: 300 }}>

    <Tooltip
      content={<div><div>Tooltip</div><div>test!</div></div>}
      placement="top"
      gap={12}
      color={'red'}
    >
      <Button variant="outlined">
        Bottom Raw
      </Button>

    </Tooltip>

  </div >
);

//Template 寫法 這裡面參數在畫面上是可以改的
const Template: StoryFn<typeof Tooltip> = (args) => (
  <Tooltip
    {...args}
  >
    <Button variant="outlined">
      Buttom
    </Button>

  </Tooltip>

);

//置換 Template 的參數
export const Bottom = Template.bind({});
Bottom.args = {
  placement: 'bottom',
  content: <div><div>Tooltip</div><div>test!</div></div>,
  showArrow: true
};

