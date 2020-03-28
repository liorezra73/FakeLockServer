FROM node:alpine
RUN apk --no-cache add git 
ARG password
RUN git clone https://liorezra73:${password}@github.com/liorezra73/FakeLockServer.git /usr/src
WORKDIR /usr/src/FakeLockServer
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]