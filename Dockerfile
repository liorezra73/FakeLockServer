FROM node:alpine

RUN apk add --no-cache git \
    openssh
# Create app directory
#WORKDIR /usr/src

RUN git clone https://liorezra73:lior9966369@github.com/liorezra73/FakeLockServer.git
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

# COPY package*.json ./


RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
# COPY ./ ./
# RUN git clone https://github.com/liorezra73/FakeLockServer.git
EXPOSE 3200
CMD [ "npm", "start" ]