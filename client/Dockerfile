FROM nginx:stable-alpine

# RUN touch /var/run/nginx.pid && \
#   chown -R nginx:nginx /var/run/nginx.pid && \
#   chown -R nginx:nginx /var/cache/nginx

# RUN mkdir -p /usr/share/nginx/cache

# Add build
COPY ./dist /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

