# release-radar
Release Radar — учебный проект

## Цель

Собрать один небольшой проект и пройти полный путь DevOps: от запуска приложения вручную до контейнеризации, Kubernetes, Helm, CI/CD и мониторинга.

Главная цель — не количество технологий, а понимание связей между ними.

## Идея проекта

Release Radar — панель состояния Kubernetes-кластера и его сущностей.

В будущем приложение будет показывать:

- namespaces и окружения;
- Deployments, StatefulSets, DaemonSets и Pods;
- состояние rollout и health-checks;
- версии Docker-образов;
- Services, Ingress и PVC;
- историю релизов и дополнительную информацию о сервисах.

## Основной стек

### Приложение

- frontend;
- FastAPI backend;
- PostgreSQL;
- API между frontend и backend.

### База и локальный запуск

- Linux;
- shell и терминал;
- Git;
- Python и FastAPI;
- PostgreSQL;
- Docker;
- Docker Compose.

### Kubernetes и инфраструктура

- облачная VM;
- SSH и firewall;
- k3s;
- kubectl;
- Kubernetes namespaces, Deployments, StatefulSets, DaemonSets, Services, Ingress, ConfigMaps, Secrets, PVC, Jobs и CronJobs;
- Helm.

### CI/CD и мониторинг

- GitHub;
- GitHub Actions;
- GitHub Container Registry;
- VictoriaMetrics;
- exporters;
- VMAlert;
- Alertmanager;
- Telegram через webhook.
