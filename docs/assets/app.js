const DEFAULT_API_BASE_URL = "https://webgbert.onrender.com";
const API_STORAGE_KEY = "manifesto_api_base_url";
const LANGUAGE_STORAGE_KEY = "manifesto_ui_language";

const translations = {
  en: {
    page_title: "Comparative Manifesto Policy Analysis",
    eyebrow: "Comparative Policy Intelligence",
    brand_name: "Manifesto Policy Analysis Interface",
    nav_tool: "Analysis Tool",
    nav_authors: "Principal Authors",
    nav_contact: "Contact",
    hero_kicker: "Policy Inference Platform",
    hero_title: "Multilingual manifesto classification with country-year context.",
    hero_copy: "A research-grade interface for cross-national political text analysis.",
    meta_1_label: "Function",
    meta_1_text: "Policy text inference with structural variables.",
    meta_2_label: "Input",
    meta_2_text: "Text, country, and year.",
    meta_3_label: "Context",
    meta_3_text: "Macroeconomic indicators applied automatically.",
    input_kicker: "Analysis Tool",
    input_title: "Inference Console",
    input_copy: "Enter a policy statement and run model inference.",
    text_label: "Policy Text",
    text_placeholder:
      "The government will stabilize the labour market through training, targeted fiscal support, and industrial coordination.",
    country_label: "Country",
    year_label: "Year",
    predict_button: "Run Analysis",
    result_kicker: "Output",
    result_title: "Model Output",
    result_copy: "Top policy categories and the variables used for inference.",
    empty_state: "Results appear after inference.",
    top_predictions: "Top Predictions",
    macro_title: "Macro Variables",
    authors_label: "Principal Authors",
    authors_title: "Research Team",
    authors_copy: "Author information can be placed here for the public release.",
    contact_label: "Contact",
    contact_title: "Research Enquiries",
    contact_copy: "Add institutional contact details here for correspondence and collaboration.",
    footer_label: "Participating Institutions",
    footer_meta: "Research interface for comparative manifesto and policy analysis.",
    api_missing: "No backend endpoint is currently available.",
    api_saved: "Backend endpoint saved.",
    api_saved_error: "Please enter a backend endpoint.",
    api_checking: "Verifying backend connection...",
    api_connected: ({ countries, labels }) => `Connection established: ${countries} countries, ${labels} labels`,
    api_failed: "Backend connection failed.",
    form_loading: "Loading countries and years...",
    form_loading_failed: "Failed to load options.",
    form_text_required: "Please enter policy text before running analysis.",
    form_predicting: "Running model inference...",
    form_done: ({ country, year }) => `Analysis completed: ${country} ${year}`,
    prediction_failed: "Prediction failed.",
    macro_raw: "Raw value",
    macro_standardized: "Standardized",
    macro_source: "Source",
    prediction_category: (label) => `Category ${label}`,
  },
  ja: {
    page_title: "マニフェスト政策分析インターフェース",
    eyebrow: "比較政策インテリジェンス",
    brand_name: "マニフェスト政策分析インターフェース",
    nav_tool: "分析ツール",
    nav_authors: "主要執筆者",
    nav_contact: "連絡先",
    hero_kicker: "政策推論プラットフォーム",
    hero_title: "国・年コンテクストを組み込んだ多言語マニフェスト分類。",
    hero_copy: "比較政治テキスト分析のための研究用インターフェースです。",
    meta_1_label: "機能",
    meta_1_text: "構造変数を用いた政策テキスト推論。",
    meta_2_label: "入力",
    meta_2_text: "テキスト、国、年。",
    meta_3_label: "文脈",
    meta_3_text: "マクロ経済指標を自動適用。",
    input_kicker: "分析ツール",
    input_title: "推論コンソール",
    input_copy: "政策文を入力してモデル推論を実行します。",
    text_label: "政策テキスト",
    text_placeholder:
      "政府は、訓練、重点的な財政支援、産業政策の連携によって労働市場を安定化させる。",
    country_label: "国",
    year_label: "年",
    predict_button: "分析を実行",
    result_kicker: "出力",
    result_title: "モデル出力",
    result_copy: "主要カテゴリと推論に用いた変数を表示します。",
    empty_state: "推論後に結果が表示されます。",
    top_predictions: "上位予測カテゴリ",
    macro_title: "マクロ変数",
    authors_label: "主要執筆者",
    authors_title: "研究チーム",
    authors_copy: "公開版ではここに主要著者情報を掲載できます。",
    contact_label: "連絡先",
    contact_title: "問い合わせ",
    contact_copy: "連絡先と共同研究窓口をここに掲載できます。",
    footer_label: "参加機関",
    footer_meta: "比較マニフェスト・政策分析のための研究インターフェース。",
    api_missing: "利用可能なバックエンド接続先がありません。",
    api_saved: "バックエンド接続先を保存しました。",
    api_saved_error: "バックエンド接続先を入力してください。",
    api_checking: "バックエンド接続を確認しています...",
    api_connected: ({ countries, labels }) => `接続成功: ${countries} カ国、${labels} ラベル`,
    api_failed: "バックエンド接続に失敗しました。",
    form_loading: "国と年の選択肢を読み込んでいます...",
    form_loading_failed: "選択肢の読み込みに失敗しました。",
    form_text_required: "分析を実行する前に政策テキストを入力してください。",
    form_predicting: "モデル推論を実行しています...",
    form_done: ({ country, year }) => `分析完了: ${country} ${year}`,
    prediction_failed: "予測に失敗しました。",
    macro_raw: "原値",
    macro_standardized: "標準化後",
    macro_source: "出所",
    prediction_category: (label) => `カテゴリ ${label}`,
  },
};

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
const langButtons = Array.from(document.querySelectorAll(".lang-button"));

