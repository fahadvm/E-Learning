# Nginx Configuration for Socket.IO

If your backend is running behind Nginx, you **must** configure Nginx to support WebSocket upgrading. Without this, the connection will fail or fallback to polling (which might also fail if sticky sessions aren't configured and you have multiple instances, though detailed below is for a single backend node).

Add the following block to your Nginx configuration (usually in `/etc/nginx/sites-available/default` or your specific site config), inside the `server` block for `api.devnext.online`.

## Configuration Snippet

Ensure you have a location block specifically for `/socket.io/`:

```nginx
server {
    server_name api.devnext.online;

    # ... other config ...

    location /socket.io/ {
        # Pass requests to the backend server (e.g., localhost:8000 or a docker container)
        proxy_pass http://localhost:8000; 

        # ESSENTIAL: WebSocket Upgrade Headers
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Standard Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts (Optional, but recommended for long-lived connections)
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # Your existing API location
    location / {
        proxy_pass http://localhost:8000;
        # ...
    }
}
```

## Checklist for Production
1.  **Restart Nginx**: After changing the config, run `sudo systemctl restart nginx`.
2.  **Firewall**: Ensure AWS Security Groups allow inbound traffic on the port if you are connecting directly (not applicable if going through Nginx on 80/443).
3.  **Sticky Sessions** (If multiple backend instances): If you are running multiple Node processes (e.g. with PM2 cluster mode or multiple containers) behind a load balancer, you generally need to enable sticky sessions. However, if you are using a single Docker container as described, this is not needed.

## Verification
You can test the connection using `curl`:
```bash
curl "https://api.devnext.online/socket.io/?EIO=4&transport=polling"
```
You should get a response roughly like:
```json
0{"sid":"...","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000}
```
If you get a 404 or 502, the Nginx proxy pass or backend is not running/configured correctly.
