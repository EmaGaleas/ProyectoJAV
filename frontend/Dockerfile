# ===== Base image =====
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build React app (optional depending on setup)
RUN npm run build

# Expose React dev server port
EXPOSE 3000

# Start app
CMD ["npm", "run", "dev", "--", "--host"]