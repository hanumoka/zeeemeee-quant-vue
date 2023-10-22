# 기본 이미지로 Node.js를 사용합니다.
FROM node:16-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json와 package-lock.json 둘 다 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 프로젝트 파일 복사
COPY . .

# 프로젝트 빌드
RUN npm run build

# 서버 실행
CMD ["npm", "run", "serve"]
