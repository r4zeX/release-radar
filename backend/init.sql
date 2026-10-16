CREATE TABLE IF NOT EXISTS environments (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    status_class TEXT NOT NULL,
    version TEXT NOT NULL,
    ready_pods TEXT NOT NULL,
    deployed_at TEXT NOT NULL
);

INSERT INTO environments (name, status, status_class, version, ready_pods, deployed_at)
VALUES
    ('dev', 'Готово', 'healthy', '0.1.0-dev', '3 / 3', 'локальная база'),
    ('stage', 'Ожидает deploy', 'warning', '—', '0 / 3', 'ещё не развёрнуто')
ON CONFLICT (name) DO NOTHING;
