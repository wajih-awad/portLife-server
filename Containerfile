FROM node:22-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY ./ ./

RUN npm install

FROM base AS runner

RUN addgroup --system --gid 1100 easylab && adduser --system --uid 1100 easylab

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=easylab:easylab /app/ /app/

USER easylab

ENV HOSTNAME="0.0.0.0"
CMD ["node", "./server.js"]
