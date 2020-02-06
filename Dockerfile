# Build container
# - loads all dependencies to build the project
# - requires the ARGs to be given in the build command or in the compose.yaml

FROM node:current-alpine as build

ARG BASE_URL
ARG FCP_API_ENTRYPOINT

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

# @todo copy only required files&folders, e.g. server.js, public, .next, config
COPY --from=build /usr/src/client .

EXPOSE 3000

CMD yarn start
