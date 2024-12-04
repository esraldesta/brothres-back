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

ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

RUN npx prisma db push

# Build the NestJS application
RUN npm run build

RUN npx prisma db push
# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
