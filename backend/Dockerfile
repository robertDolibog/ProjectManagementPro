FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
ENV NODEMON_LEGACY_WATCH=true
CMD sh -c "npx prisma migrate deploy && npx prisma generate && npx nodemon main.js"