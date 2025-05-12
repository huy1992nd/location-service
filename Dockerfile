FROM node:18-slim

WORKDIR /app

# Install OpenSSL and other dependencies
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 