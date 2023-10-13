import { Theme } from '@emotion/react';

//https://emotion.sh/docs/typescript  #Define a Theme
// By default, props.theme is an empty object because it's the only thing that is type-safe as a default.
//  You can define a theme type by extending our type declarations via your own declarations file.
declare module '@emotion/react' {
  export interface Theme {
    sectionColor: string;
    typeColor: string;
    primeColor: string;
    secondColor: string;
    descColor: string;
    defaultColor: string,
    successColor: string,
    dangerColor: string,
    placeholderColor: string;
    orangeColor: string;
    selectBtn: {
      active: {
        background: string;
        text: string;
      };
      inActive: {
        background: string;
        text: string;
      };
    };
    saveBtn: {
      active: {
        background: string;
        text: string;
      };
      inActive: {
        background: string;
        text: string;
      };
    };
    searchBtn: {
      background: string;
      text: string;
    };
  }
}


export const theme = (): Theme => ({
  sectionColor: '#FAFAFA',
  primeColor: '#144480',
  secondColor: '#E0F4FF',
  typeColor: '#175FBF',
  descColor: '#494949',
  defaultColor: "#777474",
  successColor: "#17BF46",
  dangerColor: "#D21818",

  placeholderColor: '#CBCBCB',
  orangeColor: '#f9d35a',
  selectBtn: {
    active: {
      background: '#5AC1F9',
      text: '#FAFAFA',
    },
    inActive: {
      background: '#F3F3F3',
      text: '#CBCBCB',
    },
  },
  saveBtn: {
    active: {
      background: '#5AC1F9',
      text: '#FAFAFA',
    },
    inActive: {
      background: '#FFFFFF',
      text: '#CBCBCB',
    },
  },
  searchBtn: {
    background: '#175FBF',
    text: '#FAFAFA',
  },
});
