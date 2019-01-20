FROM mhart/alpine-node:10.15.0

# Define ENV variables
ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY ./src .

# Expose port and start application
EXPOSE 3333
CMD [ "npm", "run", "start-prod" ]
