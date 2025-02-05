#Fetch minified node imag on apline linux
FROM node:slim

# ####Declaring env# JONAH BIG FAT UGLY
# ENV NODE_ENV=production

#Setting up the work directory
WORKDIR /app
COPY package*.json ./

RUN npm install && npm install -g nodemon

COPY . .

# Exposing server port
EXPOSE 5007

# Starting our application
CMD ["nodemon", "index.js"]