# ──────────────────────────────────────────────────────────────────────
# Stage 1: Build the Expo web export
# ──────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Build tools required by some native node addons (canvas, sharp, etc.)
RUN apk add --no-cache python3 make g++ git

# Increase Node heap to avoid OOM during Expo bundling
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV EXPO_NO_TELEMETRY=1
ENV EXPO_NO_UPDATE_CHECK=1

# ── Dependencies (include devDeps — nativewind needs tailwindcss at build time) ──
COPY package.json ./
RUN npm install --legacy-peer-deps

# ── Source ────────────────────────────────────────────────────────────
COPY . .

# ── Web export ────────────────────────────────────────────────────────
# NODE_ENV=production set here only, after install, so devDeps are present
RUN NODE_ENV=production npx expo export --platform web

# ──────────────────────────────────────────────────────────────────────
# Stage 2: Serve with nginx (tiny final image)
# ──────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# SPA-aware nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Compiled web bundle from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
