import type { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { StreetMap } from '../components/base/StreetMap';

const meta: Meta<typeof StreetMap> = {
  title: 'base/StreetMap',
  component: StreetMap,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

};
export default meta;
type Story = StoryObj<typeof meta>;

//顯示怪怪的
const StreetMapComponent = (args: ComponentProps<typeof StreetMap>) => {
  const doSomething = () => {
  };
  return (
    <div style={{ width: "500px", height: "500px" }}>
      <StreetMap id={args.id}
        initZoom={15}
        activeTab={0}
        flyToUserLoc={false}
      />
    </div>

  );
};

export const Default: Story = {
  args: {
    initZoom: 13, id: 'story-map-init-1'
  },
  render: (args: ComponentProps<typeof StreetMap>) => <StreetMapComponent {...args} />,
};
