FROM nginx:1.27-alpine

# Serve static visualizer files
WORKDIR /usr/share/nginx/html
COPY . .

# Use default nginx config; expose HTTP
EXPOSE 80
