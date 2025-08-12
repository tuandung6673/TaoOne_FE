# stage 1
FROM node:18.15.0 as build
ENV NODE_OPTIONS=--max-old-space-size=8192
WORKDIR /app
COPY . . 
RUN npm install --force
RUN npm run build

ARG REACT_APP_API_BASE_URL
ARG REACT_APP_TELE_BOT_TOKEN
ARG REACT_APP_TELE_CHAT_ID
ARG REACT_APP_VIETNAM_API
ARG REACT_APP_BASE_URL

ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_TELE_BOT_TOKEN=$REACT_APP_TELE_BOT_TOKEN
ENV REACT_APP_TELE_CHAT_ID=$REACT_APP_TELE_CHAT_ID
ENV REACT_APP_VIETNAM_API=$REACT_APP_VIETNAM_API
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL

# stage 2
FROM nginx:alpine as prod
ENV TZ="Asia/Ho_Chi_Minh"
COPY --from=build /app/build /usr/share/nginx/html
# COPY --from=build /app/certs /certs
COPY --from=build /app/default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
