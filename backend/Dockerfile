FROM node:22.15.0
EXPOSE 3005

# For much faster builds, install node packages first because that's the longest
# part and we don't want to invalidate that work each time we change source files
WORKDIR /app
COPY package.json .
RUN npm install -g corepack
RUN yarn set version stable

# Build node app
COPY . .
RUN yarn install
# RUN yarn dlx prisma migrate dev -n migration
# RUN yarn seed

CMD ["yarn", "dev"]
