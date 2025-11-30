FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

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
