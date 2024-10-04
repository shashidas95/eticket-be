# Use the Node.js 18 Alpine image for building
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn run build
COPY src/mailer /app/build/mailer
EXPOSE 7001
CMD ["yarn", "start"]