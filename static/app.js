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
const LANGUAGE_STORAGE_KEY = "manifesto_template_language";

let yearsByCountry = {};
let currentLanguage = resolveInitialLanguage();

const translations = {
  en: {
    page_title: "Manifesto Model Demo",
    eyebrow: "Manifesto Policy Classifier",
    hero_title: "Let visitors use the trained model directly",
    hero_copy:
      "Enter a policy sentence, choose a country and year, and the site will automatically read macro variables from add/ and return the model prediction.",
    input_title: "Inference Input",
    input_copy: "Text is entered by the user, while macro variables are loaded automatically.",
    text_label: "Policy Text",
    text_placeholder:
      "For example: The government will stabilize the labour market through training, fiscal support, and industrial policy.",
    country_label: "Country",
    year_label: "Year",
    predict_button: "Run Prediction",
    result_title: "Prediction Result",
    result_copy: "Shows the top 5 categories and the variables used in this inference run.",
    empty_state: "Results will appear here.",
    top_predictions: "Top Predictions",
    macro_title: "Macro Variables From add/",
    form_loading: "Loading countries and years...",
    form_text_required: "Please enter some policy text first.",
    form_predicting: "The model is running inference...",
    form_done: ({ country, year }) => `Prediction completed: ${country} ${year}`,
    init_failed: ({ message }) => `Initialization failed: ${message}`,
    macro_raw: "Raw Value",
    macro_standardized: "Standardized",
    macro_source: "Source",
    prediction_category: (label) => `Category ${label}`,
  },
  ja: {
    page_title: "Manifesto Model Demo",
    eyebrow: "Manifesto Policy Classifier",
    hero_title: "訪問者が学習済みモデルを直接利用できるようにする",
    hero_copy:
      "政策文を入力し、国と年を選ぶと、サイトが add/ からマクロ変数を自動で読み込み、モデル予測を返します。",
    input_title: "推論入力",
    input_copy: "テキストはユーザーが入力し、マクロ変数は自動で読み込まれます。",
    text_label: "政策テキスト",
    text_placeholder:
      "例: 政府は職業訓練、財政支援、産業政策を通じて労働市場を安定化させる。",
    country_label: "国",
    year_label: "年",
    predict_button: "予測を実行",
    result_title: "予測結果",
    result_copy: "上位5カテゴリと今回の推論で使われた変数を表示します。",
    empty_state: "結果はここに表示されます。",
    top_predictions: "上位予測",
    macro_title: "add/ から取得したマクロ変数",
    form_loading: "国と年を読み込んでいます...",
    form_text_required: "先に政策テキストを入力してください。",
    form_predicting: "モデル推論を実行しています...",
    form_done: ({ country, year }) => `予測完了: ${country} ${year}`,
    init_failed: ({ message }) => `初期化に失敗しました: ${message}`,
    macro_raw: "原値",
    macro_standardized: "標準化",
    macro_source: "出所",
    prediction_category: (label) => `カテゴリ ${label}`,
  },
  zh: {
    page_title: "Manifesto Model Demo",
    eyebrow: "Manifesto Policy Classifier",
    hero_title: "让访问者直接调用训练好的模型",
    hero_copy:
      "输入一句政策文本，选择国家和年份，网站会自动从 add/ 中读取宏观变量，并返回模型预测结果。",
    input_title: "推理输入",
    input_copy: "文本由用户输入，宏观变量由系统自动读取。",
    text_label: "政策文本",
    text_placeholder: "例如：政府将通过就业培训、财政支持和产业政策来稳定劳动力市场。",
    country_label: "国家",
    year_label: "年份",
    predict_button: "开始预测",
    result_title: "预测结果",
    result_copy: "显示 Top-5 类别和本次推理实际使用的外界变量。",
    empty_state: "结果会显示在这里。",
    top_predictions: "Top Predictions",
    macro_title: "Macro Variables From add/",
    form_loading: "正在加载国家和年份选项...",
    form_text_required: "请先输入一段政策文本。",
    form_predicting: "模型正在预测，请稍候...",
    form_done: ({ country, year }) => `已完成预测：${country} ${year}`,
    init_failed: ({ message }) => `初始化失败：${message}`,
    macro_raw: "原始值",
    macro_standardized: "标准化后",
    macro_source: "来源",
    prediction_category: (label) => `Category ${label}`,
  },
  de: {
    page_title: "Manifesto Model Demo",
    eyebrow: "Manifesto Policy Classifier",
    hero_title: "Direkter Zugang zum trainierten Modell fuer Besucher",
    hero_copy:
      "Geben Sie einen politikbezogenen Satz ein, waehlen Sie Land und Jahr, und die Website liest automatisch Makrovariablen aus add/ ein und liefert die Modellvorhersage.",
    input_title: "Inference-Eingabe",
    input_copy: "Der Text wird vom Nutzer eingegeben, Makrovariablen werden automatisch geladen.",
    text_label: "Politiktext",
    text_placeholder:
      "Zum Beispiel: Die Regierung wird den Arbeitsmarkt durch Qualifizierung, fiskalische Unterstuetzung und Industriepolitik stabilisieren.",
    country_label: "Land",
    year_label: "Jahr",
    predict_button: "Vorhersage starten",
    result_title: "Vorhersageergebnis",
    result_copy: "Zeigt die Top-5-Kategorien und die fuer diese Inferenz verwendeten Variablen.",
    empty_state: "Die Ergebnisse erscheinen hier.",
    top_predictions: "Top Predictions",
    macro_title: "Macro Variables From add/",
    form_loading: "Laender und Jahre werden geladen...",
    form_text_required: "Bitte geben Sie zuerst einen Politiktext ein.",
    form_predicting: "Das Modell berechnet die Vorhersage...",
    form_done: ({ country, year }) => `Vorhersage abgeschlossen: ${country} ${year}`,
    init_failed: ({ message }) => `Initialisierung fehlgeschlagen: ${message}`,
    macro_raw: "Rohwert",
    macro_standardized: "Standardisiert",
    macro_source: "Quelle",
    prediction_category: (label) => `Kategorie ${label}`,
  },
  fr: {
    page_title: "Manifesto Model Demo",
    eyebrow: "Manifesto Policy Classifier",
    hero_title: "Permettre aux visiteurs d'utiliser directement le modele entraine",
    hero_copy:
      "Saisissez une phrase de politique publique, choisissez le pays et l'annee, puis le site lit automatiquement les variables macro de add/ et renvoie la prediction du modele.",
    input_title: "Entree d'inference",
    input_copy: "Le texte est saisi par l'utilisateur, les variables macro sont chargees automatiquement.",
    text_label: "Texte politique",
    text_placeholder:
      "Par exemple : le gouvernement stabilisera le marche du travail grace a la formation, au soutien budgetaire et a la coordination industrielle.",
    country_label: "Pays",
    year_label: "Annee",
    predict_button: "Lancer la prediction",
    result_title: "Resultat de prediction",
    result_copy: "Affiche les 5 meilleures categories et les variables utilisees pour cette inference.",
    empty_state: "Les resultats s'afficheront ici.",
    top_predictions: "Top Predictions",
    macro_title: "Macro Variables From add/",
    form_loading: "Chargement des pays et des annees...",
    form_text_required: "Veuillez d'abord saisir un texte politique.",
    form_predicting: "Le modele effectue la prediction...",
    form_done: ({ country, year }) => `Prediction terminee : ${country} ${year}`,
    init_failed: ({ message }) => `Echec de l'initialisation : ${message}`,
    macro_raw: "Valeur brute",
    macro_standardized: "Standardise",
    macro_source: "Source",
    prediction_category: (label) => `Categorie ${label}`,
  },
  it: {
    page_title: "Manifesto Model Demo",
    eyebrow: "Manifesto Policy Classifier",
    hero_title: "Consentire ai visitatori di usare direttamente il modello addestrato",
    hero_copy:
      "Inserisci una frase di policy, scegli paese e anno, e il sito leggera automaticamente le variabili macro da add/ restituendo il risultato della previsione.",
    input_title: "Input di inferenza",
    input_copy: "Il testo viene inserito dall'utente, le variabili macro vengono caricate automaticamente.",
    text_label: "Testo politico",
    text_placeholder:
      "Ad esempio: il governo stabilizzera il mercato del lavoro tramite formazione, sostegno fiscale e coordinamento industriale.",
    country_label: "Paese",
    year_label: "Anno",
    predict_button: "Avvia previsione",
    result_title: "Risultato della previsione",
    result_copy: "Mostra le prime 5 categorie e le variabili usate in questa inferenza.",
    empty_state: "I risultati appariranno qui.",
    top_predictions: "Top Predictions",
    macro_title: "Macro Variables From add/",
    form_loading: "Caricamento di paesi e anni...",
    form_text_required: "Inserisci prima un testo politico.",
    form_predicting: "Il modello sta eseguendo la previsione...",
    form_done: ({ country, year }) => `Previsione completata: ${country} ${year}`,
    init_failed: ({ message }) => `Inizializzazione non riuscita: ${message}`,
    macro_raw: "Valore grezzo",
    macro_standardized: "Standardizzato",
    macro_source: "Fonte",
    prediction_category: (label) => `Categoria ${label}`,
  },
  ru: {
    page_title: "Manifesto Model Demo",
    eyebrow: "Manifesto Policy Classifier",
    hero_title: "Дать посетителям прямой доступ к обученной модели",
    hero_copy:
      "Введите политическое предложение, выберите страну и год, и сайт автоматически прочитает макропеременные из add/ и вернет результат модели.",
    input_title: "Входные данные для инференса",
    input_copy: "Текст вводится пользователем, а макропеременные подгружаются автоматически.",
    text_label: "Политический текст",
    text_placeholder:
      "Например: правительство стабилизирует рынок труда с помощью подготовки кадров, бюджетной поддержки и промышленной политики.",
    country_label: "Страна",
    year_label: "Год",
    predict_button: "Запустить прогноз",
    result_title: "Результат прогноза",
    result_copy: "Показывает 5 лучших категорий и переменные, использованные в этом запуске.",
    empty_state: "Здесь появятся результаты.",
    top_predictions: "Основные прогнозы",
    macro_title: "Macro Variables From add/",
    form_loading: "Загрузка стран и годов...",
    form_text_required: "Сначала введите политический текст.",
    form_predicting: "Модель выполняет инференс...",
    form_done: ({ country, year }) => `Прогноз завершен: ${country} ${year}`,
    init_failed: ({ message }) => `Ошибка инициализации: ${message}`,
    macro_raw: "Исходное значение",
    macro_standardized: "Стандартизовано",
    macro_source: "Источник",
    prediction_category: (label) => `Категория ${label}`,
  },
  es: {
    page_title: "Manifesto Model Demo",
    eyebrow: "Manifesto Policy Classifier",
    hero_title: "Permitir que los visitantes usen directamente el modelo entrenado",
    hero_copy:
      "Introduce una frase de politica, elige pais y anio, y el sitio leera automaticamente las variables macro de add/ y devolvera la prediccion del modelo.",
    input_title: "Entrada de inferencia",
    input_copy: "El texto lo introduce el usuario y las variables macro se cargan automaticamente.",
    text_label: "Texto politico",
    text_placeholder:
      "Por ejemplo: el gobierno estabilizara el mercado laboral mediante formacion, apoyo fiscal y politica industrial.",
    country_label: "Pais",
    year_label: "Anio",
    predict_button: "Iniciar prediccion",
    result_title: "Resultado de la prediccion",
    result_copy: "Muestra las 5 categorias principales y las variables usadas en esta inferencia.",
    empty_state: "Los resultados apareceran aqui.",
    top_predictions: "Top Predictions",
    macro_title: "Macro Variables From add/",
    form_loading: "Cargando paises y anios...",
    form_text_required: "Introduce primero un texto politico.",
    form_predicting: "El modelo esta ejecutando la inferencia...",
    form_done: ({ country, year }) => `Prediccion completada: ${country} ${year}`,
    init_failed: ({ message }) => `La inicializacion fallo: ${message}`,
    macro_raw: "Valor bruto",
    macro_standardized: "Estandarizado",
    macro_source: "Fuente",
    prediction_category: (label) => `Categoria ${label}`,
  },
  el: {
    page_title: "Manifesto Model Demo",
    eyebrow: "Manifesto Policy Classifier",
    hero_title: "Να μπορουν οι επισκεπτες να χρησιμοποιουν απευθειας το εκπαιδευμενο μοντελο",
    hero_copy:
      "Εισαγαγετε μια προταση πολιτικης, επιλεξτε χωρα και ετος, και ο ιστοτοπος θα διαβασει αυτοματα μακρο μεταβλητες απο το add/ και θα επιστρεψει την προβλεψη του μοντελου.",
    input_title: "Εισοδος προβλεψης",
    input_copy: "Το κειμενο εισαγεται απο τον χρηστη και οι μακρο μεταβλητες φορτωνονται αυτοματα.",
    text_label: "Πολιτικο κειμενο",
    text_placeholder:
      "Για παραδειγμα: η κυβερνηση θα σταθεροποιησει την αγορα εργασιας μεσω καταρτισης, δημοσιονομικης στηριξης και βιομηχανικης πολιτικης.",
    country_label: "Χωρα",
    year_label: "Ετος",
    predict_button: "Εναρξη προβλεψης",
    result_title: "Αποτελεσμα προβλεψης",
    result_copy: "Δειχνει τις 5 κορυφαιες κατηγοριες και τις μεταβλητες που χρησιμοποιηθηκαν.",
    empty_state: "Τα αποτελεσματα θα εμφανιστουν εδω.",
    top_predictions: "Top Predictions",
    macro_title: "Macro Variables From add/",
    form_loading: "Φορτωση χωρων και ετων...",
    form_text_required: "Εισαγαγετε πρωτα πολιτικο κειμενο.",
    form_predicting: "Το μοντελο εκτελει προβλεψη...",
    form_done: ({ country, year }) => `Η προβλεψη ολοκληρωθηκε: ${country} ${year}`,
    init_failed: ({ message }) => `Η αρχικοποιηση απετυχε: ${message}`,
    macro_raw: "Ακατεργαστη τιμη",
    macro_standardized: "Τυποποιημενο",
    macro_source: "Πηγη",
    prediction_category: (label) => `Κατηγορια ${label}`,
  },
  ko: {
    page_title: "Manifesto Model Demo",
    eyebrow: "Manifesto Policy Classifier",
    hero_title: "방문자가 학습된 모델을 직접 사용할 수 있도록 하기",
    hero_copy:
      "정책 문장을 입력하고 국가와 연도를 선택하면, 사이트가 add/ 에서 거시 변수를 자동으로 읽어 모델 예측을 반환합니다.",
    input_title: "추론 입력",
    input_copy: "텍스트는 사용자가 입력하고, 거시 변수는 자동으로 불러옵니다.",
    text_label: "정책 텍스트",
    text_placeholder:
      "예: 정부는 직업훈련, 재정지원, 산업정책을 통해 노동시장을 안정화할 것이다.",
    country_label: "국가",
    year_label: "연도",
    predict_button: "예측 시작",
    result_title: "예측 결과",
    result_copy: "상위 5개 범주와 이번 추론에 사용된 변수를 보여줍니다.",
    empty_state: "결과가 여기에 표시됩니다.",
    top_predictions: "주요 예측",
    macro_title: "Macro Variables From add/",
    form_loading: "국가와 연도를 불러오는 중...",
    form_text_required: "먼저 정책 텍스트를 입력해 주세요.",
    form_predicting: "모델이 추론을 실행하는 중...",
    form_done: ({ country, year }) => `예측 완료: ${country} ${year}`,
    init_failed: ({ message }) => `초기화 실패: ${message}`,
    macro_raw: "원시값",
    macro_standardized: "표준화",
    macro_source: "출처",
    prediction_category: (label) => `범주 ${label}`,
  },
};

function resolveInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const queryLanguage = normalizeLanguageCode(params.get("lang"));
  if (queryLanguage && translations[queryLanguage]) {
    return queryLanguage;
  }
  const storedLanguage = normalizeLanguageCode(localStorage.getItem(LANGUAGE_STORAGE_KEY));
  if (storedLanguage && translations[storedLanguage]) {
    return storedLanguage;
  }
  const browserLanguage = normalizeLanguageCode(
    navigator.language || navigator.languages?.[0] || ""
  );
  if (browserLanguage && translations[browserLanguage]) {
    return browserLanguage;
  }
  return "zh";
}

function normalizeLanguageCode(language) {
  const normalized = String(language || "").trim().toLowerCase();
  if (!normalized) {
    return "";
  }

  const exactMatch = normalized.replace("_", "-");
  const baseLanguage = exactMatch.split("-")[0];
  const aliases = {
    jp: "ja",
    cn: "zh",
    zhcn: "zh",
    "zh-cn": "zh",
    "zh-tw": "zh",
    kr: "ko",
    gr: "el",
  };

  return aliases[exactMatch] || aliases[baseLanguage] || baseLanguage;
}

function t(key, params) {
  const table = translations[currentLanguage] || translations.en;
  const value = table[key];
  if (typeof value === "function") {
    return value(params || {});
  }
  return value ?? key;
}

