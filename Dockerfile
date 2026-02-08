FROM node:24.13.0

# Set the working directory
WORKDIR /app

# Copy only package.json and related files to leverage Docker cache
COPY package*.json ./

# Install dependencies and build the project
RUN npm install
COPY . .
RUN npm run build

# --- Production Stage ---
# Use a lean base image for the final production environment
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the built application from the 'build' stage
COPY --from=build /app/dist ./dist

# Expose the port your app runs on (Vite production serves static files, e.g., on 3000)
EXPOSE 3000

# Command to run the application (assuming you have a 'serve' script or use a package like 'serve')
CMD ["npx", "serve", "dist", "-l", "3000"]