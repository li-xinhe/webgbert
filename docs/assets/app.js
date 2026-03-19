const apiBaseUrlInput = document.getElementById("api-base-url");
const saveApiButton = document.getElementById("save-api-button");
const checkApiButton = document.getElementById("check-api-button");
const apiMessage = document.getElementById("api-message");
const countrySelect = document.getElementById("country-select");
const yearSelect = document.getElementById("year-select");
const textInput = document.getElementById("text-input");
const predictButton = document.getElementById("predict-button");
const formMessage = document.getElementById("form-message");
const emptyState = document.getElementById("empty-state");
const resultContent = document.getElementById("result-content");
const predictionList = document.getElementById("prediction-list");
const macroGrid = document.getElementById("macro-grid");

const API_STORAGE_KEY = "manifesto_api_base_url";
let yearsByCountry = {};

function normalizeBaseUrl(rawValue) {
  return String(rawValue || "").trim().replace(/\/+$/, "");
}

function getBaseUrl() {
  return normalizeBaseUrl(apiBaseUrlInput.value || localStorage.getItem(API_STORAGE_KEY) || "");
}

function setApiMessage(message, isError = false) {
  apiMessage.textContent = message;
  apiMessage.style.color = isError ? "#a6451b" : "";
}

function setFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.style.color = isError ? "#a6451b" : "";
}

function buildApiUrl(path) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error("请先填写后端 API Base URL。");
  }
  return `${baseUrl}${path}`;
}

function fillYears(country) {
  const years = yearsByCountry[country] || [];
  yearSelect.innerHTML = "";

  years
    .slice()
    .sort((a, b) => b - a)
    .forEach((year) => {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      yearSelect.appendChild(option);
    });
}

function renderPredictions(predictions) {
  predictionList.innerHTML = "";

  predictions.forEach((item) => {
    const card = document.createElement("div");
    card.className = "prediction-card";
    card.innerHTML = `
      <div class="prediction-rank">${item.rank}</div>
      <div class="prediction-label">Category ${item.label}</div>
      <div class="prediction-probability">${(item.probability * 100).toFixed(2)}%</div>
    `;
    predictionList.appendChild(card);
  });
}

function renderMacros(macroValues) {
  macroGrid.innerHTML = "";

  Object.entries(macroValues).forEach(([name, info]) => {
    const card = document.createElement("div");
    card.className = "macro-card";
    card.innerHTML = `
      <p class="macro-name">${name}</p>
      <p class="macro-meta">原始值: ${Number(info.raw).toFixed(4)}</p>
      <p class="macro-meta">标准化后: ${Number(info.standardized).toFixed(4)}</p>
      <p class="macro-meta">来源: ${info.source}</p>
    `;
    macroGrid.appendChild(card);
  });
}

async function loadOptions() {
  setFormMessage("正在加载国家和年份选项...");
  const response = await fetch(buildApiUrl("/api/options"));
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "加载选项失败。");
  }

  yearsByCountry = payload.yearsByCountry || {};
  countrySelect.innerHTML = "";

  (payload.countries || []).forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  countrySelect.value = payload.defaultCountry || payload.countries?.[0] || "";
  fillYears(countrySelect.value);
  setFormMessage("");
}

async function checkConnection() {
  setApiMessage("正在检查后端连接...");
  const response = await fetch(buildApiUrl("/api/health"));
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "后端连接失败。");
  }

  setApiMessage(`连接成功：${payload.countries} 个国家，${payload.labels} 个标签`);
  await loadOptions();
}

function saveBaseUrl() {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error("请输入后端地址。");
  }
  localStorage.setItem(API_STORAGE_KEY, baseUrl);
  apiBaseUrlInput.value = baseUrl;
  setApiMessage("后端地址已保存。");
}

saveApiButton.addEventListener("click", () => {
  try {
    saveBaseUrl();
  } catch (error) {
    setApiMessage(error.message, true);
  }
});

checkApiButton.addEventListener("click", async () => {
  try {
    saveBaseUrl();
    await checkConnection();
  } catch (error) {
    setApiMessage(error.message, true);
  }
});

countrySelect.addEventListener("change", () => fillYears(countrySelect.value));

predictButton.addEventListener("click", async () => {
  const text = textInput.value.trim();
  const country = countrySelect.value;
  const year = Number(yearSelect.value);

  if (!text) {
    setFormMessage("请先输入一段政策文本。", true);
    return;
  }

  predictButton.disabled = true;
  setFormMessage("模型正在预测，请稍候...");

  try {
    const response = await fetch(buildApiUrl("/api/predict"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        country,
        year,
        top_k: 5,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Prediction failed.");
    }

    renderPredictions(payload.predictions || []);
    renderMacros(payload.macro_values || {});
    emptyState.classList.add("hidden");
    resultContent.classList.remove("hidden");
    setFormMessage(`已完成预测：${payload.country} ${payload.year}`);
  } catch (error) {
    setFormMessage(error.message, true);
  } finally {
    predictButton.disabled = false;
  }
});

apiBaseUrlInput.value = localStorage.getItem(API_STORAGE_KEY) || "";

if (apiBaseUrlInput.value) {
  checkConnection().catch((error) => {
    setApiMessage(error.message, true);
  });
}
