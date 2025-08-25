# Full-Stack CRUD Application Deployment

## Overview
This repository contains a MySQL/MariaDB CRUD application with Node.js backend and React frontend, containerized and deployed via Docker Compose and Kubernetes.

## Local Setup
1. Copy `.env.example` to `.env` in backend and frontend.
2. Run `docker-compose -f docker-compose.dev.yml up --build`.

## CI/CD
GitHub Actions build and push images on push to main.

## Production Deployment
- Docker Compose: Copy docker-compose.yml to server, set env vars, run `docker-compose up`.
- Kubernetes: Apply k8s/ manifests to a cluster.

## Cloud URLs
- Docker Compose: [Your URL, e.g., http://your-ec2-ip]
- Kubernetes: [Your LoadBalancer URL]

## Report
[Include your final deployment report here or in a separate doc.]