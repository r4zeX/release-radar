const fallbackClusterState = {
  clusterStatus: "Кластер доступен",
  environments: [
    {
      name: "dev",
      status: "Готово",
      statusClass: "healthy",
      version: "0.1.0-dev",
      readyPods: "3 / 3",
      deployedAt: "тестовые данные",
    },
    {
      name: "stage",
      status: "Ожидает deploy",
      statusClass: "warning",
      version: "—",
      readyPods: "0 / 3",
      deployedAt: "ещё не развёрнуто",
    },
  ],
};

function renderClusterState(clusterState) {
  const environments = clusterState.environments;
  const readyPods = environments.reduce((total, environment) => {
    const [ready] = environment.readyPods.split(" /");
    return total + Number(ready);
  }, 0);

  document.querySelector("#cluster-status").textContent = clusterState.clusterStatus;
  document.querySelector("#environment-count").textContent = environments.length;
  document.querySelector("#workload-count").textContent = environments.length * 3;
  document.querySelector("#ready-pods").textContent = readyPods;

  const grid = document.querySelector("#environment-grid");
  const template = document.querySelector("#environment-template");
  grid.replaceChildren();

  for (const environment of environments) {
    const card = template.content.cloneNode(true);
    card.querySelector(".environment-name").textContent = environment.name;

    const status = card.querySelector(".environment-status");
    status.textContent = environment.status;
    status.classList.add(environment.statusClass);

    card.querySelector(".environment-version").textContent = environment.version;
    card.querySelector(".environment-pods").textContent = environment.readyPods;
    card.querySelector(".environment-deployed-at").textContent = environment.deployedAt;
    grid.append(card);
  }
}

async function loadClusterState() {
  try {
    const response = await fetch("http://localhost:8000/api/environments");

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const clusterState = await response.json();
    renderClusterState(clusterState);
  } catch (error) {
    console.warn("Backend is unavailable; using fallback data.", error);
    renderClusterState({
      ...fallbackClusterState,
      clusterStatus: "Backend недоступен: показаны тестовые данные",
    });
  }
}

document.querySelector("#refresh-button").addEventListener("click", loadClusterState);

document.querySelector("#deploy-stage-button").addEventListener("click", async () => {
  const deployButton = document.querySelector("#deploy-stage-button");
  deployButton.disabled = true;
  deployButton.textContent = "Deploy выполняется…";

  try {
    const response = await fetch("http://localhost:8000/api/environments/stage/deploy", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    await loadClusterState();
  } catch (error) {
    console.error("Deploy simulation failed.", error);
    alert("Не удалось выполнить симуляцию deploy. Проверь backend.");
  } finally {
    deployButton.disabled = false;
    deployButton.textContent = "Симулировать deploy stage";
  }
});

loadClusterState();
