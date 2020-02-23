# Build container
# - loads all dependencies to build the project
# - requires the ARGs to be given in the build command or in the compose.yaml

FROM node:current-alpine as build

ARG BASE_URL
ARG FCP_API_ENTRYPOINT

RUN apk add --no-cache git

RUN mkdir -p /usr/src/client

WORKDIR /usr/src/client

# Prevent the reinstallation of node modules at every changes in the source code
COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build && yarn --production


# Deployment container
# - uses the build files to create a slim production container

FROM node:current-alpine as deploy

WORKDIR /usr/src/client

# copy only required files&folders
COPY --from=build /usr/src/client/.next ./.next
COPY --from=build /usr/src/client/config ./config
COPY --from=build /usr/src/client/node_modules ./node_modules
COPY --from=build /usr/src/client/public ./public
COPY --from=build /usr/src/client/src ./src
COPY --from=build \
  /usr/src/client/index.js \
  /usr/src/client/next.config.js \
  /usr/src/client/package.json \
  /usr/src/client/server.js \
  ./

EXPOSE 3000

CMD yarn start
