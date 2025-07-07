# Use an official Node.js runtime as a parent image.
# Using alpine for a smaller image size.
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies using a clean install for consistency
# This is faster than `npm install` and better for CI/CD
RUN npm ci

# Bundle app source
COPY . .

# The app binds to this port
EXPOSE 5000

# Command to run the app using nodemon for development
# Make sure you have a "dev" script in your package.json: "dev": "nodemon sever.js"
CMD [ "npm", "run", "dev" ]