# 빌드 스테이지
FROM node:16-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 실행 스테이지
FROM nginx:latest

COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

# Nginx 설정 파일을 복사
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
