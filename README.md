# Auth0 Flow Generator

Creates minimal apps to test various Auth0 login flows.

A list of tenants, clients, and some other data can be configured in the lib/tenants.js file. A tmp.html file is created in a configured location every time a new config is created. Old tmp.html file will be overwritten.

## Initial setup

```
cp lib/tenantData.example.js lib/tenants.js
# Now populate the above file with valid data

cp .env.local.example .env.local
# Now update the env vars in .env.local if necessary

# Install dependencies
npm install
```

Add the following line to `/etc/hosts`:

```
127.0.0.1 gen
```

Add this server block to `/usr/local/etc/nginx/nginx.conf` (or `/opt/homebrew/etc/nginx/nginx.conf`):

```
    server {
      listen        80;
      server_name   gen;

      location / {
        proxy_pass http://localhost:3999;
      }
    }
```

Reload nginx with `sudo nginx -s reload` (or `brew services reload nginx`)

## Running

```
npm run dev
```

Visit http://gen in browser.
