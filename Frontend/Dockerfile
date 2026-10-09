# Install Linux Alpine containing Node.js 24
FROM node:24-alpine

# Create project folder inside the image:
WORKDIR /app

# Copy only package.json and package-lock.json files to /app inside the image:
COPY package*.json /app

# Run npm install inside the image to build node_modules
RUN npm install

# Copy current app to /app inside the image (.dockerignore keeps node_modules and .env out):
COPY . /app

# ----------------------------------------------------------

# "dev" is vite --host, so the site is reachable from outside the container.
# Not npm start: its --open looks for a browser, and a container has none.
ENTRYPOINT [ "npm", "run", "dev" ]
