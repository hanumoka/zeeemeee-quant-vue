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

# Nginx 설정 파일을 복사 (필요하다면)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# 기본 이미지로 Node.js를 사용합니다.
# FROM node:16-alpine

# 작업 디렉토리 설정
# WORKDIR /app

# package.json와 package-lock.json 둘 다 복사
# COPY package*.json ./

# 의존성 설치
# RUN npm install

# 프로젝트 파일 복사
# COPY . .

# 프로젝트 빌드
# RUN npm run build

# 서버 실행
# CMD ["npm", "run", "serve"]
