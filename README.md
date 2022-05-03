# Auth0 Flow Generator

## Initial setup

```
cp lib/tenantData.example.js lib/tenants.js
# Now populate the above file with valid data

cp .env.local.example .env.local
# Now update the env vars in .env.local if necessary

npm i
```

Add the following line to `/etc/hosts`:

```
127.0.0.1 gen
```

Add this server block to `/usr/local/etc/nginx/nginx.conf`:

```
    server {
      listen        80;
      server_name   gen;

      location / {
        proxy_pass http://localhost:3999;
      }
    }
```

Reload nginx with `sudo nginx -s reload`

## Running

```
npm run dev
```

Visit http://gen in browser.
