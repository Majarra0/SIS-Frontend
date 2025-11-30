FROM node:20-slim

ARG TARGETARCH

WORKDIR /app

COPY package*.json ./
# Install dependencies including optional platform-specific binaries (e.g., Rollup native)
RUN npm ci --include=optional
# Ensure Rollup's native binary matches the target architecture (amd64/arm64)
RUN set -e; \
    arch="${TARGETARCH:-amd64}"; \
    case "$arch" in \
      amd64) rollup_arch=x64 ;; \
      arm64) rollup_arch=arm64 ;; \
      *) echo "Unsupported arch $arch" && exit 1 ;; \
    esac; \
    npm install --no-save @rollup/rollup-linux-${rollup_arch}-gnu

COPY . .

ARG VITE_API_MODE=real
ARG VITE_API_BASE_URL=http://localhost:8000/api
ARG VITE_USE_MOCKS=
ENV VITE_API_MODE=${VITE_API_MODE}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_USE_MOCKS=${VITE_USE_MOCKS}

RUN npm run build

EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
