# 使用官方的 Node.js 映像作為基礎映像
FROM node:14-alpine

# 設定工作目錄
WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build


RUN npm install -g serve


EXPOSE 80


CMD ["serve", "-s", "build", "-l", "80"]
