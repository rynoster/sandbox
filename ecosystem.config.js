module.exports = {
  apps: [{
    name: 'chirpee.io',
    script: './server.js'
  }],
  deploy: {
    production: {
        user: 'ubuntu',
        host: 'ec2-13-58-23-169.us-east-2.compute.amazonaws.com',
        key: '~/.ssh/ec2chirpee.pem',
        ref: 'origin/master',
        repo: 'https://github.com/rynoster/sandbox',
        path: '/home/ubuntu/server/chirpee',
        env: {
            NODE_ENV: "dev"
        },
        env_prod : {
            NODE_ENV: "prod"
        },
        
        'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --env prod'

        }
  }
}