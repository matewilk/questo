#**Questo** (server)

###Docker configuration (currently only for local development):
- docker-compose.yml - contains 3 services
  - server - node.js app server
  - dybamodb - local version od dynamodb instance
  - dynamodb_create_table - container running aws-cli
    - this container installs aws-cli
    - and runs aws cli-against dynamodb container (to create db table)
    - uses `create_dynamodb_local.sh` to create the db table
    - (this container might be replaced by seeding the db on local db connect)
    
###For Dev development:
- `docker:dev:start` - starts the `start` npm script inside docker container
- `docker:dev:stop` - stops dev containers
- the app is exposed to `http://localhsot:4000`

###For Dev Debugging:
- run `docker:dev:start` like for development
  - `docker-compose.yaml` exposes `9229` nodemon default debug port
  - `start` npm script passes `--inspect=0.0.0.0` to `nodemon` which allows to connect from any address
- use WebStorm `Attach to Node.js/Chrome` config with
  - `reconnect automatically` option
  - port `9229` which is a default `nodemon --inspect` port

###Running on Kubernetes locally (via Minikube):
- prerequisites (for your local machine)
  - (install `docker` - for building images)
  - install `kubectl` - to interact with `minikube env`
  - install `minikube` - to run Kubernetes locally
  - install `minikube tunnel` - to be able to get `external IP` from the `questo-server-service` (see terraform config [file](tf/kubernetes/main.tf))
  - install `terraform` - to deploy infrastructure to Kubernetes (minikube) cluster
- switch to minikube docker env
  - run `minikube docker-env` (or `eval $(minikube -p minikube docker-env)`)
- build images (from the root dir):
  - for `questo server`:
    - run `docker build -t questo-server-image -f docker/app/Dockerfile .`
  - for creating `dynamodb` table and `admin` user:
    - run `docker build -t dynamodb-create-table-image -f docker/dynamodb/Dockerfile-dynamodb-table docker/dynamodb --build-arg ADMIN_PASSWD=admin123 --build-arg DYNAMODB_URL=http://questo-dynamodb-service:8000 --build-arg AWS_REGION=local`
      - `questo-dynamodb-service` is a url to the service that connects to `dynamodb` pod to execute `aws cli` commands
- start `minikube tunnel` in a separate terminal window
- run Kubernetes cluster
  - go to `./tf/kubernetes` directory:
    - run `terraform init` - to initialise `terraform`
    - run `terraform plan/apply` - to deploy the infrastructure to the local Minikube cluster
- the service should now be running in Minikube
- validate by sending a request using `questo-server-service` external IP address
  - display all services in namespace by running `kubectl get all -n minikube-local-ns`
    - copy/paste `EXTERNAL-IP` of `questo-server-service`
    - use it with for example `Postman` to send a request to the service on port `4000`
