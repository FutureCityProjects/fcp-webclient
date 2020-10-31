FROM node:current-alpine

RUN apk add --no-cache git tzdata

# @todo this (together with tzdata) fixes:
# Warning: Text content did not match. Server: "Samstag, 1. Februar 2020 um 23:00" Client: "Sonntag, 2. Februar 2020 um 00:00" 
# but this won't work if the client is accessed from multiple/different timezones
# use a client-render like https://stackoverflow.com/questions/50883916/how-to-format-time-in-react-ssr-rendered-page-using-client-time-zone ?
ENV TZ=Europe/Berlin

ENV BASE_URL=http://localhost:3000
ENV FCP_API_ENTRYPOINT=https://fccp-backend.zukunftsstadt.de