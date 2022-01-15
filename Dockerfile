FROM node:16-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
ARG DOCKER_ENV=prod
ENV DOCKER_ENV $DOCKER_ENV
CMD ["sh", "-c", "npm run start:$DOCKER_ENV"]