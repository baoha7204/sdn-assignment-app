FROM node:alpine

WORKDIR /app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