let yearsByCountry = {};
let currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";

function t(key, params) {
  const table = translations[currentLanguage] || translations.en;
  const value = table[key];
  if (typeof value === "function") {
    return value(params || {});
  }
  return value ?? key;
}

function setLanguage(lang) {
  currentLanguage = translations[lang] ? lang : "en";
  localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage === "ja" ? "ja" : "en";
  document.title = t("page_title");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });

  langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentLanguage);
  });

  refreshApiLabel();
}

function normalizeBaseUrl(rawValue) {
  return String(rawValue || "").trim().replace(/\/+$/, "");
}

function getBaseUrl() {
  return normalizeBaseUrl(
    apiBaseUrlInput.value || localStorage.getItem(API_STORAGE_KEY) || DEFAULT_API_BASE_URL
  );
}

function setApiMessage(message, isError = false) {
  apiMessage.textContent = message;
  apiMessage.style.color = isError ? "#8f2437" : "";
}

function setFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.style.color = isError ? "#8f2437" : "";
}

function buildApiUrl(path) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error(t("api_missing"));
  }
  return `${baseUrl}${path}`;
}

function refreshApiLabel() {
  return getBaseUrl();
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
      <div class="prediction-label">${t("prediction_category", item.label)}</div>
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
      <p class="macro-meta">${t("macro_raw")}: ${Number(info.raw).toFixed(4)}</p>
      <p class="macro-meta">${t("macro_standardized")}: ${Number(info.standardized).toFixed(4)}</p>
      <p class="macro-meta">${t("macro_source")}: ${info.source}</p>
    `;
    macroGrid.appendChild(card);
  });
}

async function loadOptions() {
  setFormMessage(t("form_loading"));
  const response = await fetch(buildApiUrl("/api/options"));
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || t("form_loading_failed"));
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
  setApiMessage(t("api_checking"));
  const response = await fetch(buildApiUrl("/api/health"));
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || t("api_failed"));
  }

  setApiMessage(t("api_connected", { countries: payload.countries, labels: payload.labels }));
  await loadOptions();
}

function saveBaseUrl() {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error(t("api_saved_error"));
  }
  localStorage.setItem(API_STORAGE_KEY, baseUrl);
  apiBaseUrlInput.value = baseUrl;
  refreshApiLabel();
  setApiMessage(t("api_saved"));
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
    setFormMessage(t("form_text_required"), true);
    return;
  }

  predictButton.disabled = true;
  setFormMessage(t("form_predicting"));

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
      throw new Error(payload.error || t("prediction_failed"));
    }

    renderPredictions(payload.predictions || []);
    renderMacros(payload.macro_values || {});
    emptyState.classList.add("hidden");
    resultContent.classList.remove("hidden");
    setFormMessage(t("form_done", { country: payload.country, year: payload.year }));
  } catch (error) {
    setFormMessage(error.message, true);
  } finally {
    predictButton.disabled = false;
  }
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

apiBaseUrlInput.value = localStorage.getItem(API_STORAGE_KEY) || DEFAULT_API_BASE_URL;
setLanguage(currentLanguage);

checkConnection().catch((error) => {
  setApiMessage(error.message, true);
});
