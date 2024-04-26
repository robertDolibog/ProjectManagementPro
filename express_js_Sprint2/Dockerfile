FROM node:18
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Bundle app source

COPY . .
EXPOSE 3000
ENV NODEMON_LEGACY_WATCH=true
CMD [ "npx", "nodemon", "main.js" ]

