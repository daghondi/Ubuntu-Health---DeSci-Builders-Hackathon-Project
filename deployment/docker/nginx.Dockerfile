# Ubuntu Health Nginx Dockerfile
# Community-focused reverse proxy with Ubuntu philosophy integration

FROM nginx:1.25-alpine

# Install additional tools for Ubuntu Health community support
RUN apk add --no-cache \
    curl \
    bash \
    openssl \
    logrotate

# Create ubuntu user for community principles
RUN addgroup -g 1001 -S ubuntu && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G ubuntu -g ubuntu ubuntu

# Create Ubuntu Health directories
RUN mkdir -p \
    /etc/nginx/ssl \
    /var/log/nginx \
    /etc/nginx/conf.d \
    /usr/share/nginx/html/ubuntu-assets \
    /var/cache/nginx/ubuntu-wisdom && \
    chown -R ubuntu:ubuntu /var/cache/nginx && \
    chown -R ubuntu:ubuntu /var/log/nginx

# Copy Ubuntu Health nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/ubuntu-community.conf /etc/nginx/conf.d/default.conf

# Copy Ubuntu Health static assets and community content
COPY static/ /usr/share/nginx/html/
COPY ubuntu-assets/ /usr/share/nginx/html/ubuntu-assets/

# Generate self-signed SSL certificate for development
# (In production, use proper certificates from Let's Encrypt or CA)
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/ubuntu-health.key \
    -out /etc/nginx/ssl/ubuntu-health.crt \
    -subj "/C=ZA/ST=Ubuntu/L=Community/O=Ubuntu Health/OU=Healing/CN=ubuntu-health.org"

# Set proper permissions for Ubuntu community security
RUN chown -R ubuntu:ubuntu /etc/nginx/ssl && \
    chmod 600 /etc/nginx/ssl/ubuntu-health.key && \
    chmod 644 /etc/nginx/ssl/ubuntu-health.crt

# Create Ubuntu Health custom index page
RUN cat > /usr/share/nginx/html/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ubuntu Health - I am because we are</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #FF6B35, #F7931E, #FFD23F);
            color: #333;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .ubuntu-container {
            background: rgba(255, 255, 255, 0.95);
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            max-width: 600px;
            margin: 2rem;
        }
        .ubuntu-logo {
            font-size: 3rem;
            font-weight: bold;
            color: #FF6B35;
            margin-bottom: 1rem;
        }
        .ubuntu-philosophy {
            font-size: 1.5rem;
            font-style: italic;
            color: #666;
            margin-bottom: 2rem;
        }
        .ubuntu-message {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .ubuntu-status {
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 2rem;
        }
    </style>
</head>
<body>
    <div class="ubuntu-container">
        <div class="ubuntu-logo">🌍 Ubuntu Health</div>
        <div class="ubuntu-philosophy">"Ubuntu ngumuntu ngabantu"<br>I am because we are</div>
        <div class="ubuntu-message">
            Welcome to Ubuntu Health - a community-driven healthcare platform that embodies the African philosophy of Ubuntu. 
            Our decentralized system connects traditional healing wisdom with modern medical technology, 
            ensuring healthcare access that honors both individual sovereignty and communal responsibility.
        </div>
        <div class="ubuntu-status">
            🏥 Community Health System: Active<br>
            🌿 Traditional Healing: Integrated<br>
            👥 Elder Council: Blessing<br>
            🔗 Blockchain Network: Connected
        </div>
    </div>
</body>
</html>
EOF

# Create health check script with Ubuntu wisdom
RUN cat > /usr/local/bin/ubuntu-health-check.sh << 'EOF'
#!/bin/bash
# Ubuntu Health community health check script

echo "🌍 Ubuntu Health Community Health Check"
echo "======================================="

# Check nginx process
if pgrep nginx > /dev/null; then
    echo "✅ Nginx: Serving community with Ubuntu philosophy"
else
    echo "❌ Nginx: Not running - community needs healing"
    exit 1
fi

# Check configuration
if nginx -t 2>/dev/null; then
    echo "✅ Configuration: Ubuntu principles honored"
else
    echo "❌ Configuration: Needs elder guidance"
    exit 1
fi

# Check SSL certificates
if [ -f /etc/nginx/ssl/ubuntu-health.crt ]; then
    echo "✅ SSL Certificate: Community connections secured"
else
    echo "❌ SSL Certificate: Missing - community vulnerable"
    exit 1
fi

# Check log files
if [ -w /var/log/nginx ]; then
    echo "✅ Logging: Community stories being recorded"
else
    echo "❌ Logging: Cannot record community wisdom"
    exit 1
fi

echo "🙏 Ubuntu Health: I am because we are - Community thriving!"
EOF

RUN chmod +x /usr/local/bin/ubuntu-health-check.sh

# Expose ports for Ubuntu community access
EXPOSE 80 443 8080

# Health check with Ubuntu community validation
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD /usr/local/bin/ubuntu-health-check.sh

# Start nginx with Ubuntu blessing
CMD ["nginx", "-g", "daemon off;"]

# Ubuntu Health labels
LABEL maintainer="Ubuntu Health Community <community@ubuntu-health.org>"
LABEL version="1.0.0"
LABEL description="Ubuntu Health Nginx - Community gateway with Ubuntu philosophy"
LABEL ubuntu.philosophy="I am because we are"
LABEL ubuntu.component="community-gateway"
LABEL ubuntu.healing="digital-access"
LABEL ubuntu.wisdom="load-balancing-with-ubuntu-principles"
