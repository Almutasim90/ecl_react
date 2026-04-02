# ──────────────────────────────────────────────
# Stage 1: Build the Expo web export
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install build deps needed by some native packages
RUN apk add --no-cache python3 make g++

# Copy dependency manifests first (layer cache)
COPY package.json ./

# Install — legacy-peer-deps because RN ecosystem has mixed peer declarations
RUN npm install --legacy-peer-deps

# Copy the rest of the source
COPY . .

# Suppress telemetry and run the static web export
ENV EXPO_NO_TELEMETRY=1
ENV NODE_ENV=production

RUN npx expo export --platform web

# ──────────────────────────────────────────────
# Stage 2: Serve with nginx
# ──────────────────────────────────────────────
FROM nginx:1.27-alpine

# Replace default config with SPA-aware config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built web bundle
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]