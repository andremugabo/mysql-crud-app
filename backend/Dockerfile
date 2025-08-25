FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies (production only for smaller image)
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the source code
COPY . .

# Expose the backend port (your Express app runs on 5000, not 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
