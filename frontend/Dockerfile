FROM node:22.15.0
EXPOSE 3000
# For much faster builds, install node packages first because that's the longest
# part and we don't want to invalidate that work each time we change source files
WORKDIR /app
COPY package.json .
RUN npm install -g corepack
RUN npm install -g serve
RUN yarn set version stable

# Build node app
COPY . .
RUN yarn install
RUN yarn build

CMD ["yarn", "preview"]
