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
    footer_meta: "本サイトは、Manifestoプロジェクト（Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center / Göttingen: Institute for Democracy Research）に謝意を表します。<br>本ウェブサイトは、研究および教育目的のみに使用されています。",
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
  zh: {
    page_title: "比较宣言政策分析",
    eyebrow: "比较政策人口智能",
    brand_name: "宣言政策分析界面",
    hero_kicker: "研究界面",
    hero_title: "比较政治的多语言政治宣言分析",
    hero_copy:
      "一个专门网站，用于结合国家-年份情境、宏观经济结构和跨国政策差异来分析政治宣言文本。",
    meta_1_label: "重点",
    meta_1_text: "结合结构背景的政治文本分类。",
    meta_2_label: "输入",
    meta_2_text: "宣言文本、国家选择和年份选择。",
    meta_3_label: "框架",
    meta_3_text: "宏观指标会在推理时自动应用。",
    input_kicker: "输入",
    input_title: "运行政策分析",
    input_copy:
      "提交一句宣言文本或政策陈述。系统会根据所选国家和年份自动应用结构性指标。",
    text_label: "政策文本",
    text_placeholder:
      "政府将通过就业培训、定向财政支持和产业协调来稳定劳动力市场。",
    country_label: "国家",
    year_label: "年份",
    predict_button: "开始分析",
    result_kicker: "输出",
    result_title: "分析输出",
    result_copy:
      "界面将展示最主要的预测政策类别，以及本次推理所使用的结构变量。",
    empty_state: "分析完成后，结果会显示在这里。",
    top_predictions: "主要预测",
    macro_title: "来自 add/ 的宏观变量",
    footer_label: "参与机构",
    contact_footer_html:
      '<p>李昕翮，终身讲师，小樽商科大学</p><p>邮箱：<a href="mailto:lixinhe@res.otaru-uc.ac.jp">lixinhe@res.otaru-uc.ac.jp</a></p><p>地址：日本北海道小樽市绿3丁目5-21，4号馆456室（Li Lab），047-8501</p>',
    footer_meta:
      "感谢 Manifesto 项目。Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center/Göttingen: Institute for Democracy Research (IfDem)。<br>本网站仅供学术与教学用途使用。",
    api_missing: "当前没有可用的后端接口。",
    api_saved: "后端接口已保存。",
    api_saved_error: "请输入后端接口地址。",
    api_checking: "正在验证后端连接...",
    api_connected: ({ countries, labels }) => `连接成功：${countries} 个国家，${labels} 个标签`,
    api_failed: "后端连接失败。",
    form_loading: "正在加载国家和年份...",
    form_loading_failed: "加载选项失败。",
    form_text_required: "请先输入政策文本再开始分析。",
    form_predicting: "正在执行模型推理...",
    form_done: ({ country, year }) => `分析完成：${country} ${year}`,
    prediction_failed: "预测失败。",
    macro_raw: "原始值",
    macro_standardized: "标准化",
    macro_source: "来源",
    prediction_category: (label) => `类别 ${label}`,
  },
  de: {
    page_title: "Vergleichende Manifest-Politikanalyse",
    eyebrow: "Vergleichende Policy Intelligence",
    brand_name: "Interface zur Analyse politischer Manifeste",
    hero_kicker: "Forschungsoberflaeche",
    hero_title: "Mehrsprachige Manifestanalyse fuer die vergleichende Politikwissenschaft.",
    hero_copy:
      "Eine professionelle Oberflaeche zur Analyse von Manifesttexten im Zusammenhang mit Laender-Jahr-Kontexten, makrooekonomischen Strukturen und länderuebergreifender Politikvariation.",
    meta_1_label: "Fokus",
    meta_1_text: "Klassifikation politischer Texte mit strukturellem Kontext.",
    meta_2_label: "Eingaben",
    meta_2_text: "Manifesttext, Laenderauswahl und Jahresauswahl.",
    meta_3_label: "Rahmen",
    meta_3_text: "Makroindikatoren werden waehrend der Inferenz automatisch angewendet.",
    input_kicker: "Eingabe",
    input_title: "Politikanalyse ausfuehren",
    input_copy:
      "Senden Sie einen Manifestsatz oder eine politische Aussage. Strukturelle Indikatoren werden gemaess dem gewaehlten Land und Jahr automatisch angewendet.",
    text_label: "Politiktext",
    text_placeholder:
      "Die Regierung wird den Arbeitsmarkt durch Qualifizierung, gezielte fiskalische Unterstuetzung und industriepolitische Koordination stabilisieren.",
    country_label: "Land",
    year_label: "Jahr",
    predict_button: "Analyse starten",
    result_kicker: "Ausgabe",
    result_title: "Analytische Ausgabe",
    result_copy:
      "Die Oberflaeche zeigt die fuehrenden vorhergesagten Politikkategorien zusammen mit den fuer diese Inferenz verwendeten Strukturvariablen.",
    empty_state: "Die Ergebnisse erscheinen hier nach Abschluss der Analyse.",
    top_predictions: "Top-Vorhersagen",
    macro_title: "Makrovariablen aus add/",
    footer_label: "Beteiligte Institutionen",
    contact_footer_html:
      '<p>Xinhe Li, Dozentin auf Lebenszeit, Otaru University of Commerce</p><p>E-Mail: <a href="mailto:lixinhe@res.otaru-uc.ac.jp">lixinhe@res.otaru-uc.ac.jp</a></p><p>Adresse: Raum 456 (Li Lab), Gebaeude 4, 3-5-21 Midori, Otaru, Hokkaido 047-8501, Japan</p>',
    footer_meta:
      "Dank an das Manifesto-Projekt. Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center/Göttingen: Institute for Democracy Research (IfDem).<br>Diese Website dient ausschliesslich akademischen und didaktischen Zwecken.",
    api_missing: "Derzeit ist kein Backend-Endpunkt verfuegbar.",
    api_saved: "Backend-Endpunkt gespeichert.",
    api_saved_error: "Bitte geben Sie einen Backend-Endpunkt ein.",
    api_checking: "Backend-Verbindung wird ueberprueft...",
    api_connected: ({ countries, labels }) => `Verbindung hergestellt: ${countries} Laender, ${labels} Labels`,
    api_failed: "Backend-Verbindung fehlgeschlagen.",
    form_loading: "Laender und Jahre werden geladen...",
    form_loading_failed: "Optionen konnten nicht geladen werden.",
    form_text_required: "Bitte geben Sie vor dem Start der Analyse einen Politiktext ein.",
    form_predicting: "Modellinferenz laeuft...",
    form_done: ({ country, year }) => `Analyse abgeschlossen: ${country} ${year}`,
    prediction_failed: "Vorhersage fehlgeschlagen.",
    macro_raw: "Rohwert",
    macro_standardized: "Standardisiert",
    macro_source: "Quelle",
    prediction_category: (label) => `Kategorie ${label}`,
  },
  fr: {
    page_title: "Analyse comparee des manifestes politiques",
    eyebrow: "Intelligence comparee des politiques publiques",
    brand_name: "Interface d'analyse des manifestes politiques",
    hero_kicker: "Interface de recherche",
    hero_title: "Analyse multilingue des manifestes pour la recherche politique comparee.",
    hero_copy:
      "Une interface professionnelle pour analyser le langage des manifestes en lien avec le contexte pays-annee, la structure macroeconomique et la variation transnationale des politiques publiques.",
    meta_1_label: "Focalisation",
    meta_1_text: "Classification de textes politiques avec contexte structurel.",
    meta_2_label: "Entrees",
    meta_2_text: "Texte de manifeste, pays selectionne et annee selectionnee.",
    meta_3_label: "Cadre",
    meta_3_text: "Les indicateurs macro sont appliques automatiquement pendant l'inference.",
    input_kicker: "Entree",
    input_title: "Lancer l'analyse de politique publique",
    input_copy:
      "Soumettez une phrase de manifeste ou un enonce de politique publique. Les indicateurs structurels sont appliques automatiquement selon le pays et l'annee selectionnes.",
    text_label: "Texte politique",
    text_placeholder:
      "Le gouvernement stabilisera le marche du travail grace a la formation, a un soutien budgetaire cible et a une coordination industrielle.",
    country_label: "Pays",
    year_label: "Annee",
    predict_button: "Lancer l'analyse",
    result_kicker: "Sortie",
    result_title: "Resultat analytique",
    result_copy:
      "L'interface presente les principales categories politiques predites ainsi que les variables structurelles utilisees pour l'inference en cours.",
    empty_state: "Les resultats apparaitront ici une fois l'analyse terminee.",
    top_predictions: "Principales predictions",
    macro_title: "Variables macro de add/",
    footer_label: "Institutions participantes",
    contact_footer_html:
      '<p>Xinhe Li, maitresse de conferences titulaire, Otaru University of Commerce</p><p>E-mail : <a href="mailto:lixinhe@res.otaru-uc.ac.jp">lixinhe@res.otaru-uc.ac.jp</a></p><p>Adresse : Salle 456 (Li Lab), Batiment 4, 3-5-21 Midori, Otaru, Hokkaido 047-8501, Japon</p>',
    footer_meta:
      "Remerciements au projet Manifesto. Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center/Göttingen: Institute for Democracy Research (IfDem).<br>Ce site web est reserve a un usage academique et pedagogique.",
    api_missing: "Aucun point de terminaison backend n'est actuellement disponible.",
    api_saved: "Point de terminaison backend enregistre.",
    api_saved_error: "Veuillez saisir un point de terminaison backend.",
    api_checking: "Verification de la connexion backend...",
    api_connected: ({ countries, labels }) => `Connexion etablie : ${countries} pays, ${labels} etiquettes`,
    api_failed: "Echec de la connexion backend.",
    form_loading: "Chargement des pays et des annees...",
    form_loading_failed: "Impossible de charger les options.",
    form_text_required: "Veuillez saisir un texte politique avant de lancer l'analyse.",
    form_predicting: "Inference du modele en cours...",
    form_done: ({ country, year }) => `Analyse terminee : ${country} ${year}`,
    prediction_failed: "La prediction a echoue.",
    macro_raw: "Valeur brute",
    macro_standardized: "Standardise",
    macro_source: "Source",
    prediction_category: (label) => `Categorie ${label}`,
  },
  it: {
    page_title: "Analisi comparata dei manifesti politici",
    eyebrow: "Intelligence comparata delle politiche",
    brand_name: "Interfaccia di analisi dei manifesti politici",
    hero_kicker: "Interfaccia di ricerca",
    hero_title: "Analisi multilingue dei manifesti per la ricerca politica comparata.",
    hero_copy:
      "Un'interfaccia professionale per analizzare il linguaggio dei manifesti in relazione al contesto paese-anno, alla struttura macroeconomica e alla variazione comparata delle politiche pubbliche.",
    meta_1_label: "Focus",
    meta_1_text: "Classificazione del testo politico con contesto strutturale.",
    meta_2_label: "Input",
    meta_2_text: "Testo del manifesto, selezione del paese e selezione dell'anno.",
    meta_3_label: "Quadro",
    meta_3_text: "Gli indicatori macro vengono applicati automaticamente durante l'inferenza.",
    input_kicker: "Input",
    input_title: "Esegui l'analisi delle politiche",
    input_copy:
      "Invia una frase di manifesto o una dichiarazione di policy. Gli indicatori strutturali vengono applicati automaticamente in base al paese e all'anno selezionati.",
    text_label: "Testo politico",
    text_placeholder:
      "Il governo stabilizzera il mercato del lavoro attraverso formazione, sostegno fiscale mirato e coordinamento industriale.",
    country_label: "Paese",
    year_label: "Anno",
    predict_button: "Avvia analisi",
    result_kicker: "Output",
    result_title: "Output analitico",
    result_copy:
      "L'interfaccia mostra le principali categorie politiche previste insieme alle variabili strutturali utilizzate per l'inferenza corrente.",
    empty_state: "I risultati appariranno qui dopo il completamento dell'analisi.",
    top_predictions: "Principali previsioni",
    macro_title: "Variabili macro da add/",
    footer_label: "Istituzioni partecipanti",
    contact_footer_html:
      '<p>Xinhe Li, docente di ruolo, Otaru University of Commerce</p><p>Email: <a href="mailto:lixinhe@res.otaru-uc.ac.jp">lixinhe@res.otaru-uc.ac.jp</a></p><p>Indirizzo: Stanza 456 (Li Lab), Edificio 4, 3-5-21 Midori, Otaru, Hokkaido 047-8501, Giappone</p>',
    footer_meta:
      "Ringraziamenti al progetto Manifesto. Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center/Göttingen: Institute for Democracy Research (IfDem).<br>Questo sito web e destinato esclusivamente a uso accademico e didattico.",
    api_missing: "Nessun endpoint backend e attualmente disponibile.",
    api_saved: "Endpoint backend salvato.",
    api_saved_error: "Inserisci un endpoint backend.",
    api_checking: "Verifica della connessione backend...",
    api_connected: ({ countries, labels }) => `Connessione stabilita: ${countries} paesi, ${labels} etichette`,
    api_failed: "Connessione backend non riuscita.",
    form_loading: "Caricamento di paesi e anni...",
    form_loading_failed: "Impossibile caricare le opzioni.",
    form_text_required: "Inserisci un testo politico prima di avviare l'analisi.",
    form_predicting: "Inferenza del modello in corso...",
    form_done: ({ country, year }) => `Analisi completata: ${country} ${year}`,
    prediction_failed: "Previsione non riuscita.",
    macro_raw: "Valore grezzo",
    macro_standardized: "Standardizzato",
    macro_source: "Fonte",
    prediction_category: (label) => `Categoria ${label}`,
  },
  ru: {
    page_title: "Сравнительный анализ политических манифестов",
    eyebrow: "Сравнительная аналитика политики",
    brand_name: "Интерфейс анализа политических манифестов",
    hero_kicker: "Исследовательский интерфейс",
    hero_title: "Многоязычный анализ манифестов для сравнительных политических исследований.",
    hero_copy:
      "Профессиональный интерфейс для анализа текста манифестов с учетом контекста страна-год, макроэкономической структуры и межстрановых различий в политике.",
    meta_1_label: "Фокус",
    meta_1_text: "Классификация политических текстов со структурным контекстом.",
    meta_2_label: "Входные данные",
    meta_2_text: "Текст манифеста, выбор страны и года.",
    meta_3_label: "Подход",
    meta_3_text: "Макропоказатели автоматически применяются во время инференса.",
    input_kicker: "Ввод",
    input_title: "Запустить политический анализ",
    input_copy:
      "Отправьте предложение из манифеста или формулировку политики. Структурные показатели будут применены автоматически по выбранным стране и году.",
    text_label: "Политический текст",
    text_placeholder:
      "Правительство стабилизирует рынок труда с помощью подготовки кадров, адресной бюджетной поддержки и промышленной координации.",
    country_label: "Страна",
    year_label: "Год",
    predict_button: "Запустить анализ",
    result_kicker: "Результат",
    result_title: "Аналитический вывод",
    result_copy:
      "Интерфейс показывает ведущие предсказанные категории политики и структурные переменные, использованные в текущем инференсе.",
    empty_state: "После завершения анализа результаты появятся здесь.",
    top_predictions: "Основные прогнозы",
    macro_title: "Макропеременные из add/",
    footer_label: "Участвующие учреждения",
    contact_footer_html:
      '<p>Синьхэ Ли, штатный преподаватель, Otaru University of Commerce</p><p>Email: <a href="mailto:lixinhe@res.otaru-uc.ac.jp">lixinhe@res.otaru-uc.ac.jp</a></p><p>Адрес: Комната 456 (Li Lab), корпус 4, 3-5-21 Midori, Otaru, Hokkaido 047-8501, Japan</p>',
    footer_meta:
      "Благодарность проекту Manifesto. Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center/Göttingen: Institute for Democracy Research (IfDem).<br>Этот сайт предназначен только для академического и образовательного использования.",
    api_missing: "Сейчас нет доступного backend endpoint.",
    api_saved: "Backend endpoint сохранен.",
    api_saved_error: "Введите адрес backend endpoint.",
    api_checking: "Проверка соединения с backend...",
    api_connected: ({ countries, labels }) => `Соединение установлено: ${countries} стран, ${labels} меток`,
    api_failed: "Не удалось подключиться к backend.",
    form_loading: "Загрузка стран и годов...",
    form_loading_failed: "Не удалось загрузить параметры.",
    form_text_required: "Перед запуском анализа введите политический текст.",
    form_predicting: "Выполняется инференс модели...",
    form_done: ({ country, year }) => `Анализ завершен: ${country} ${year}`,
    prediction_failed: "Ошибка предсказания.",
    macro_raw: "Исходное значение",
    macro_standardized: "Стандартизовано",
    macro_source: "Источник",
    prediction_category: (label) => `Категория ${label}`,
  },
  es: {
    page_title: "Analisis comparado de manifiestos politicos",
    eyebrow: "Inteligencia comparada de politicas",
    brand_name: "Interfaz de analisis de manifiestos politicos",
    hero_kicker: "Interfaz de investigacion",
    hero_title: "Analisis multilingue de manifiestos para la investigacion politica comparada.",
    hero_copy:
      "Una interfaz profesional para analizar el lenguaje de los manifiestos en relacion con el contexto pais-anio, la estructura macroeconomica y la variacion transnacional de las politicas publicas.",
    meta_1_label: "Enfoque",
    meta_1_text: "Clasificacion de texto politico con contexto estructural.",
    meta_2_label: "Entradas",
    meta_2_text: "Texto del manifiesto, seleccion de pais y seleccion de anio.",
    meta_3_label: "Marco",
    meta_3_text: "Los indicadores macro se aplican automaticamente durante la inferencia.",
    input_kicker: "Entrada",
    input_title: "Ejecutar analisis de politica",
    input_copy:
      "Envia una frase de manifiesto o una declaracion de politica. Los indicadores estructurales se aplican automaticamente segun el pais y el anio seleccionados.",
    text_label: "Texto politico",
    text_placeholder:
      "El gobierno estabilizara el mercado laboral mediante formacion, apoyo fiscal focalizado y coordinacion industrial.",
    country_label: "Pais",
    year_label: "Anio",
    predict_button: "Iniciar analisis",
    result_kicker: "Salida",
    result_title: "Salida analitica",
    result_copy:
      "La interfaz muestra las principales categorias politicas predichas junto con las variables estructurales utilizadas en la inferencia actual.",
    empty_state: "Los resultados apareceran aqui cuando el analisis haya terminado.",
    top_predictions: "Principales predicciones",
    macro_title: "Variables macro de add/",
    footer_label: "Instituciones participantes",
    contact_footer_html:
      '<p>Xinhe Li, profesora titular, Otaru University of Commerce</p><p>Correo: <a href="mailto:lixinhe@res.otaru-uc.ac.jp">lixinhe@res.otaru-uc.ac.jp</a></p><p>Direccion: Sala 456 (Li Lab), Edificio 4, 3-5-21 Midori, Otaru, Hokkaido 047-8501, Japon</p>',
    footer_meta:
      "Agradecimientos al proyecto Manifesto. Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center/Göttingen: Institute for Democracy Research (IfDem).<br>Este sitio web es solo para uso academico y educativo.",
    api_missing: "Actualmente no hay un endpoint backend disponible.",
    api_saved: "Endpoint backend guardado.",
    api_saved_error: "Introduce un endpoint backend.",
    api_checking: "Verificando la conexion con el backend...",
    api_connected: ({ countries, labels }) => `Conexion establecida: ${countries} paises, ${labels} etiquetas`,
    api_failed: "Fallo la conexion con el backend.",
    form_loading: "Cargando paises y anios...",
    form_loading_failed: "No se pudieron cargar las opciones.",
    form_text_required: "Introduce texto politico antes de ejecutar el analisis.",
    form_predicting: "Ejecutando inferencia del modelo...",
    form_done: ({ country, year }) => `Analisis completado: ${country} ${year}`,
    prediction_failed: "La prediccion fallo.",
    macro_raw: "Valor bruto",
    macro_standardized: "Estandarizado",
    macro_source: "Fuente",
    prediction_category: (label) => `Categoria ${label}`,
  },
  el: {
    page_title: "Συγκριτικη αναλυση πολιτικων μανιφεστων",
    eyebrow: "Συγκριτικη νοημοσυνη πολιτικης",
    brand_name: "Διεπαφη αναλυσης πολιτικων μανιφεστων",
    hero_kicker: "Ερευνητικη διεπαφη",
    hero_title: "Πολυγλωσσικη αναλυση μανιφεστων για συγκριτικη πολιτικη ερευνα.",
    hero_copy:
      "Μια επαγγελματικη διεπαφη για την αναλυση γλωσσας μανιφεστων σε σχεση με το πλαισιο χωρας-ετους, τη μακροοικονομικη δομη και τη διακρατικη διαφοροποιηση πολιτικων.",
    meta_1_label: "Εστιαση",
    meta_1_text: "Ταξινομηση πολιτικου κειμενου με δομικο πλαισιο.",
    meta_2_label: "Εισοδοι",
    meta_2_text: "Κειμενο μανιφεστου, επιλογη χωρας και επιλογη ετους.",
    meta_3_label: "Πλαισιο",
    meta_3_text: "Οι μακρο δεικτες εφαρμοζονται αυτοματα κατα την προβλεψη.",
    input_kicker: "Εισοδος",
    input_title: "Εκτελεση αναλυσης πολιτικης",
    input_copy:
      "Υποβαλετε μια προταση μανιφεστου η δηλωση πολιτικης. Οι δομικοι δεικτες εφαρμοζονται αυτοματα με βαση τη χωρα και το ετος που επιλεγονται.",
    text_label: "Πολιτικο κειμενο",
    text_placeholder:
      "Η κυβερνηση θα σταθεροποιησει την αγορα εργασιας μεσω καταρτισης, στοχευμενης δημοσιονομικης στηριξης και βιομηχανικου συντονισμου.",
    country_label: "Χωρα",
    year_label: "Ετος",
    predict_button: "Εναρξη αναλυσης",
    result_kicker: "Εξοδος",
    result_title: "Αναλυτικο αποτελεσμα",
    result_copy:
      "Η διεπαφη παρουσιαζει τις κυριες προβλεπομενες κατηγοριες πολιτικης μαζι με τις δομικες μεταβλητες που χρησιμοποιηθηκαν στην τρεχουσα προβλεψη.",
    empty_state: "Τα αποτελεσματα θα εμφανιστουν εδω μετα την ολοκληρωση της αναλυσης.",
    top_predictions: "Κορυφαιες προβλεψεις",
    macro_title: "Μακρο μεταβλητες απο το add/",
    footer_label: "Συμμετεχοντα ιδρυματα",
    contact_footer_html:
      '<p>Xinhe Li, μονιμη λεktoras, Otaru University of Commerce</p><p>Email: <a href="mailto:lixinhe@res.otaru-uc.ac.jp">lixinhe@res.otaru-uc.ac.jp</a></p><p>Διευθυνση: Room 456 (Li Lab), Building 4, 3-5-21 Midori, Otaru, Hokkaido 047-8501, Japan</p>',
    footer_meta:
      "Ευχαριστιες στο εργο Manifesto. Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center/Göttingen: Institute for Democracy Research (IfDem).<br>Αυτος ο ιστοτοπος προοριζεται μονο για ακαδημαϊκη και εκπαιδευτικη χρηση.",
    api_missing: "Δεν υπαρχει διαθεσιμο backend endpoint αυτη τη στιγμη.",
    api_saved: "Το backend endpoint αποθηκευτηκε.",
    api_saved_error: "Παρακαλω εισαγαγετε backend endpoint.",
    api_checking: "Ελεγχος συνδεσης backend...",
    api_connected: ({ countries, labels }) => `Η συνδεση πραγματοποιηθηκε: ${countries} χωρες, ${labels} ετικετες`,
    api_failed: "Η συνδεση με το backend απετυχε.",
    form_loading: "Φορτωση χωρων και ετων...",
    form_loading_failed: "Αποτυχια φορτωσης επιλογων.",
    form_text_required: "Παρακαλω εισαγαγετε πολιτικο κειμενο πριν ξεκινησετε την αναλυση.",
    form_predicting: "Εκτελειται η προβλεψη του μοντελου...",
    form_done: ({ country, year }) => `Η αναλυση ολοκληρωθηκε: ${country} ${year}`,
    prediction_failed: "Η προβλεψη απετυχε.",
    macro_raw: "Ακατεργαστη τιμη",
    macro_standardized: "Τυποποιημενο",
    macro_source: "Πηγη",
    prediction_category: (label) => `Κατηγορια ${label}`,
  },
  ko: {
    page_title: "비교 선언문 정책 분석",
    eyebrow: "비교 정책 인텔리전스",
    brand_name: "선언문 정책 분석 인터페이스",
    hero_kicker: "연구 인터페이스",
    hero_title: "비교정치 연구를 위한 다국어 선언문 분석.",
    hero_copy:
      "국가-연도 맥락, 거시경제 구조, 국가 간 정책 차이를 바탕으로 선언문 문장을 분석하는 전문 인터페이스입니다.",
    meta_1_label: "초점",
    meta_1_text: "구조적 맥락을 반영한 정치 텍스트 분류.",
    meta_2_label: "입력",
    meta_2_text: "선언문 텍스트, 국가 선택, 연도 선택.",
    meta_3_label: "프레임워크",
    meta_3_text: "거시 지표는 추론 과정에서 자동으로 적용됩니다.",
    input_kicker: "입력",
    input_title: "정책 분석 실행",
    input_copy:
      "선언문 문장이나 정책 문장을 입력하세요. 선택한 국가와 연도에 따라 구조 지표가 자동으로 적용됩니다.",
    text_label: "정책 텍스트",
    text_placeholder:
      "정부는 직업훈련, 선별적 재정지원, 산업정책 조정을 통해 노동시장을 안정화할 것입니다.",
    country_label: "국가",
    year_label: "연도",
    predict_button: "분석 시작",
    result_kicker: "출력",
    result_title: "분석 결과",
    result_copy:
      "현재 추론에 사용된 구조 변수와 함께 주요 정책 범주 예측 결과를 보여줍니다.",
    empty_state: "분석이 끝나면 결과가 여기에 표시됩니다.",
    top_predictions: "주요 예측",
    macro_title: "add/의 거시 변수",
    footer_label: "참여 기관",
    contact_footer_html:
      '<p>리 신허, 종신 강사, 오타루 상과대학</p><p>이메일: <a href="mailto:lixinhe@res.otaru-uc.ac.jp">lixinhe@res.otaru-uc.ac.jp</a></p><p>주소: 일본 홋카이도 오타루시 미도리 3-5-21 4호관 456호 (Li Lab), 047-8501</p>',
    footer_meta:
      "Manifesto 프로젝트에 감사를 표합니다. Lehmann, Pola et al., Berlin: WZB Berlin Social Science Center/Göttingen: Institute for Democracy Research (IfDem).<br>이 웹사이트는 학술 및 교육 목적에 한해 사용됩니다.",
    api_missing: "현재 사용 가능한 백엔드 엔드포인트가 없습니다.",
    api_saved: "백엔드 엔드포인트를 저장했습니다.",
    api_saved_error: "백엔드 엔드포인트를 입력해 주세요.",
    api_checking: "백엔드 연결을 확인하는 중...",
    api_connected: ({ countries, labels }) => `연결 성공: ${countries}개 국가, ${labels}개 라벨`,
    api_failed: "백엔드 연결에 실패했습니다.",
    form_loading: "국가와 연도 옵션을 불러오는 중...",
    form_loading_failed: "옵션을 불러오지 못했습니다.",
    form_text_required: "분석 전에 정책 텍스트를 입력해 주세요.",
    form_predicting: "모델 추론을 실행하는 중...",
    form_done: ({ country, year }) => `분석 완료: ${country} ${year}`,
    prediction_failed: "예측에 실패했습니다.",
    macro_raw: "원값",
    macro_standardized: "표준화",
    macro_source: "출처",
    prediction_category: (label) => `범주 ${label}`,
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
let currentLanguage = resolveInitialLanguage();

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
  return "en";
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

function setLanguage(lang) {
  currentLanguage = translations[lang] ? lang : "en";
  localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.title = t("page_title");
  updateLanguageQuery();

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

function updateLanguageQuery() {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", currentLanguage);
  window.history.replaceState({}, "", url);
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
