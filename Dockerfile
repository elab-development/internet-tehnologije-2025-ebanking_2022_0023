# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "run", "dev"]

#zavisnosti
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# optimizovan kod u .next
RUN npm run build

# image za produkciju
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# neophodno za rad aplikacije - Kopiranje
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# pokretanje u produkcionom modu
CMD ["npm", "start"]
