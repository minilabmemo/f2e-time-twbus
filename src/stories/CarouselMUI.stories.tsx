import type { Meta, StoryObj } from '@storybook/react';

import CarouselMUI from '../components/base/CarouselMUI'
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'base/CarouselMUI',
  component: CarouselMUI,
  tags: ['autodocs'],
  argTypes: {
    isShown: {
      options: [true, false],
      control: { type: "boolean" }
    },
  },
} satisfies Meta<typeof CarouselMUI>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    isShown: true,

  },
};


var items = [
  {
    name: "Random Name #2",
    description: "Hello World!",
    image: '',
    imageNode: <> <img alt="stack overflow" src={'https://picsum.photos/id/22/900/325'}></img> </>
  },
  {
    name: "Random Name #3",
    description: "Hello World!",
    image: 'https://picsum.photos/id/123/900/325',
    imageNode: <img alt="stack overflow" src={''}></img>
  }
]

export const Secondary: Story = {
  args: {
    isShown: false,

    items: items
  },
};
