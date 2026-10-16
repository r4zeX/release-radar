# Release Radar

Release Radar — учебный проект: панель состояния Kubernetes-кластера и его сущностей.

На первом этапе проект работает без Docker и Kubernetes. Frontend показывает тестовое состояние окружений. Позже он будет получать реальные данные от FastAPI, а backend — из Kubernetes API.

## Структура

```text
frontend/  # статическая страница панели
backend/   # FastAPI-приложение и его зависимости
backend/init.sql  # таблица и начальные данные PostgreSQL
```

## Локальный запуск

Сначала создай виртуальное окружение и установи зависимости backend:

```bash
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
```

Создай и заполни базу:

```bash
/opt/homebrew/opt/postgresql@16/bin/createdb release_radar
/opt/homebrew/opt/postgresql@16/bin/psql -d release_radar -f backend/init.sql
```

Запусти backend в первом терминале:

```bash
.venv/bin/uvicorn app.main:app --app-dir backend --reload
```

Проверь его отдельно: <http://localhost:8000/health>. Ответ подтвердит, что backend подключился к PostgreSQL.

Во втором терминале запусти frontend:

```bash
python3 -m http.server 8080 --directory frontend
```

После запуска открой <http://localhost:8080>. Frontend отправит запрос в backend по адресу <http://localhost:8000/api/environments>.

Кнопка «Симулировать deploy stage» отправляет `POST`-запрос в FastAPI. Backend обновляет запись `stage` в PostgreSQL, а frontend повторно читает API и показывает новое состояние.

## Будущая цепочка данных

```text
Browser → Frontend → FastAPI → PostgreSQL
                       └────→ Kubernetes API (позже)
```
