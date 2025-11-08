FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

# Cloud Run provides the PORT env var (usually 8080). Expose 8080 to match runtime.
EXPOSE 8080

CMD ["node", "src/server.js"]