function updateLanguageQuery() {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", currentLanguage);
  window.history.replaceState({}, "", url);
}

function setLanguage(lang) {
  currentLanguage = translations[lang] ? lang : resolveInitialLanguage();
  localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.title = t("page_title");
  updateLanguageQuery();

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });

  langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentLanguage);
  });
}

function setMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.style.color = isError ? "#a6451b" : "";
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
  setMessage(t("form_loading"));
  const response = await fetch("/api/options");
  const payload = await response.json();

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
  setMessage("");
}

countrySelect.addEventListener("change", () => fillYears(countrySelect.value));

predictButton.addEventListener("click", async () => {
  const text = textInput.value.trim();
  const country = countrySelect.value;
  const year = Number(yearSelect.value);

  if (!text) {
    setMessage(t("form_text_required"), true);
    return;
  }

  predictButton.disabled = true;
  setMessage(t("form_predicting"));

  try {
    const response = await fetch("/api/predict", {
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
    setMessage(t("form_done", { country: payload.country, year: payload.year }));
  } catch (error) {
    setMessage(error.message, true);
  } finally {
    predictButton.disabled = false;
  }
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

setLanguage(currentLanguage);

loadOptions().catch((error) => {
  setMessage(t("init_failed", { message: error.message }), true);
});
