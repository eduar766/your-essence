FROM node:23
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_OPTIONS="--openssl-legacy-provider"
EXPOSE 3000

CMD ["npm", "run", "start"]