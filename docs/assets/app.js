const DEFAULT_API_BASE_URL = "https://webgbert.onrender.com";
const API_STORAGE_KEY = "manifesto_api_base_url";
const LANGUAGE_STORAGE_KEY = "manifesto_ui_language";

const translations = {
  en: {
    page_title: "Comparative Manifesto Policy Analysis",
    eyebrow: "Comparative Policy Intelligence",
    hero_title: "Manifesto Policy Analysis Interface",
    hero_copy:
      "A research-facing interface for multilingual manifesto analysis, combining text interpretation with macro-structural indicators across countries and years.",
    header_note_label: "Interface Mode",
    header_note_value: "Academic and policy research use",
    intro_kicker: "Research Scope",
    intro_text:
      "This interface is designed for professional and scholarly presentation. It estimates policy category distributions from manifesto text while incorporating country-specific and year-specific macro context.",
    intro_kicker_2: "Operational Status",
    intro_text_2:
      "The public interface connects to a deployed inference API. Advanced users may still override the API endpoint for staging or verification.",
    backend_title: "Connected API",
    backend_copy:
      "General visitors do not need to configure anything. The page is connected to the deployed online inference service by default.",
    api_label: "Current API",
    advanced_summary: "Advanced Settings: change backend endpoint",
    api_input_label: "Backend API Base URL",
    save_api: "Save Endpoint",
    check_api: "Verify Connection",
    input_title: "Inference Input",
    input_copy:
      "Users provide manifesto text. Macro indicators are automatically retrieved by the backend from the `add/` dataset using the selected country and year.",
    text_label: "Policy Text",
    text_placeholder:
      "The government will stabilize the labour market through training, targeted fiscal support, and industrial coordination.",
    country_label: "Country",
    year_label: "Year",
    predict_button: "Run Analysis",
    result_title: "Analytical Output",
    result_copy:
      "The interface reports the leading predicted policy categories together with the structural variables used for the current inference.",
    empty_state: "Once the connection is verified, analytical results will appear here.",
    top_predictions: "Top Predictions",
    macro_title: "Macro Variables from add/",
    footer_kicker: "Participating Institutions",
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
    hero_title: "マニフェスト政策分析インターフェース",
    hero_copy:
      "多言語マニフェスト分析のための研究向けインターフェースです。テキスト解釈と各国・各年のマクロ構造指標を組み合わせて分析を行います。",
    header_note_label: "インターフェース種別",
    header_note_value: "学術・政策研究向け",
    intro_kicker: "研究対象",
    intro_text:
      "本インターフェースは、専門的かつ学術的な提示を目的として設計されています。マニフェスト文の政策カテゴリ分布を、国別・年別のマクロ文脈を踏まえて推定します。",
    intro_kicker_2: "運用状況",
    intro_text_2:
      "公開インターフェースはデプロイ済み推論 API に接続されています。検証やステージングのために、高度な設定から接続先を変更することもできます。",
    backend_title: "接続中の API",
    backend_copy:
      "通常の利用者は追加設定を行う必要はありません。ページは既定で公開済みのオンライン推論サービスに接続されています。",
    api_label: "現在の API",
    advanced_summary: "詳細設定: バックエンド接続先の変更",
    api_input_label: "バックエンド API Base URL",
    save_api: "接続先を保存",
    check_api: "接続を確認",
    input_title: "推論入力",
    input_copy:
      "利用者はマニフェスト文を入力します。マクロ指標は、選択した国と年に基づいてバックエンドが `add/` データセットから自動取得します。",
    text_label: "政策テキスト",
    text_placeholder:
      "政府は、訓練、重点的な財政支援、産業政策の連携によって労働市場を安定化させる。",
    country_label: "国",
    year_label: "年",
    predict_button: "分析を実行",
    result_title: "分析結果",
    result_copy:
      "本インターフェースは、主要な予測政策カテゴリと、今回の推論で用いられた構造変数を表示します。",
    empty_state: "接続確認後、この領域に分析結果が表示されます。",
    top_predictions: "上位予測カテゴリ",
    macro_title: "add/ から取得したマクロ変数",
    footer_kicker: "参加機関",
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
const apiBaseUrlLabel = document.getElementById("api-base-url-label");
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
  const baseUrl = getBaseUrl();
  apiBaseUrlLabel.textContent = baseUrl || t("api_missing");
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
