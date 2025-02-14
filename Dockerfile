# Fetch minified node image on Alpine Linux
FROM node:slim AS base

#Declaring env
# ENV NODE_ENV=production

#Setting up the work directory
WORKDIR /app
COPY package*.json ./

RUN npm install

COPY src/ ./src/

# Exposing server port
EXPOSE 5007

# Starting our application
CMD ["npm", "start"]

# If running in dev mode
FROM base AS dev

RUN npm install -g nodemon

CMD ["nodemon", "src/index.js"]