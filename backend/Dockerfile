FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /usr/src/app
USER appuser

EXPOSE 3000

CMD ["node", "index.js"]
