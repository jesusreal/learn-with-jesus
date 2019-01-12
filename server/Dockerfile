FROM mhart/alpine-node:10.15.0

# RUN useradd --user-group --create-home --shell /bin/false nodejs

# ENV HOME=/home/nodejs
# ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
# RUN chown -R nodejs:nodejs $HOME/*
# USER nodejs

RUN npm install
# RUN npm run db  

COPY index.js .

EXPOSE 3333
CMD [ "npm", "start" ]
