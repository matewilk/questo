terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.65.0"
    }

    local = {
      source  = "hashicorp/local"
      version = "2.1.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.6.1"
    }
  }

  required_version = ">= 1.0.10"
}
