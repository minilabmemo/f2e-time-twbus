# f2e-time-twbus
台灣開放資料搜尋。

作品畫面


----


## 作品說明
The F2E 全台公車動態時刻查詢應用服務。
- 設計稿特別感謝

## 系統說明
本專案使用 `create-react-app` typescript 範本，部署到 Github Pages， 
- `npm install` 下載依賴包
- `npm start` 運行
- `npm test` 運行測試
- Node.js `v18.16.1`

### 運行測試
```
npm test
npm test -- --coverage 
coverage/lcov-report/src/components/index.html
```


## 資料夾說明
src .
├── __snapshots__
├── components 共用元件
│   ├── Icons
│   ├── Portal
│   ├── base
│   ├── btn
│   ├── files
│   └── layout
├── hooks
├── images 圖片
├── pages 分頁
├── stories storybook資料
│   └── assets
├── style
│   ├── __tests__
│   │   └── __snapshots__
│   └── partials
│       ├── components
│       │   ├── base
│       │   └── layouts
│       ├── global
│       └── pages
└── utils
…
## 使用技術
- React
- Axios
…
## 第三方服務
…

