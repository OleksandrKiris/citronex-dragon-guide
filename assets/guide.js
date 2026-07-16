(function () {
  "use strict";

  const LANGS = ["pl", "en", "ua", "ru", "az", "es", "fil", "id", "ne"];
  const AUDIO = Object.fromEntries(LANGS.map((lang) => [lang, `assets/audio/intro-${lang}.mp3`]));
  const TARGETS = {
    siechnice: "https://oleksandrkiris.github.io/citronex-siechnice-szkolenie/",
    ryczywol: "https://oleksandrkiris.github.io/citronex-ryczywol-szkolenie/",
    zgorzelec_bogatynia: "https://oleksandrkiris.github.io/citronex-zgorzelec-bogatynia-szkolenie/"
  };
  const LOCATION_NAMES = {
    siechnice: "Siechnice",
    ryczywol: "Ryczywół",
    zgorzelec_bogatynia: "Zgorzelec / Bogatynia"
  };
  const SPEECH_LABELS = {
    pl: "TEKST NAGRANIA", en: "RECORDING TEXT", ua: "ТЕКСТ ЗАПИСУ", ru: "ТЕКСТ ЗАПИСИ", az: "SƏS YAZISININ MƏTNİ", es: "TEXTO DEL AUDIO", fil: "TEKSTO NG AUDIO", id: "TEKS REKAMAN", ne: "रेकर्डिङको पाठ"
  };
  const SPOKEN_TRANSCRIPTS = {
    pl: "To jest CITRONEX hydra S.R.Z.B. Tutaj wybierasz przyjazd do pracy albo swoją lokalizację pracy. Po kliknięciu otworzy się właściwe szkolenie: mapy, instrukcje, kontakty i ważne informacje.",
    en: "This is CITRONEX hydra S.R.Z.B. Here you choose arrival to work or your work location. After choosing, the correct training will open: maps, instructions, contacts, and important information.",
    ua: "Це CITRONEX hydra S.R.Z.B. Тут оберіть приїзд на роботу або свою робочу локацію. Після вибору відкриється потрібне навчання: карти, інструкції, контакти та важлива інформація.",
    ru: "Это CITRONEX hydra S.R.Z.B. Здесь выберите приезд на работу или свою рабочую локацию. После выбора откроется нужное обучение: карты, инструкции, контакты и важная информация.",
    az: "Bu CITRONEX hydra S.R.Z.B.-dir. Burada işə gəlişi və ya iş yerinizi seçirsiniz. Seçimdən sonra sizə uyğun təlim açılacaq: xəritələr, təlimatlar, kontaktlar və vacib məlumatlar.",
    es: "Este es CITRONEX hydra S.R.Z.B. Aquí eliges la llegada al trabajo o tu ubicación de trabajo. Después se abrirá la formación correcta: mapas, instrucciones, contactos e información importante.",
    fil: "Ito ang CITRONEX hydra S.R.Z.B. Dito pipiliin mo ang pagdating sa trabaho o ang iyong lokasyon sa trabaho. Pagkatapos, bubukas ang tamang training: mga mapa, instruksyon, kontak at mahalagang impormasyon.",
    id: "Ini adalah CITRONEX hydra S.R.Z.B. Di sini Anda memilih kedatangan ke tempat kerja atau lokasi kerja Anda. Setelah itu akan terbuka pelatihan yang benar: peta, instruksi, kontak, dan informasi penting.",
    ne: "यो CITRONEX hydra S.R.Z.B. हो। यहाँ तपाईं काममा आउने जानकारी वा आफ्नो काम गर्ने स्थान छान्नुहुन्छ। त्यसपछि सही तालिम खुल्छ: नक्सा, निर्देशन, सम्पर्क र महत्वपूर्ण जानकारी।"
  };
  const TRANSLATION_REFINEMENTS = {
    en: { second: ["NEXT", "Learn step by step", "Choose Reader, Tablet, Greenhouse, What is not allowed, or the information you need."] },
    az: { third: ["SONDA", "Təlimə başlayın", "Bələdçidən sonra məkanınızın səhifəsi açılacaq."] },
    es: { skip: "Omitir audio" },
    fil: { second: ["SUNOD", "Matuto nang sunod-sunod", "Piliin ang Reader, Tablet, greenhouse, Mga Bawal, o ang impormasyong kailangan mo."], skip: "Laktawan ang audio", fallback: "Hindi muna available ang audio. Makikita pa rin ang teksto ng gabay." },
    ne: { second: ["त्यसपछि", "क्रमशः सिक्नुहोस्", "Reader, Tablet, ग्रीनहाउस, नियम र निषेध, वा आवश्यक जानकारी छान्नुहोस्।"] }
  };
  const SPEECH_LOCALES = { pl: "pl-PL", en: "en-US", ua: "uk-UA", ru: "ru-RU", az: "az-AZ", es: "es-ES", fil: "fil-PH", id: "id-ID", ne: "ne-NP" };
  const BUILD = "20260716-dragon5";
  const params = new URLSearchParams(window.location.search);
  const locationKey = params.get("location");
  const validLocation = Object.prototype.hasOwnProperty.call(TARGETS, locationKey);
  const forceGuide = params.get("welcome") === "1";
  const queryLang = LANGS.includes(params.get("lang")) ? params.get("lang") : "";
  const storedLang = LANGS.includes(localStorage.getItem("cxDragonGuide:lang")) ? localStorage.getItem("cxDragonGuide:lang") : "";
  let lang = queryLang || storedLang || "pl";
  let audioSourceReady = false;
  let speechFallbackActive = false;
  let redirectTimer = null;

  const $ = (id) => document.getElementById(id);
  const app = $("guideApp");
  const invalidState = $("invalidState");
  const languageGate = $("languageGate");
  const languageSelect = $("languageSelect");
  const audio = $("guideAudio");
  const dragonWrap = $("dragonWrap");
  const startButton = $("startButton");
  const openButton = $("openButton");
  const pauseButton = $("pauseButton");
  const replayButton = $("replayButton");
  const skipButton = $("skipButton");
  const audioStatus = $("audioStatus");

  const TEXT = {
    pl: { locationLabel: "LOKALIZACJA", hint: "Krótki przewodnik przed rozpoczęciem szkolenia.", title: "Witaj. Pokażę Ci, co znajdziesz w systemie.", intro: "Wybierz język, posłuchaj krótkiego przewodnika i przejdź do właściwej lokalizacji.", first: ["NAJPIERW", "Znajdź właściwe miejsce", "Otwórz mapę i wybierz szklarnię albo magazyn."], second: ["PÓŹNIEJ", "Ucz się krok po kroku", "Wybierz Reader, Tablet, Szklarnia, Zakazy lub inne potrzebne informacje."], third: ["NA KONIEC", "Przejdź do szkolenia", "Po przewodniku otworzy się strona Twojej lokalizacji."], start: "Posłuchaj i rozpocznij", open: "Otwórz szkolenie", pause: "Pauza", resume: "Wznów", replay: "Powtórz", skip: "Pomiń głos", reading: "Czytaj tekst i słuchaj nagrania.", playing: "Smok mówi. Możesz czytać tekst.", paused: "Nagranie zatrzymane.", finished: "Przewodnik zakończony. Otwieram szkolenie…", fallback: "Nagranie jest chwilowo niedostępne. Tekst przewodnika nadal jest widoczny.", gateTitle: "Wybierz język", gateText: "Smok przywita Cię w wybranym języku i pokaże, jak korzystać z systemu." },
    en: { locationLabel: "LOCATION", hint: "A short guide before you start training.", title: "Welcome. I will show you what is in the system.", intro: "Choose your language, listen to the short guide and go to the right location.", first: ["FIRST", "Find the right place", "Open the map and choose the greenhouse or warehouse."], second: ["NEXT", "Learn step by step", "Choose Reader, Tablet, Greenhouse, Rules or the information you need."], third: ["THEN", "Start your training", "After the guide, your location page will open."], start: "Listen and start", open: "Open training", pause: "Pause", resume: "Resume", replay: "Play again", skip: "Skip voice", reading: "Read the text while listening.", playing: "The dragon is speaking. You can read the text.", paused: "Audio paused.", finished: "Guide complete. Opening training…", fallback: "The recording is temporarily unavailable. The guide text is still visible.", gateTitle: "Choose a language", gateText: "The dragon will welcome you in your language and show you how to use the system." },
    ua: { locationLabel: "ЛОКАЦІЯ", hint: "Короткий інструктаж перед початком навчання.", title: "Вітаю. Я покажу, що є в цій системі.", intro: "Оберіть мову, послухайте короткий інструктаж і перейдіть до потрібної локації.", first: ["СПОЧАТКУ", "Знайдіть потрібне місце", "Відкрийте карту та оберіть теплицю або склад."], second: ["ПОТІМ", "Навчайтеся крок за кроком", "Оберіть Reader, Tablet, Теплиця, Заборони або потрібну інформацію."], third: ["НА КІНЕЦЬ", "Почніть навчання", "Після інструктажу відкриється сторінка вашої локації."], start: "Послухати і почати", open: "Відкрити навчання", pause: "Пауза", resume: "Продовжити", replay: "Повторити", skip: "Пропустити голос", reading: "Читайте текст і одночасно слухайте запис.", playing: "Дракон говорить. Ви можете читати текст.", paused: "Запис призупинено.", finished: "Інструктаж завершено. Відкриваю навчання…", fallback: "Запис тимчасово недоступний. Текст інструктажу залишається на екрані.", gateTitle: "Оберіть мову", gateText: "Дракон привітає вас обраною мовою і покаже, як користуватися системою." },
    ru: { locationLabel: "ЛОКАЦИЯ", hint: "Короткий инструктаж перед началом обучения.", title: "Привет. Я покажу, что есть в этой системе.", intro: "Выберите язык, послушайте короткий инструктаж и перейдите к нужной локации.", first: ["СНАЧАЛА", "Найдите нужное место", "Откройте карту и выберите теплицу или склад."], second: ["ПОТОМ", "Учитесь шаг за шагом", "Выберите Reader, Tablet, Теплица, Запреты или нужную информацию."], third: ["В КОНЦЕ", "Начните обучение", "После инструктажа откроется страница вашей локации."], start: "Послушать и начать", open: "Открыть обучение", pause: "Пауза", resume: "Продолжить", replay: "Повторить", skip: "Пропустить голос", reading: "Читайте текст и одновременно слушайте запись.", playing: "Дракон говорит. Вы можете читать текст.", paused: "Запись приостановлена.", finished: "Инструктаж завершён. Открываю обучение…", fallback: "Запись временно недоступна. Текст инструктажа остаётся на экране.", gateTitle: "Выберите язык", gateText: "Дракон поприветствует вас на выбранном языке и покажет, как пользоваться системой." },
    az: { locationLabel: "MƏKAN", hint: "Təlimə başlamazdan əvvəl qısa bələdçi.", title: "Salam. Mən sizə sistemdə nələrin olduğunu göstərəcəyəm.", intro: "Dil seçin, qısa bələdçiyə qulaq asın və düzgün məkana keçin.", first: ["ƏVVƏLCƏ", "Düzgün məkanı tapın", "Xəritəni açın və istixananı və ya anbarı seçin."], second: ["SONRA", "Addım-addım öyrənin", "Reader, Tablet, İstixana, Qadağalar və ya lazım olan məlumatı seçin."], third: ["SƏNƏDƏ", "Təlimə başlayın", "Bələdçidən sonra məkanınızın səhifəsi açılacaq."], start: "Qulaq asın və başlayın", open: "Təlimi açın", pause: "Pauza", resume: "Davam et", replay: "Yenidən dinlə", skip: "Səsi keç", reading: "Mətni oxuyun və eyni zamanda səsi dinləyin.", playing: "Əjdaha danışır. Mətni oxuya bilərsiniz.", paused: "Səs dayandırıldı.", finished: "Bələdçi tamamlandı. Təlim açılır…", fallback: "Səs yazısı müvəqqəti əlçatmazdır. Bələdçi mətni ekranda qalır.", gateTitle: "Dil seçin", gateText: "Əjdaha sizi seçdiyiniz dildə qarşılayacaq və sistemdən necə istifadə etməyi göstərəcək." },
    es: { locationLabel: "UBICACIÓN", hint: "Guía breve antes de comenzar la formación.", title: "Hola. Te mostraré qué encontrarás en el sistema.", intro: "Elige el idioma, escucha la guía breve y ve a la ubicación correcta.", first: ["PRIMERO", "Encuentra el lugar correcto", "Abre el mapa y elige el invernadero o el almacén."], second: ["DESPUÉS", "Aprende paso a paso", "Elige Reader, Tablet, Invernadero, Prohibiciones u otra información necesaria."], third: ["AL FINAL", "Comienza la formación", "Después de la guía se abrirá la página de tu ubicación."], start: "Escuchar y comenzar", open: "Abrir formación", pause: "Pausa", resume: "Continuar", replay: "Repetir", skip: "Saltar voz", reading: "Lee el texto mientras escuchas la grabación.", playing: "El dragón está hablando. Puedes leer el texto.", paused: "Audio pausado.", finished: "Guía terminada. Abriendo la formación…", fallback: "La grabación no está disponible ahora. El texto sigue visible.", gateTitle: "Elige un idioma", gateText: "El dragón te dará la bienvenida en tu idioma y te enseñará a usar el sistema." },
    fil: { locationLabel: "LOKASYON", hint: "Maikling gabay bago magsimula ang pagsasanay.", title: "Kumusta. Ipapakita ko kung ano ang nasa system.", intro: "Pumili ng wika, pakinggan ang maikling gabay at pumunta sa tamang lokasyon.", first: ["UNA", "Hanapin ang tamang lugar", "Buksan ang mapa at piliin ang greenhouse o bodega."], second: ["SUNOD", "Matuto nang sunod-sunod", "Piliin ang Reader, Tablet, Greenhouse, Mga Bawal o kailangan mong impormasyon."], third: ["SA HULI", "Simulan ang pagsasanay", "Pagkatapos ng gabay, bubukas ang pahina ng iyong lokasyon."], start: "Makinig at magsimula", open: "Buksan ang pagsasanay", pause: "I-pause", resume: "Magpatuloy", replay: "Ulitin", skip: "Laktawan ang boses", reading: "Basahin ang teksto habang nakikinig.", playing: "Nagsasalita ang dragon. Maaari mong basahin ang teksto.", paused: "Naka-pause ang audio.", finished: "Tapos na ang gabay. Binubuksan ang pagsasanay…", fallback: "Pansamantalang hindi available ang recording. Makikita pa rin ang teksto.", gateTitle: "Pumili ng wika", gateText: "Babatiin ka ng dragon sa iyong wika at ipapakita kung paano gamitin ang system." },
    id: { locationLabel: "LOKASI", hint: "Panduan singkat sebelum memulai pelatihan.", title: "Halo. Saya akan menunjukkan isi sistem ini.", intro: "Pilih bahasa, dengarkan panduan singkat, lalu masuk ke lokasi yang tepat.", first: ["PERTAMA", "Temukan tempat yang tepat", "Buka peta dan pilih rumah kaca atau gudang."], second: ["SELANJUTNYA", "Belajar langkah demi langkah", "Pilih Reader, Tablet, Rumah Kaca, Larangan, atau informasi yang diperlukan."], third: ["TERAKHIR", "Mulai pelatihan", "Setelah panduan selesai, halaman lokasi Anda akan terbuka."], start: "Dengarkan dan mulai", open: "Buka pelatihan", pause: "Jeda", resume: "Lanjutkan", replay: "Putar lagi", skip: "Lewati suara", reading: "Baca teks sambil mendengarkan rekaman.", playing: "Naga sedang berbicara. Anda dapat membaca teks.", paused: "Audio dijeda.", finished: "Panduan selesai. Membuka pelatihan…", fallback: "Rekaman sementara tidak tersedia. Teks panduan tetap terlihat.", gateTitle: "Pilih bahasa", gateText: "Naga akan menyambut Anda dalam bahasa pilihan dan menunjukkan cara menggunakan sistem." },
    ne: { locationLabel: "स्थान", hint: "तालिम सुरु गर्नुअघि छोटो मार्गदर्शन।", title: "नमस्ते। म तपाईंलाई प्रणालीमा के छ भनेर देखाउँछु।", intro: "भाषा छान्नुहोस्, छोटो मार्गदर्शन सुन्नुहोस् र सही स्थानमा जानुहोस्।", first: ["पहिले", "सही स्थान खोज्नुहोस्", "नक्सा खोल्नुहोस् र ग्रीनहाउस वा गोदाम छान्नुहोस्।"], second: ["त्यसपछि", "क्रमशः सिक्नुहोस्", "Reader, Tablet, ग्रीनहाउस, निषेध वा आवश्यक जानकारी छान्नुहोस्।"], third: ["अन्त्यमा", "तालिम सुरु गर्नुहोस्", "मार्गदर्शनपछि तपाईंको स्थानको पृष्ठ खुल्नेछ।"], start: "सुन्नुहोस् र सुरु गर्नुहोस्", open: "तालिम खोल्नुहोस्", pause: "पज", resume: "जारी राख्नुहोस्", replay: "फेरि सुन्नुहोस्", skip: "आवाज छोड्नुहोस्", reading: "रेकर्डिङ सुन्दै पाठ पढ्न सक्नुहुन्छ।", playing: "ड्रागन बोल्दैछ। तपाईं पाठ पढ्न सक्नुहुन्छ।", paused: "अडियो रोकिएको छ।", finished: "मार्गदर्शन सकियो। तालिम खोलिँदैछ…", fallback: "रेकर्डिङ अहिले उपलब्ध छैन। मार्गदर्शनको पाठ देखिइरहन्छ।", gateTitle: "भाषा छान्नुहोस्", gateText: "ड्रागनले तपाईंलाई रोजेको भाषामा स्वागत गर्नेछ र प्रणाली कसरी प्रयोग गर्ने देखाउनेछ।" }
  };

  function t() { return TEXT[lang] || TEXT.pl; }
  function setText(id, value) { const node = $(id); if (node) node.textContent = value; }

  function applyLanguage(nextLang) {
    lang = LANGS.includes(nextLang) ? nextLang : "pl";
    localStorage.setItem("cxDragonGuide:lang", lang);
    document.documentElement.lang = lang === "ua" ? "uk" : lang;
    languageSelect.value = lang;
    const copy = { ...t(), ...(TRANSLATION_REFINEMENTS[lang] || {}) };
    setText("locationLabel", copy.locationLabel);
    setText("locationName", LOCATION_NAMES[locationKey] || "CITRONEX");
    setText("locationHint", copy.hint);
    setText("guideTitle", copy.title);
    setText("speechLabel", SPEECH_LABELS[lang] || SPEECH_LABELS.pl);
    setText("speechText", SPOKEN_TRANSCRIPTS[lang] || copy.intro);
    [["step1Kicker", "step1Title", "step1Text"], ["step2Kicker", "step2Title", "step2Text"], ["step3Kicker", "step3Title", "step3Text"]].forEach((ids, index) => { const values = copy[["first", "second", "third"][index]]; ids.forEach((id, valueIndex) => setText(id, values[valueIndex])); });
    startButton.textContent = copy.start;
    openButton.textContent = copy.open;
    pauseButton.textContent = audio.paused ? copy.pause : copy.resume;
    replayButton.textContent = copy.replay;
    skipButton.textContent = copy.skip;
    audioStatus.textContent = copy.reading;
    setText("gateTitle", copy.gateTitle);
    setText("gateText", copy.gateText);
    if (audioSourceReady && !audio.paused) stopPlayback();
  }

  function setGateVisible(visible) { languageGate.hidden = !visible; if (visible) languageGate.querySelector("button")?.focus(); }

  function targetUrl() {
    const target = new URL(TARGETS[locationKey]);
    target.searchParams.set("lang", lang);
    target.searchParams.set("from", "dragon");
    target.searchParams.set("intro", "done");
    return target.toString();
  }

  function finishAndOpen() {
    if (!validLocation) return;
    localStorage.setItem(`cxDragonGuide:${locationKey}:seen:${BUILD}`, "1");
    window.location.assign(targetUrl());
  }

  function wasSeen() { return localStorage.getItem(`cxDragonGuide:${locationKey}:seen:${BUILD}`) === "1"; }

  function setSpeaking(active) { dragonWrap.classList.toggle("is-speaking", active); }

  function updateStep() {
    const elapsed = audio.duration && Number.isFinite(audio.currentTime / audio.duration) ? audio.currentTime / audio.duration : 0;
    const stepIndex = Math.min(2, Math.floor(elapsed * 3));
    document.querySelectorAll(".guide-step").forEach((step, index) => step.classList.toggle("is-active", index === stepIndex));
  }

  function stopSpeechFallback() { if (window.speechSynthesis) window.speechSynthesis.cancel(); speechFallbackActive = false; }

  function speakFallback() {
    if (!window.speechSynthesis) { audioStatus.textContent = t().fallback; openButton.hidden = false; return; }
    stopSpeechFallback();
    speechFallbackActive = true;
    const copy = { ...t(), ...(TRANSLATION_REFINEMENTS[lang] || {}) };
    const phrases = [copy.title, SPOKEN_TRANSCRIPTS[lang] || copy.intro, ...[copy.first, copy.second, copy.third].map((part) => part.slice(1).join(". "))];
    const utterance = new SpeechSynthesisUtterance(phrases.join(" "));
    utterance.lang = SPEECH_LOCALES[lang] || "pl-PL";
    utterance.rate = .92;
    utterance.onstart = () => { setSpeaking(true); audioStatus.textContent = t().playing; };
    utterance.onend = () => { speechFallbackActive = false; completeGuide(); };
    utterance.onerror = () => { speechFallbackActive = false; setSpeaking(false); audioStatus.textContent = t().fallback; openButton.hidden = false; };
    window.speechSynthesis.speak(utterance);
  }

  function prepareAudio() {
    const nextSource = AUDIO[lang];
    if (audio.src.endsWith(nextSource)) return;
    stopSpeechFallback();
    audio.src = nextSource;
    audio.load();
    audioSourceReady = true;
  }

  function completeGuide() {
    setSpeaking(false);
    pauseButton.hidden = true;
    replayButton.hidden = false;
    openButton.hidden = false;
    startButton.hidden = true;
    audioStatus.textContent = t().finished;
    clearTimeout(redirectTimer);
    redirectTimer = window.setTimeout(finishAndOpen, 1100);
  }

  function startPlayback() {
    clearTimeout(redirectTimer);
    prepareAudio();
    audio.play().then(() => {
      setSpeaking(true);
      startButton.hidden = true;
      openButton.hidden = true;
      pauseButton.hidden = false;
      replayButton.hidden = false;
      audioStatus.textContent = t().playing;
    }).catch(() => {
      setSpeaking(false);
      audioStatus.textContent = t().fallback;
      speakFallback();
    });
  }

  function stopPlayback() { audio.pause(); stopSpeechFallback(); setSpeaking(false); }

  function replay() {
    clearTimeout(redirectTimer);
    stopSpeechFallback();
    prepareAudio();
    audio.currentTime = 0;
    startButton.hidden = true;
    openButton.hidden = true;
    pauseButton.hidden = false;
    replayButton.hidden = false;
    audio.play().then(() => { setSpeaking(true); audioStatus.textContent = t().playing; }).catch(() => speakFallback());
  }

  function togglePause() {
    if (speechFallbackActive) { if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); pauseButton.textContent = t().pause; } else { window.speechSynthesis.pause(); pauseButton.textContent = t().resume; } return; }
    if (audio.paused) { audio.play().then(() => { setSpeaking(true); pauseButton.textContent = t().pause; audioStatus.textContent = t().playing; }).catch(() => {}); } else { audio.pause(); setSpeaking(false); pauseButton.textContent = t().resume; audioStatus.textContent = t().paused; }
  }

  audio.addEventListener("timeupdate", updateStep);
  audio.addEventListener("ended", completeGuide);
  audio.addEventListener("pause", () => { if (!audio.ended && !speechFallbackActive) setSpeaking(false); });
  audio.addEventListener("error", () => { audioStatus.textContent = t().fallback; speakFallback(); });
  languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
  startButton.addEventListener("click", startPlayback);
  openButton.addEventListener("click", finishAndOpen);
  pauseButton.addEventListener("click", togglePause);
  replayButton.addEventListener("click", replay);
  skipButton.addEventListener("click", finishAndOpen);
  languageGate.querySelectorAll("[data-gate-lang]").forEach((button) => button.addEventListener("click", () => { applyLanguage(button.dataset.gateLang); setGateVisible(false); }));

  if (!validLocation) {
    invalidState.hidden = false;
  } else if (wasSeen() && !forceGuide) {
    document.body.classList.add("is-redirecting");
    window.setTimeout(finishAndOpen, 80);
  } else {
    app.hidden = false;
    applyLanguage(lang);
    if (!queryLang && !storedLang) setGateVisible(true);
  }

  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
