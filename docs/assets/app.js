const DEFAULT_API_BASE_URL = "https://webgbert.onrender.com";
const API_STORAGE_KEY = "manifesto_api_base_url";
const LANGUAGE_STORAGE_KEY = "manifesto_ui_language";

const translations = {
  en: {
    page_title: "Comparative Manifesto Policy Analysis",
    eyebrow: "Comparative Policy Intelligence",
    brand_name: "Manifesto Policy Analysis Interface",
    hero_kicker: "Research Interface",
    hero_title: "Multilingual manifesto analysis for comparative political research.",
    hero_copy:
      "A professional interface for analysing manifesto language in relation to country-year context, macroeconomic structure, and cross-national policy variation.",
    meta_1_label: "Focus",
    meta_1_text: "Political text classification with structural context.",
    meta_2_label: "Inputs",
    meta_2_text: "Manifesto text, country selection, and year selection.",
    meta_3_label: "Framework",
    meta_3_text: "Macro indicators are applied automatically during inference.",
    input_kicker: "Input",
    input_title: "Inference Input",
    input_copy:
      "Submit a manifesto sentence or policy statement. Structural indicators are applied automatically according to the selected country and year.",
    text_label: "Policy Text",
    text_placeholder:
      "The government will stabilize the labour market through training, targeted fiscal support, and industrial coordination.",
    country_label: "Country",
    year_label: "Year",
    predict_button: "Run Analysis",
    result_kicker: "Output",
    result_title: "Analytical Output",
    result_copy:
      "The interface reports leading predicted policy categories together with the structural variables used for the current inference.",
    empty_state: "Results will appear here after the analysis is completed.",
    top_predictions: "Top Predictions",
    macro_title: "Macro Variables from add/",
    footer_label: "Participating Institutions",
    contact_footer_html:
      '<p>Xinhe Li, tenured lecturer, Otaru University of Commerce</p><p>Email: <a href="mailto:lixinhe@res.otaru-uc.ac.jp">lixinhe@res.otaru-uc.ac.jp</a></p><p>Address: Room 456 (Li Lab), Building 4, 3-5-21 Midori, Otaru, Hokkaido 047-8501, Japan</p>',
    footer_meta: "Thanks for Manifesto project. Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center/Göttingen: Institute for Democracy Research (IfDem).<br>This website is for academic and educational use only. ",
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
    hero_kicker: "研究インターフェース",
    hero_title: "比較政治研究のための多言語マニフェスト分析。",
    hero_copy:
      "本インターフェースは、国・年コンテクスト、マクロ経済構造、国家間の政策差異との関係からマニフェスト文を分析します。",
    meta_1_label: "焦点",
    meta_1_text: "構造的文脈を考慮した政治テキスト分類。",
    meta_2_label: "入力",
    meta_2_text: "マニフェスト文、国選択、年選択。",
    meta_3_label: "枠組み",
    meta_3_text: "マクロ指標は推論時に自動適用されます。",
    input_kicker: "入力",
    input_title: "推論入力",
    input_copy:
      "マニフェスト文または政策文を入力してください。構造指標は選択した国と年に応じて自動適用されます。",
    text_label: "政策テキスト",
    text_placeholder:
      "政府は、訓練、重点的な財政支援、産業政策の連携によって労働市場を安定化させる。",
    country_label: "国",
    year_label: "年",
    predict_button: "分析を実行",
    result_kicker: "出力",
    result_title: "分析結果",
    result_copy:
      "主要な予測政策カテゴリと、今回の推論で用いられた構造変数を表示します。",
    empty_state: "分析を実行すると、ここに結果が表示されます。",
    top_predictions: "上位予測カテゴリ",
    macro_title: "add/ から取得したマクロ変数",
    footer_label: "参加機関",
    contact_footer_html:
      '<p>李昕翮 講師 小樽商科大学 </p><p>メール：<a href="mailto:lixinhe@res.otaru-uc.ac.jp">lixinhe@res.otaru-uc.ac.jp</a></p><p>アクセス：〒047-8501 北海道小樽市緑3丁目5番21号　4号館　456号室</p>',
    footer_meta: "本サイトは、Manifestoプロジェクト（Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center / Göttingen: Institute for Democracy Research (IfDem)）に謝意を表します。<br>本ウェブサイトは、研究および教育目的のみに使用されています。",
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
    const key = node.dataset.i18n;
    if (key === "footer_meta") {
      node.innerHTML = t(key);
      node.style.fontSize = ""; // restore default
      node.style.opacity = "1";
      node.style.marginTop = "20px";
      node.style.textAlign = "left";
      node.style.display = "block";
      node.style.width = "100vw";
      node.style.maxWidth = "100vw";
      node.style.position = "relative";
      node.style.left = "50%";
      node.style.transform = "translateX(-50%)";

      // move it under contact section
      const contact = document.querySelector('[data-i18n-html="contact_footer_html"]');
      if (contact && contact.parentElement && node.parentElement !== contact.parentElement) {
        contact.parentElement.appendChild(node);
      }
      return;
    }
    node.textContent = t(key);
  });


  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    node.innerHTML = t(node.dataset.i18nHtml);
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
