import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../style/theme';
import Card from '../components/base/Card';
import { URI_PET_FIND_PREFIX } from '../components/const';
import { HashRouter, Route, Routes } from 'react-router-dom';
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'base/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Card>;

export default meta;
//TODO Link issue
// CSF 3.0 - explicit render function
export const Cat = {
  render: (args: {}) => (

    <ThemeProvider theme={theme}>

      <Card
        animal_id="123456"
        album_file="https://www.pet.gov.tw/upload/pic/1687233477003.png"
        animal_sterilization="T"
        animal_bacterin="T"
        animal_kind="貓"
        animal_Variety="混種貓"
        animal_sex="公"
        animal_age="幼年"
        animal_bodytype="中"
        animal_color="黑白色"
        animal_status="OPEN"
        shelter_name="流浪狗中途之家"

      />
    </ThemeProvider>
  ),
};


export const Dog = {
  render: (args: {}) => (
    <ThemeProvider theme={theme}>

      <Card
        animal_id="123456"
        album_file="https://www.pet.gov.tw/upload/pic/1683101679861.png"
        animal_sterilization="N"
        animal_bacterin="N"
        animal_kind="狗"
        animal_Variety="柴犬吧吧吧吧吧吧吧吧吧吧吧吧"
        animal_sex="公"
        animal_age="幼年"
        animal_bodytype="中"
        animal_color="黑白色系吧吧吧吧"
        animal_status="NA"
        shelter_name="流浪狗中途之家吧吧吧吧吧吧吧吧吧吧吧吧"

      />
    </ThemeProvider>
  ),
};
