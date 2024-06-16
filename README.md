`# Deploy Node.js Project to Amazon EC2 with GitHub Actions

This guide will walk you through deploying a Node.js project to an Amazon EC2 instance using GitHub Actions.

## Prerequisites
- An EC2 instance running a Debian-based Linux distribution (e.g., Ubuntu).
- SSH access to your EC2 instance.
- GitHub repository connected to your EC2 instance.

## Steps

### Step 1: Update Package Repositories
Run the following command to update your package repositories:

 ```bash
sudo apt update `

```

### Step 2: Install Node.js

Install Node.js using the following command:

 ```bash

 

`sudo apt-get install -y nodejs`
```
### Step 3: Install Nginx

Install Nginx to act as a reverse proxy for your Node.js application:

```bash

 

`sudo apt-get install -y nginx`
```
### Step 4: Install PM2

Install PM2 globally to manage your Node.js application:

```bash

 

`sudo npm i -g pm2`
```
### Step 5: Configure Nginx

Navigate to the Nginx sites-available directory and open the default configuration file for editing:

```bash

 

`cd /etc/nginx/sites-available
sudo nano default`
```
Inside the Nginx configuration file, add the following block to configure the reverse proxy for your API:

nginx

 

`location /api {
    rewrite ^\/api\/(.*)$ /api/$1 break;
    proxy_pass http://localhost:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}`

### Step 6: Restart Nginx

After making changes to the Nginx configuration, restart Nginx to apply the changes:

```bash

 

`sudo systemctl restart nginx`
```
### Step 7: Start Your Node.js Application with PM2

Navigate to your project directory and start your Node.js application using PM2. Replace `server.js` with the actual filename of your Node.js application:

```bash

 

`cd /path/to/your/app
pm2 start server.js --name=Backend`
```
### Step 8: Restart Your Node.js Application with PM2 (Optional)

If you need to restart your Node.js application managed by PM2, you can use the following command:

```bash

 

`pm2 restart Backend`
```
These steps should help you set up a Node.js backend API with Nginx and PM2 on your Debian-based Linux system. Make sure to customize the paths and filenames according to your specific project.

yaml

 

 `## GitHub Actions Configuration

To automate the deployment process, you can set up a GitHub Actions workflow. Create a `.github/workflows/deploy.yml` file in your repository and add the following content:

```yaml
name: Deploy to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Install SSH Key
        uses: shimataro/ssh-key-action@v2
        with:
          key: ${{ secrets.EC2_SSH_KEY }}
          known_hosts: ${{ secrets.EC2_KNOWN_HOSTS }}

      - name: Deploy to EC2
        run: |
          ssh -o StrictHostKeyChecking=no -i ${{ secrets.EC2_SSH_KEY_PATH }} ubuntu@${{ secrets.EC2_PUBLIC_IP }} << 'EOF'
            cd /path/to/your/app
            git pull origin main
            npm install
            pm2 restart Backend || pm2 start server.js --name=Backend
          EOF`
```
Replace `/path/to/your/app`, `EC2_SSH_KEY`, `EC2_KNOWN_HOSTS`, `EC2_SSH_KEY_PATH`, and `EC2_PUBLIC_IP` with your specific details. Ensure your secrets are configured in your GitHub repository settings.

With this setup, every push to the `main` branch will trigger the GitHub Actions workflow, which will deploy the updated code to your EC2 instance.