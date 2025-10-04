# =========================================
# Stage 1: Build the React.js Application
# =========================================
ARG NODE_VERSION=24.7.0-alpine
ARG NGINX_VERSION=alpine3.22

FROM node:${NODE_VERSION} AS builder

ARG VITE_API_BASE_URL=http://localhost:8000/

# Enable Corepack
RUN corepack enable

WORKDIR /app

# Copy Yarn binary and config first (important!)
COPY .yarn .yarn
COPY .yarnrc.yml ./
COPY package.json yarn.lock ./

# Install dependencies (cached)
RUN --mount=type=cache,target=/root/.yarn/cache yarn install --immutable

# Copy the rest of the application source code
COPY . .

# Build the React.js application
RUN VITE_API_BASE_URL=${VITE_API_BASE_URL} yarn build

# =========================================
# Stage 2: Prepare Nginx to Serve Static Files
# =========================================
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

USER nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]