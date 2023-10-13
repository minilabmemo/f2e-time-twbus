import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import Menu from '../components/base/Menu'
import Button from '@mui/material/Button';


export default {
  title: 'base/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    placement: {
      options: ['top', 'bottom'],
      control: { type: "select" }
    },
  }

} as Meta<typeof Menu>;



//Template 寫法 這裡面參數在畫面上是可以改的
const Template: StoryFn<typeof Menu> = (args) => {
  const [$isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Menu
      $isOpen={$isOpen}
      onClick={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      placement={'bottom'}
      overlay={(
        <>
          <div >overlay item1</div>
          <div style={{ color: 'blue' }}>overlay item2</div>
          <div style={{ padding: '5px' }}>overlay item3</div>
        </>)}
    >
      {args.children}

    </Menu>
  )
};

//置換 Template 的參數
export const Dropdown = Template.bind({});
Dropdown.args = {
  placement: 'bottom',
  $isOpen: false,
  children: <Button
    style={{ borderRadius: 4 }}
    variant="outlined"
  >
    Dropdown
  </Button>,

};
