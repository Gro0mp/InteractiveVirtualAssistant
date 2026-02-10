# `Dockerfile`

# --- Build stage ---
FROM node:24.13.0 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Runtime stage (static) ---
FROM nginx:alpine AS runtime
# Vite outputs to `dist/` by default
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
