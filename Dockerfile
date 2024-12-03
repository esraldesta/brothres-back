# Use the official Node.js image as the base image
FROM node:18-alpine AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

RUN npx prisma generate

EXPOSE 8000

ENV PORT=8000

# Build the NestJS application
RUN npm run build

# Command to run the application
CMD ["node", "dist/main"]
