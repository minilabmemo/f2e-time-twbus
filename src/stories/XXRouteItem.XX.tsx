import type { Meta, StoryObj } from '@storybook/react';
import { RouteItem } from '../components/base/RouteItem';

//FIXME APP Route需要init  RouteItem story才能顯示
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'base/RouteItem',
  component: RouteItem,
  tags: ['autodocs'],
  argTypes: {

  },
} satisfies Meta<typeof RouteItem>;

export default meta;
type Story = StoryObj<typeof meta>;
const cityRoutesArray = JSON.parse(` {
  "RouteUID": "TPE10132",
  "RouteID": "10132",
  "Operators": [
    {
      "OperatorID": "100",
      "OperatorName": {
        "Zh_tw": "臺北客運",
        "En": "Taipei Bus Co., Ltd."
      },
      "OperatorCode": "TaipeiBus",
      "OperatorNo": "1407"
    }
  ],
  "RouteName": {
    "Zh_tw": "234",
    "En": "234"
  },
  "DepartureStopNameZh": "板橋",
  "DepartureStopNameEn": "Banqiao",
  "DestinationStopNameZh": "西門  你這邊看到的是暫時資料",
  "DestinationStopNameEn": "Ximen",
  "City": "Taipei",
  "CityCode": "TPE",
  "UpdateTime": "2023-10-18T01:49:30+08:00",
  "VersionID": 2777
}`)
// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Raw: Story = {
  args: {
    lang: "zh",
    item: cityRoutesArray,
  },

}


