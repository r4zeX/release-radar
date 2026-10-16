import os

import psycopg
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row


app = FastAPI(title="Release Radar API", version="0.1.0")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql:///release_radar")

# На локальном этапе frontend работает на :8080, а backend — на :8000.
# CORS разрешает браузеру сделать запрос между этими двумя адресами.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    with psycopg.connect(DATABASE_URL) as connection:
        connection.execute("SELECT 1")

    return {"status": "ok", "database": "connected"}


@app.get("/api/environments")
def get_environments() -> dict[str, object]:
    """Возвращает окружения из PostgreSQL.

    Когда появится k3s, этот endpoint дополнительно будет читать реальные
    namespaces, Deployments и Pods через Kubernetes API.
    """
    query = """
        SELECT
            name,
            status,
            status_class AS "statusClass",
            version,
            ready_pods AS "readyPods",
            deployed_at AS "deployedAt"
        FROM environments
        ORDER BY id
    """

    with psycopg.connect(DATABASE_URL, row_factory=dict_row) as connection:
        environments = connection.execute(query).fetchall()

    return {
        "clusterStatus": "PostgreSQL подключён",
        "environments": environments,
    }


@app.post("/api/environments/{environment_name}/deploy")
def simulate_deploy(environment_name: str) -> dict[str, str]:
    """Имитирует успешный deploy окружения.

    Позже вместо обновления строки endpoint будет запускать разрешённый
    Kubernetes workflow или получать статус уже выполненного rollout.
    """
    query = """
        UPDATE environments
        SET
            status = 'Готово',
            status_class = 'healthy',
            version = '0.1.0-stage',
            ready_pods = '3 / 3',
            deployed_at = TO_CHAR(NOW(), 'DD.MM.YYYY HH24:MI')
        WHERE name = %s
        RETURNING name
    """

    with psycopg.connect(DATABASE_URL) as connection:
        deployed_environment = connection.execute(query, (environment_name,)).fetchone()

    if deployed_environment is None:
        raise HTTPException(status_code=404, detail="Environment not found")

    return {"status": "deploy simulated", "environment": deployed_environment[0]}
