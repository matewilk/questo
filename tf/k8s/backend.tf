terraform {
  # run:  terraform init -reconfigure -backend-config=dev.tfbackend
  backend "s3" {}
}
