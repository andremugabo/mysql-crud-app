# Full-Stack CRUD Application Deployment (PostgreSQL)

## Overview

This repository contains a **PostgreSQL CRUD application** with:

* **Backend:** Node.js (Express) API using `pg` for PostgreSQL
* **Frontend:** React (Vite) app served via NGINX
* **Database:** PostgreSQL

All components are **containerized** and can be deployed locally with Docker Compose or to the cloud using pre-built images.

---

## Project Structure

```
devops/
├── backend/                  # Node.js API
├── frontend/                 # React app
├── k8s/                      # Kubernetes manifests
├── nginx/                    # NGINX configuration for frontend
├── docker-compose.dev.yml    # Local development compose (with builds)
├── docker-compose.yml        # Production compose (images only)
└── .github/
    └── workflows/            # GitHub Actions workflows
```

---

## Local Development Setup

1. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Start the application locally:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

* **Backend** waits for PostgreSQL to be healthy.
* **Frontend** waits for the backend to be ready.
* PostgreSQL data persists in a Docker volume (`postgres-data`).

---

## CI/CD

GitHub Actions workflows automatically:

* Build Docker images for **backend** and **frontend**.
* Tag images with `latest` and commit SHA.
* Push images to **Docker Hub** under your username `andremugabo`.

Workflow triggers on changes to `backend/**` or `frontend/**`.

### Pushing Docker Images via GitHub Actions

1. **Automatic Trigger:**

```bash
git add .
git commit -m "Update backend/frontend"
git push origin main
```

* Workflow detects changes in `backend/` or `frontend/`.
* Docker images pushed to Docker Hub:

| Image                  | Tags                          |
| ---------------------- | ----------------------------- |
| `andremugabo/backend`  | `latest`, `${{ github.sha }}` |
| `andremugabo/frontend` | `latest`, `${{ github.sha }}` |

2. **Manual Trigger:**

* Go to **Actions → Build and Push Docker Images**.
* Click **Run workflow → main branch**.

3. **Verify on Docker Hub:**

* Go to [https://hub.docker.com/r/andremugabo](https://hub.docker.com/r/andremugabo).

4. **Test pre-built images locally:**

```bash
docker pull andremugabo/backend:latest
docker pull andremugabo/frontend:latest
docker-compose up
```

---

## Production Deployment

### Docker Compose

1. Copy `docker-compose.yml` to your production server.
2. Set environment variables in a `.env` file (backend DB credentials, etc.).
3. Pull the latest images and start services:

```bash
docker-compose pull
docker-compose up -d
```

> **Note:** Backend connects to PostgreSQL; ensure `.env` has `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `DB_TABLENAME`.

### Kubernetes

1. Apply manifests in `k8s/`:

```bash
kubectl apply -f k8s/
```

2. Ensure secrets and ConfigMaps are configured correctly:

   * **DB credentials** via Kubernetes Secrets
   * **Frontend API URL** via ConfigMap

3. Expose frontend via LoadBalancer or NodePort.

---

## Cloud URLs

* **Docker Compose deployment:** `[Your URL, e.g., http://your-server-ip]`
* **Kubernetes deployment:** `[Your LoadBalancer URL]`

---

## Notes

* Keep **Docker Hub credentials** in GitHub Secrets:

  * `DOCKER_USERNAME = andremugabo`
  * `DOCKER_PASSWORD = <your password>`

* Workflows use commit SHA tagging for traceability.

* Local `.env` files are **not committed** for security.

---

## Report

**Final Deployment Report Content:**

* Architecture overview
* Dockerization strategy
* CI/CD workflow
* Local and cloud deployment steps
* Screenshots or logs demonstrating working services

---

### Screenshot / Diagram

![mermaid diagram](./assets/image/ChatGPT%20Image%20Aug%2025,%202025,%2002_28_45%20PM.png)


