# f2e-time-twbus

 `react` `scss` `typescript` `storybook`


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

```

npm install -g create-react-app 
//有裝過可以不用跑
create-react-app f2e-time-twbus --template typescript
//要注意後方是否正確 否則可能回出現非 ts 版本的專案

```
- structure 
```
src $ tree -d
.
├── __snapshots__
├── api
├── components
│   ├── Portal
│   ├── base
│   └── btn
├── hooks
├── images
├── pages
├── stories
│   └── assets
├── style
│   ├── __tests__
│   │   └── __snapshots__
│   └── partials
│       ├── base
│       ├── components
│       ├── global
│       └── layouts
└── utils
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

- npm testC 可以產生 測試報告覆蓋率

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


### `npm run deploy`
this project use `npm install --save gh-pages` to deploy `build` folder.
```diff package.json
  "name": "f2e-time-twbus",
+  "homepage": "https://minilabmemo.github.io/f2e-time-twbus",
  "scripts": {
+    "predeploy": "npm run build",
+    "deploy": "gh-pages -d build",
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },

```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## node version node -v
- node v18.16.1

## vscode plugin
- vscode-stylted-components
- Code Spell Checker 幫你拼字檢查
- SCSS intellisense
- Live Sass Compiler > watch sass [vscode button at below] 幫你轉換css檔案
- 安裝 jest 可以幫助你產生測試按鈕與cmd+shift+P->Jest:Toggle Coverage 提示未覆蓋範圍

## storybook
```
npm run storybook
127.0.0.1:6006
```

## test
```
npm test
npm test -- --coverage 
coverage/lcov-report/src/components/index.html
```


## 本地測試

### react 專案使用 npm start
即可開啟網站
*無法針對build中的html live server啟動。

### docker
  - 確保可以 build 之後
  - .dockerignore 
  - 撰寫 dockerfile (網路範本), build image
  ```
  docker build -t fe-time-twbus . --no-cache  //會花上一段時間
  docker run -p 80:80 fe-time-twbus //端口可改
   INFO  Accepting connections at http://localhost:80
  打開 http://localhost 看到網站了！ 一片空白 //TODO 需要修改到public檔案？ 待研究
  ```