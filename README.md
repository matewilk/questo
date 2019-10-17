**Questo**

Docker configuration (currently only for local development):
- docker-compose.yml - contains 3 services
  - server - node.js app server
  - dybamodb - local version od dynamodb instance
  - dynamodb_create_table - container running aws-cli
    - this container installs aws-cli
    - and runs aws cli-against dynamodb container (to create db table)
    - uses `create_dynamodb_local.sh` to create the db table
    - (this container might be replaced by seeding the db on local db connect)
    
For Dev development:
- `start:docker:dev` - starts the `start` npm script inside docker container
- `stop:docker:dev` - stops dev containers
- the app is exposed to `http://localhsot:4000`

For Dev Debugging:
- run `start:docker:dev` like for development
  - `docker-compose.yaml` exposes `9229` nodemon default debug port
  - `start` npm script passes `--inspect=0.0.0.0` to `nodemon` which allows to connect from any address
- use WebStorm `Attach to Node.js/Chrome` config with
  - `reconnect automatically` option
  - port `9229` which is a default `nodemon --inspect` port
