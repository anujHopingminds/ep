# Use the official Node.js image from the Docker Hub
FROM node:18 as builder

# Set the working directory
WORKDIR /build

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY public/ public/ 
COPY src/ src/ 
COPY server.js/ server.js/ 

# run command
RUN npm prod

# from runner stage
FROM node:18 as builder

WORKDIR /build

COPY --from==builder build/package*.json .
COPY --from==builder build/node_modules node_modules

CMD ["npm","start"]