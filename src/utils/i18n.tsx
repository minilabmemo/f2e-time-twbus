import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../assets/i18n/en.json';
import jp from '../assets/i18n/ja-JP.json';
import tw from '../assets/i18n/zh-TW.json';

export const LangStrings = {
  en: 'en' as 'en',
  zh: 'zh-TW' as 'zh-TW',
};

const resources = {
  en: {
    translation: en,
  },
  'ja-JP': {
    translation: jp,
  },
  'zh-TW': {
    translation: tw,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-TW',             //預設語言
  fallbackLng: 'zh-TW',     //如果當前切換的語言沒有對應的翻譯則使用這個語言，
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;