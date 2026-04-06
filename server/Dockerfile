FROM node:20-alpine
# better-sqlite3 is a native addon — needs build tools
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json .
RUN npm install
COPY index.js .
RUN mkdir -p data
EXPOSE 3001
CMD ["node", "index.js"]
