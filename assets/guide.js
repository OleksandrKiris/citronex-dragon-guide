(function () {
  "use strict";

  const LANGS = ["pl", "en", "ua", "ru", "az", "es", "fil", "id", "ne"];
  const AUDIO = Object.fromEntries(LANGS.map((lang) => [lang, `assets/audio/intro-${lang}.mp3?v=20260717-voice6`]));
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
  LOCATION_NAMES.ryczywol = "Ryczyw\u00f3\u0142";
  const SPEECH_LABELS = {
  "pl": "TEKST NAGRANIA",
  "en": "RECORDING TEXT",
  "ua": "ТЕКСТ АУДІО",
  "ru": "ТЕКСТ АУДИО",
  "az": "SƏS YAZISININ MƏTNİ",
  "es": "TEXTO DEL AUDIO",
  "fil": "TEKSTO NG AUDIO",
  "id": "TEKS REKAMAN",
  "ne": "अडियोको पाठ"
};
      const SPOKEN_TRANSCRIPTS = {
  "pl": "Witaj. To system Citronex. Jestem Twoim przewodnikiem. Wybierz język. Potem wybierz miejsce pracy. Znajdziesz tu mapy, instrukcje, kontakty i zasady. Zaczynamy.",
  "en": "Welcome. This is the Citronex system. I am your guide. Choose a language. Then choose your workplace. Here you can find maps, instructions, contacts, and rules. Let us begin.",
  "ua": "Вітаю. Це система Citronex. Я ваш гід. Оберіть мову. Потім оберіть місце роботи. Тут є карти, інструкції, контакти та правила. Почнімо.",
  "ru": "Здравствуйте. Это система Citronex. Я ваш помощник. Выберите язык. Затем выберите место работы. Здесь есть карты, инструкции, контакты и правила. Начнём.",
  "az": "Salam. Bu, Citronex sistemidir. Mən sizin bələdçinizəm. Dil seçin. Sonra iş yerinizi seçin. Burada xəritələr, təlimatlar, əlaqə nömrələri və qaydalar var. Başlayaq.",
  "es": "Bienvenido. Este es el sistema Citronex. Soy tu guía. Elige un idioma. Después, elige tu lugar de trabajo. Aquí encontrarás mapas, instrucciones, contactos y normas. Empecemos.",
  "fil": "Maligayang pagdating. Ito ang sistema ng Citronex. Ako ang iyong gabay. Piliin ang iyong wika. Pagkatapos, piliin ang lugar ng iyong trabaho. Narito ang mga mapa, tagubilin, contact, at patakaran. Magsimula na tayo.",
  "id": "Selamat datang. Ini sistem Citronex. Saya pemandu Anda. Pilih bahasa. Lalu pilih tempat kerja. Di sini ada peta, petunjuk, kontak, dan aturan. Mari kita mulai.",
  "ne": "स्वागत छ। यो Citronex प्रणाली हो। म तपाईंको मार्गदर्शक हुँ\u0964 आफ्नो भाषा छान्नुहोस्। त्यसपछि काम गर्ने ठाउँ छान्नुहोस्। यहाँ नक्सा, निर्देशन, सम्पर्क र नियमहरू छन्। सुरु गरौँ।"
};
  const CLEAR_SPOKEN_TRANSCRIPTS = {
    "pl": "Witaj. To jest system Citronex. Jestem Twoim przewodnikiem. Wybierz j\u0119zyk. Nast\u0119pnie wybierz miejsce pracy. W aplikacji znajdziesz mapy, instrukcje, kontakty i najwa\u017cniejsze zasady. Zaczynamy.",
    "en": "Welcome. This is the Citronex system. I am your guide. Choose a language. Next, choose your workplace. In this app you will find maps, instructions, contacts, and the most important rules. Let us begin.",
    "ua": "\u0412\u0456\u0442\u0430\u044e. \u0426\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u0430 Citronex. \u042f \u0432\u0430\u0448 \u0433\u0456\u0434. \u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043c\u043e\u0432\u0443. \u041f\u043e\u0442\u0456\u043c \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u043c\u0456\u0441\u0446\u0435 \u0440\u043e\u0431\u043e\u0442\u0438. \u0423 \u0446\u044c\u043e\u043c\u0443 \u0437\u0430\u0441\u0442\u043e\u0441\u0443\u043d\u043a\u0443 \u0432\u0438 \u0437\u043d\u0430\u0439\u0434\u0435\u0442\u0435 \u043a\u0430\u0440\u0442\u0438, \u0456\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0456\u0457, \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u0438 \u0442\u0430 \u043d\u0430\u0439\u0432\u0430\u0436\u043b\u0438\u0432\u0456\u0448\u0456 \u043f\u0440\u0430\u0432\u0438\u043b\u0430. \u041f\u043e\u0447\u043d\u0456\u043c\u043e.",
    "ru": "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435. \u042d\u0442\u043e \u0441\u0438\u0441\u0442\u0435\u043c\u0430 Citronex. \u042f \u0432\u0430\u0448 \u043f\u043e\u043c\u043e\u0449\u043d\u0438\u043a. \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u044f\u0437\u044b\u043a. \u0417\u0430\u0442\u0435\u043c \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043c\u0435\u0441\u0442\u043e \u0440\u0430\u0431\u043e\u0442\u044b. \u0412 \u044d\u0442\u043e\u043c \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438 \u0432\u044b \u043d\u0430\u0439\u0434\u0451\u0442\u0435 \u043a\u0430\u0440\u0442\u044b, \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438, \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b \u0438 \u0441\u0430\u043c\u044b\u0435 \u0432\u0430\u0436\u043d\u044b\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u0430. \u041d\u0430\u0447\u043d\u0451\u043c.",
    "az": "Salam. Bu, Citronex sistemidir. M\u0259n sizin b\u0259l\u0259d\u00e7iniz\u0259m. Dil se\u00e7in. Sonra i\u015f yerinizi se\u00e7in. Bu t\u0259tbiqd\u0259 x\u0259rit\u0259l\u0259ri, t\u0259limatlar\u0131, \u0259laq\u0259 m\u0259lumatlar\u0131n\u0131 v\u0259 \u0259n vacib qaydalar\u0131 tapa bil\u0259rsiniz. Ba\u015flayaq.",
    "es": "Bienvenido. Este es el sistema Citronex. Soy tu gu\u00eda. Elige un idioma. Despu\u00e9s, elige tu lugar de trabajo. En esta aplicaci\u00f3n encontrar\u00e1s mapas, instrucciones, contactos y las normas m\u00e1s importantes. Empecemos.",
    "fil": "Maligayang pagdating. Ito ang sistema ng Citronex. Ako ang iyong gabay. Pumili ng wika. Pagkatapos, piliin ang lugar ng iyong trabaho. Makikita rito ang mga mapa, tagubilin, contact, at pinakamahahalagang patakaran. Magsimula na tayo.",
    "id": "Selamat datang. Ini adalah sistem Citronex. Saya pemandu Anda. Pilih bahasa. Selanjutnya, pilih tempat kerja Anda. Di aplikasi ini ada peta, petunjuk, kontak, dan aturan yang paling penting. Mari kita mulai.",
    "ne": "\u0938\u094d\u0935\u093e\u0917\u0924 \u091b\u0964 \u092f\u094b Citronex \u092a\u094d\u0930\u0923\u093e\u0932\u0940 \u0939\u094b\u0964 \u092e \u0924\u092a\u093e\u0908\u0902\u0915\u094b \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u0915 \u0939\u0941\u0901\u0964 \u0906\u092b\u094d\u0928\u094b \u092d\u093e\u0937\u093e \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964 \u0924\u094d\u092f\u0938\u092a\u091b\u093f \u0915\u093e\u092e \u0917\u0930\u094d\u0928\u0947 \u0920\u093e\u0909\u0901 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964 \u092f\u0938 \u0905\u0928\u0941\u092a\u094d\u0930\u092f\u094b\u0917\u092e\u093e \u0928\u0915\u094d\u0938\u093e, \u0928\u093f\u0930\u094d\u0926\u0947\u0936\u0928, \u0938\u092e\u094d\u092a\u0930\u094d\u0915 \u0930 \u0938\u092c\u0948\u092d\u0928\u094d\u0926\u093e \u092e\u0939\u0924\u094d\u0924\u094d\u0935\u092a\u0942\u0930\u094d\u0923 \u0928\u093f\u092f\u092e\u0939\u0930\u0942 \u091b\u0928\u094d\u0964 \u0938\u0941\u0930\u0941 \u0917\u0930\u094c\u0902\u0964",
  };
  const TRANSLATION_REFINEMENTS = {
  "en": {
    "second": [
      "NEXT",
      "Learn step by step",
      "Choose Reader, Tablet, Greenhouse, What is not allowed, or the information you need."
    ]
  },
  "az": {
    "third": [
      "SONRA",
      "Addım-addım öyrənin",
      "Gəldikdən sonra məkanınızın səhifəsi açılacaq."
    ]
  },
  "es": {
    "skip": "Omitir audio"
  },
  "fil": {
    "second": [
      "SUNOD",
      "Matuto nang sunod-sunod",
      "Piliin ang Reader, Tablet, greenhouse, Mga Bawal, o ang impormasyong kailangan mo."
    ],
    "skip": "Laktawan ang audio",
    "fallback": "Hindi muna available ang audio. Makikita pa rin ang teksto ng gabay."
  },
  "ne": {
    "second": [
      "अर्को",
      "चरणबद्ध रूपमा सिक्नुहोस्",
      "Reader, Tablet, ग्रीनहाउस, निषेधित वस्तु वा आवश्यक जानकारी छान्नुहोस्।"
    ]
  }
};
  const SPEECH_LOCALES = { pl: "pl-PL", en: "en-US", ua: "uk-UA", ru: "ru-RU", az: "az-AZ", es: "es-ES", fil: "fil-PH", id: "id-ID", ne: "ne-NP" };
  const VOICE_PROFILES = {
    pl: { rate: .80, pitch: 1 }, en: { rate: .82, pitch: 1 }, ua: { rate: .78, pitch: 1 },
    ru: { rate: .78, pitch: 1 }, az: { rate: .80, pitch: 1 }, es: { rate: .82, pitch: 1 },
    fil: { rate: .80, pitch: 1 }, id: { rate: .80, pitch: 1 }, ne: { rate: .76, pitch: 1 }
  };

  // The location guide is short, practical and identical on screen and in speech.
  const LOCATION_GUIDE_COPY = {
    siechnice: {
      pl: { hint: "Szkolenie dla lokalizacji Siechnice.", title: "Witaj w szkoleniu Siechnice.", gate: "Najpierw sprawd\u017a map\u0119. Potem wybierz tylko potrzebny modu\u0142.", spoken: "Witaj w szkoleniu dla lokalizacji Siechnice. Najpierw otw\u00f3rz map\u0119 i sprawd\u017a, dok\u0105d masz i\u015b\u0107. Na stronie znajdziesz instrukcje dla szklarni, magazynu, Reader\u00f3w i tablet\u00f3w, a tak\u017ce kontakty i wa\u017cne zasady. Wybierz potrzebny modu\u0142 i przejd\u017a krok po kroku." },
      en: { hint: "Training for the Siechnice location.", title: "Welcome to Siechnice training.", gate: "Check the map first. Then choose only the module you need.", spoken: "Welcome to training for the Siechnice location. First open the map and check where you need to go. The page has instructions for the greenhouse, warehouse, Readers and tablets, as well as contacts and important rules. Choose the module you need and follow it step by step." },
      ua: { hint: "\u041d\u0430\u0432\u0447\u0430\u043d\u043d\u044f \u0434\u043b\u044f \u043b\u043e\u043a\u0430\u0446\u0456\u0457 Siechnice.", title: "\u0412\u0456\u0442\u0430\u0454\u043c\u043e \u043d\u0430 \u043d\u0430\u0432\u0447\u0430\u043d\u043d\u0456 Siechnice.", gate: "\u0421\u043f\u043e\u0447\u0430\u0442\u043a\u0443 \u043f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043a\u0430\u0440\u0442\u0443. \u041f\u043e\u0442\u0456\u043c \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u043f\u043e\u0442\u0440\u0456\u0431\u043d\u0438\u0439 \u043c\u043e\u0434\u0443\u043b\u044c.", spoken: "\u0412\u0456\u0442\u0430\u044e \u043d\u0430 \u043d\u0430\u0432\u0447\u0430\u043d\u043d\u0456 \u0434\u043b\u044f \u043b\u043e\u043a\u0430\u0446\u0456\u0457 Siechnice. \u0421\u043f\u043e\u0447\u0430\u0442\u043a\u0443 \u0432\u0456\u0434\u043a\u0440\u0438\u0439\u0442\u0435 \u043a\u0430\u0440\u0442\u0443 \u0456 \u043f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435, \u043a\u0443\u0434\u0438 \u0432\u0430\u043c \u043f\u043e\u0442\u0440\u0456\u0431\u043d\u043e \u0439\u0442\u0438. \u0422\u0443\u0442 \u0454 \u0456\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0456\u0457 \u0434\u043b\u044f \u0442\u0435\u043f\u043b\u0438\u0446\u0456, \u0441\u043a\u043b\u0430\u0434\u0443, Reader \u0456 \u043f\u043b\u0430\u043d\u0448\u0435\u0442\u0456\u0432, \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u0438 \u0442\u0430 \u0432\u0430\u0436\u043b\u0438\u0432\u0456 \u043f\u0440\u0430\u0432\u0438\u043b\u0430. \u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043f\u043e\u0442\u0440\u0456\u0431\u043d\u0438\u0439 \u043c\u043e\u0434\u0443\u043b\u044c \u0456 \u043f\u0440\u043e\u0439\u0434\u0456\u0442\u044c \u0439\u043e\u0433\u043e \u043a\u0440\u043e\u043a \u0437\u0430 \u043a\u0440\u043e\u043a\u043e\u043c." },
      ru: { hint: "\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043b\u043e\u043a\u0430\u0446\u0438\u0438 Siechnice.", title: "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u043d\u0430 \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 Siechnice.", gate: "\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043a\u0430\u0440\u0442\u0443. \u0417\u0430\u0442\u0435\u043c \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0443\u0436\u043d\u044b\u0439 \u043c\u043e\u0434\u0443\u043b\u044c.", spoken: "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u043d\u0430 \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043b\u043e\u043a\u0430\u0446\u0438\u0438 Siechnice. \u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u043a\u0430\u0440\u0442\u0443 \u0438 \u043f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435, \u043a\u0443\u0434\u0430 \u0432\u0430\u043c \u043d\u0443\u0436\u043d\u043e \u0438\u0434\u0442\u0438. \u0417\u0434\u0435\u0441\u044c \u0435\u0441\u0442\u044c \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438 \u0434\u043b\u044f \u0442\u0435\u043f\u043b\u0438\u0446\u044b, \u0441\u043a\u043b\u0430\u0434\u0430, Reader \u0438 \u043f\u043b\u0430\u043d\u0448\u0435\u0442\u0430, \u0430 \u0442\u0430\u043a\u0436\u0435 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b \u0438 \u0432\u0430\u0436\u043d\u044b\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u0430. \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0443\u0436\u043d\u044b\u0439 \u043c\u043e\u0434\u0443\u043b\u044c \u0438 \u043f\u0440\u043e\u0439\u0434\u0438\u0442\u0435 \u0435\u0433\u043e \u043f\u043e\u0448\u0430\u0433\u043e\u0432\u043e." },
      az: { hint: "Siechnice yeri \u00fc\u00e7\u00fcn t\u0259lim.", title: "Siechnice t\u0259limin\u0259 xo\u015f g\u0259lmisiniz.", gate: "\u018fv\u0259lc\u0259 x\u0259rit\u0259y\u0259 bax\u0131n. Sonra yaln\u0131z laz\u0131m olan b\u00f6lm\u0259ni se\u00e7in.", spoken: "Siechnice yerind\u0259ki t\u0259lim\u0259 xo\u015f g\u0259lmisiniz. \u018fv\u0259lc\u0259 x\u0259rit\u0259ni a\u00e7\u0131n v\u0259 hara getm\u0259li oldu\u011funuza bax\u0131n. S\u0259hif\u0259d\u0259 istixana, anbar, Reader v\u0259 plan\u015fetl\u0259r, kontaktlar v\u0259 vacib qaydalar \u00fc\u00e7\u00fcn ayr\u0131 t\u0259limatlar var. Siz\u0259 laz\u0131m olan b\u00f6lm\u0259ni se\u00e7in v\u0259 add\u0131m-add\u0131m davam edin." },
      es: { hint: "Formaci\u00f3n para la ubicaci\u00f3n de Siechnice.", title: "Bienvenido a la formaci\u00f3n de Siechnice.", gate: "Mira primero el mapa. Despu\u00e9s elige solo el m\u00f3dulo que necesitas.", spoken: "Bienvenido a la formaci\u00f3n de la ubicaci\u00f3n de Siechnice. Primero abre el mapa y comprueba ad\u00f3nde tienes que ir. La p\u00e1gina incluye instrucciones para el invernadero, el almac\u00e9n, los Readers y las tabletas, adem\u00e1s de contactos y normas importantes. Elige el m\u00f3dulo que necesitas y sigue los pasos." },
      fil: { hint: "Pagsasanay para sa Siechnice.", title: "Maligayang pagdating sa pagsasanay ng Siechnice.", gate: "Tingnan muna ang mapa. Pagkatapos, piliin lamang ang module na kailangan mo.", spoken: "Maligayang pagdating sa pagsasanay para sa Siechnice. Buksan muna ang mapa at tingnan kung saan ka dapat pumunta. May mga tagubilin para sa greenhouse, bodega, Reader at tablet, pati mga contact at mahahalagang patakaran. Piliin ang kailangan mong module at sundin ang mga hakbang." },
      id: { hint: "Pelatihan untuk lokasi Siechnice.", title: "Selamat datang di pelatihan Siechnice.", gate: "Periksa peta terlebih dahulu. Lalu pilih hanya modul yang Anda perlukan.", spoken: "Selamat datang di pelatihan untuk lokasi Siechnice. Buka peta terlebih dahulu dan periksa ke mana Anda harus pergi. Halaman ini berisi petunjuk untuk rumah kaca, gudang, Reader dan tablet, serta kontak dan aturan penting. Pilih modul yang Anda perlukan dan ikuti langkahnya." },
      ne: { hint: "Siechnice स्थानका लागि तालिम।", title: "Siechnice तालिममा स्वागत छ।", gate: "पहिले नक्सा हेर्नुहोस्। त्यसपछि आवश्यक मोड्युल मात्र छान्नुहोस्।", spoken: "Siechnice स्थानको तालिममा स्वागत छ। पहिले नक्सा खोल्नुहोस् र कहाँ जानुपर्छ हेर्नुहोस्। यहाँ ग्रीनहाउस, गोदाम, Reader र ट्याब्लेटका निर्देशन, सम्पर्क र महत्त्वपूर्ण नियमहरू छन्। आवश्यक मोड्युल छान्नुहोस् र चरणअनुसार अगाडि बढ्नुहोस्।" }
    },
    ryczywol: {
      pl: { hint: "Szkolenie dla lokalizacji Ryczywół.", title: "Witaj w szkoleniu Ryczywół.", gate: "Sprawdź mapę miejsca, do którego jedziesz. Potem wybierz potrzebny moduł.", spoken: "Witaj w szkoleniu dla lokalizacji Ryczywół. Najpierw sprawdź mapę i wybierz właściwe miejsce: hotel, biuro, szklarnię, magazyn albo przystanek. Instrukcje pracy oraz obsługi Readerów i tabletów są w osobnych modułach. Wybierz tylko to, czego teraz potrzebujesz." },
      en: { hint: "Training for the Ryczywół location.", title: "Welcome to Ryczywół training.", gate: "Check the map for your destination. Then choose the module you need.", spoken: "Welcome to training for the Ryczywół location. First check the map and choose the right place: the hotel, office, greenhouse, warehouse or bus stop. Work, Reader and tablet instructions are in separate modules. Choose only the information you need now." },
      ua: { hint: "\u041d\u0430\u0432\u0447\u0430\u043d\u043d\u044f \u0434\u043b\u044f \u043b\u043e\u043a\u0430\u0446\u0456\u0457 Ryczyw\u00f3\u0142.", title: "\u0412\u0456\u0442\u0430\u0454\u043c\u043e \u043d\u0430 \u043d\u0430\u0432\u0447\u0430\u043d\u043d\u0456 Ryczyw\u00f3\u0142.", gate: "\u041f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043a\u0430\u0440\u0442\u0443 \u043c\u0456\u0441\u0446\u044f, \u0434\u043e \u044f\u043a\u043e\u0433\u043e \u0432\u0438 \u0439\u0434\u0435\u0442\u0435. \u041f\u043e\u0442\u0456\u043c \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u043f\u043e\u0442\u0440\u0456\u0431\u043d\u0438\u0439 \u043c\u043e\u0434\u0443\u043b\u044c.", spoken: "\u0412\u0456\u0442\u0430\u044e \u043d\u0430 \u043d\u0430\u0432\u0447\u0430\u043d\u043d\u0456 \u0434\u043b\u044f \u043b\u043e\u043a\u0430\u0446\u0456\u0457 Ryczyw\u00f3\u0142. \u0421\u043f\u043e\u0447\u0430\u0442\u043a\u0443 \u043f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043a\u0430\u0440\u0442\u0443 \u0456 \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u043f\u043e\u0442\u0440\u0456\u0431\u043d\u0435 \u043c\u0456\u0441\u0446\u0435: \u0433\u043e\u0442\u0435\u043b\u044c, \u043e\u0444\u0456\u0441, \u0442\u0435\u043f\u043b\u0438\u0446\u044e, \u0441\u043a\u043b\u0430\u0434 \u0430\u0431\u043e \u0437\u0443\u043f\u0438\u043d\u043a\u0443. \u0406\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0456\u0457 \u0440\u043e\u0431\u043e\u0442\u0438, Reader \u0456 \u043f\u043b\u0430\u043d\u0448\u0435\u0442\u0456\u0432 \u0437\u043d\u0430\u0445\u043e\u0434\u044f\u0442\u044c\u0441\u044f \u0432 \u043e\u043a\u0440\u0435\u043c\u0438\u0445 \u043c\u043e\u0434\u0443\u043b\u044f\u0445. \u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043b\u0438\u0448\u0435 \u0442\u0435, \u0449\u043e \u0432\u0430\u043c \u043f\u043e\u0442\u0440\u0456\u0431\u043d\u043e." },
      ru: { hint: "\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043b\u043e\u043a\u0430\u0446\u0438\u0438 Ryczyw\u00f3\u0142.", title: "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u043d\u0430 \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 Ryczyw\u00f3\u0142.", gate: "\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043a\u0430\u0440\u0442\u0443 \u043c\u0435\u0441\u0442\u0430, \u043a\u0443\u0434\u0430 \u0432\u044b \u0435\u0434\u0435\u0442\u0435. \u0417\u0430\u0442\u0435\u043c \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0443\u0436\u043d\u044b\u0439 \u043c\u043e\u0434\u0443\u043b\u044c.", spoken: "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u043d\u0430 \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 Ryczyw\u00f3\u0142. \u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043a\u0430\u0440\u0442\u0443 \u0438 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0443\u0436\u043d\u043e\u0435 \u043c\u0435\u0441\u0442\u043e: \u043e\u0442\u0435\u043b\u044c, \u043e\u0444\u0438\u0441, \u0442\u0435\u043f\u043b\u0438\u0446\u0430, \u0441\u043a\u043b\u0430\u0434 \u0438\u043b\u0438 \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430. \u0418\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438 \u043f\u043e \u0440\u0430\u0431\u043e\u0442\u0435, Reader \u0438 \u043f\u043b\u0430\u043d\u0448\u0435\u0442\u0443 \u043d\u0430\u0445\u043e\u0434\u044f\u0442\u0441\u044f \u0432 \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u0445 \u043c\u043e\u0434\u0443\u043b\u044f\u0445. \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0443\u0436\u043d\u0443\u044e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e." },
      az: { hint: "Ryczyw\u00f3\u0142 yeri \u00fc\u00e7\u00fcn t\u0259lim.", title: "Ryczyw\u00f3\u0142 t\u0259limin\u0259 xo\u015f g\u0259lmisiniz.", gate: "Ged\u0259c\u0259yiniz yeri x\u0259rit\u0259d\u0259 yoxlay\u0131n. Sonra laz\u0131m olan b\u00f6lm\u0259ni se\u00e7in.", spoken: "Ryczyw\u00f3\u0142 yerind\u0259ki t\u0259lim\u0259 xo\u015f g\u0259lmisiniz. \u018fv\u0259lc\u0259 x\u0259rit\u0259y\u0259 bax\u0131n v\u0259 d\u00fczg\u00fcn yeri se\u00e7in: otel, ofis, istixana, anbar v\u0259 ya dayanacaq. \u0130\u015f, Reader v\u0259 plan\u015fet t\u0259limatlar\u0131 ayr\u0131 b\u00f6lm\u0259l\u0259rd\u0259dir. Yaln\u0131z indi siz\u0259 laz\u0131m olan m\u0259lumat\u0131 se\u00e7in." },
      es: { hint: "Formaci\u00f3n para la ubicaci\u00f3n de Ryczyw\u00f3\u0142.", title: "Bienvenido a la formaci\u00f3n de Ryczyw\u00f3\u0142.", gate: "Comprueba en el mapa el lugar al que vas. Despu\u00e9s elige el m\u00f3dulo que necesitas.", spoken: "Bienvenido a la formaci\u00f3n de la ubicaci\u00f3n de Ryczyw\u00f3\u0142. Primero comprueba el mapa y elige el lugar correcto: hotel, oficina, invernadero, almac\u00e9n o parada. Las instrucciones de trabajo, Reader y tableta est\u00e1n en m\u00f3dulos separados. Elige solo la informaci\u00f3n que necesitas ahora." },
      fil: { hint: "Pagsasanay para sa Ryczyw\u00f3\u0142.", title: "Maligayang pagdating sa pagsasanay ng Ryczyw\u00f3\u0142.", gate: "Tingnan sa mapa ang pupuntahan mo. Pagkatapos, piliin ang module na kailangan mo.", spoken: "Maligayang pagdating sa pagsasanay para sa Ryczyw\u00f3\u0142. Tingnan muna ang mapa at piliin ang tamang lugar: hotel, opisina, greenhouse, bodega o hintuan. Ang mga tagubilin sa trabaho, Reader at tablet ay nasa magkakahiwalay na module. Piliin lamang ang impormasyong kailangan mo ngayon." },
      id: { hint: "Pelatihan untuk lokasi Ryczyw\u00f3\u0142.", title: "Selamat datang di pelatihan Ryczyw\u00f3\u0142.", gate: "Periksa di peta tujuan Anda. Lalu pilih modul yang diperlukan.", spoken: "Selamat datang di pelatihan lokasi Ryczyw\u00f3\u0142. Periksa peta terlebih dahulu dan pilih tempat yang benar: hotel, kantor, rumah kaca, gudang, atau halte. Petunjuk kerja, Reader, dan tablet tersedia dalam modul terpisah. Pilih hanya informasi yang Anda perlukan sekarang." },
      ne: { hint: "Ryczyw\u00f3\u0142 स्थानका लागि तालिम।", title: "Ryczyw\u00f3\u0142 तालिममा स्वागत छ।", gate: "तपाईं जाने स्थान नक्सामा जाँच गर्नुहोस्। त्यसपछि आवश्यक मोड्युल छान्नुहोस्।", spoken: "Ryczyw\u00f3\u0142 स्थानको तालिममा स्वागत छ। पहिले नक्सा हेर्नुहोस् र सही स्थान छान्नुहोस्: होटल, कार्यालय, ग्रीनहाउस, गोदाम वा बस स्टप। काम, Reader र ट्याब्लेटका निर्देशनहरू छुट्टाछुट्टै मोड्युलमा छन्। अहिले आवश्यक जानकारी मात्र छान्नुहोस्।" }
    },
    zgorzelec_bogatynia: {
      pl: { hint: "Dwa miejsca pracy: Zgorzelec i Bogatynia.", title: "Wybierz właściwy system pracy.", gate: "Zgorzelec i Bogatynia mają różny zakres pracy. Przeczytaj opis przed wyborem.", spoken: "Witaj. Ta lokalizacja obejmuje dwa różne miejsca pracy. Zgorzelec dotyczy magazynu bananów i korzysta z osobnego systemu. Bogatynia obejmuje szklarnię i magazyn, gdzie używa się Readerów i tabletów. Przed rozpoczęciem sprawdź, którego miejsca dotyczy Twoje szkolenie, a następnie wybierz właściwy system." },
      en: { hint: "Two workplaces: Zgorzelec and Bogatynia.", title: "Choose the correct work system.", gate: "Zgorzelec and Bogatynia have different work areas. Read the description before choosing.", spoken: "Welcome. This location covers two different workplaces. Zgorzelec is the banana warehouse and uses a separate system. Bogatynia includes the greenhouse and warehouse, where Readers and tablets are used. Before you start, check which place your training is for, then choose the correct system." },
      ua: { hint: "\u0414\u0432\u0430 \u043c\u0456\u0441\u0446\u044f \u0440\u043e\u0431\u043e\u0442\u0438: Zgorzelec \u0456 Bogatynia.", title: "\u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u0443 \u0441\u0438\u0441\u0442\u0435\u043c\u0443.", gate: "Zgorzelec \u0456 Bogatynia \u043c\u0430\u044e\u0442\u044c \u0440\u0456\u0437\u043d\u0456 \u043c\u0456\u0441\u0446\u044f \u0440\u043e\u0431\u043e\u0442\u0438. \u041f\u0435\u0440\u0435\u0434 \u0432\u0438\u0431\u043e\u0440\u043e\u043c \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0439\u0442\u0435 \u043e\u043f\u0438\u0441.", spoken: "\u0412\u0456\u0442\u0430\u044e. \u0426\u044f \u043b\u043e\u043a\u0430\u0446\u0456\u044f \u043c\u0430\u0454 \u0434\u0432\u0430 \u0440\u0456\u0437\u043d\u0456 \u043c\u0456\u0441\u0446\u044f \u0440\u043e\u0431\u043e\u0442\u0438. Zgorzelec \u2014 \u0446\u0435 \u043c\u0430\u0433\u0430\u0437\u0438\u043d \u0431\u0430\u043d\u0430\u043d\u0456\u0432 \u043e\u043a\u0440\u0435\u043c\u043e\u0457 \u0441\u0438\u0441\u0442\u0435\u043c\u0438. Bogatynia \u043c\u0430\u0454 \u0442\u0435\u043f\u043b\u0438\u0446\u044e \u0456 \u0441\u043a\u043b\u0430\u0434, \u0434\u0435 \u0432\u0438\u043a\u043e\u0440\u0438\u0441\u0442\u043e\u0432\u0443\u044e\u0442\u044c Reader \u0456 \u043f\u043b\u0430\u043d\u0448\u0435\u0442\u0438. \u041f\u0435\u0440\u0435\u0434 \u043f\u043e\u0447\u0430\u0442\u043a\u043e\u043c \u043f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435, \u0434\u043b\u044f \u044f\u043a\u043e\u0433\u043e \u043c\u0456\u0441\u0446\u044f \u043f\u0440\u0438\u0437\u043d\u0430\u0447\u0435\u043d\u0435 \u0432\u0430\u0448\u0435 \u043d\u0430\u0432\u0447\u0430\u043d\u043d\u044f, \u0456 \u043e\u0431\u0435\u0440\u0456\u0442\u044c \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u0443 \u0441\u0438\u0441\u0442\u0435\u043c\u0443." },
      ru: { hint: "\u0414\u0432\u0430 \u043c\u0435\u0441\u0442\u0430 \u0440\u0430\u0431\u043e\u0442\u044b: Zgorzelec \u0438 Bogatynia.", title: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u0443\u044e \u0441\u0438\u0441\u0442\u0435\u043c\u0443.", gate: "Zgorzelec \u0438 Bogatynia \u043e\u0442\u043b\u0438\u0447\u0430\u044e\u0442\u0441\u044f. \u041f\u0440\u043e\u0447\u0438\u0442\u0430\u0439\u0442\u0435 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u043f\u0435\u0440\u0435\u0434 \u0432\u044b\u0431\u043e\u0440\u043e\u043c.", spoken: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435. \u0417\u0434\u0435\u0441\u044c \u0434\u0432\u0430 \u0440\u0430\u0437\u043d\u044b\u0445 \u043c\u0435\u0441\u0442\u0430 \u0440\u0430\u0431\u043e\u0442\u044b. Zgorzelec \u2014 \u044d\u0442\u043e \u0441\u043a\u043b\u0430\u0434 \u0431\u0430\u043d\u0430\u043d\u043e\u0432 \u0441\u043e \u0441\u0432\u043e\u0435\u0439 \u0441\u0438\u0441\u0442\u0435\u043c\u043e\u0439. Bogatynia \u0432\u043a\u043b\u044e\u0447\u0430\u0435\u0442 \u0442\u0435\u043f\u043b\u0438\u0446\u0443 \u0438 \u0441\u043a\u043b\u0430\u0434, \u0433\u0434\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0442\u0441\u044f Reader \u0438 \u043f\u043b\u0430\u043d\u0448\u0435\u0442\u044b. \u041f\u0435\u0440\u0435\u0434 \u043d\u0430\u0447\u0430\u043b\u043e\u043c \u043f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435, \u043a\u043e\u0433\u043e \u043c\u0435\u0441\u0442\u0430 \u043a\u0430\u0441\u0430\u0435\u0442\u0441\u044f \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435, \u0438 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u0443\u044e \u0441\u0438\u0441\u0442\u0435\u043c\u0443." },
      az: { hint: "\u0130ki i\u015f yeri: Zgorzelec v\u0259 Bogatynia.", title: "D\u00fczg\u00fcn i\u015f sistemini se\u00e7in.", gate: "Zgorzelec v\u0259 Bogatynia f\u0259rqli i\u015f sah\u0259l\u0259ridir. Se\u00e7m\u0259zd\u0259n \u0259vv\u0259l a\u00e7\u0131qlaman\u0131 oxuyun.", spoken: "Salam. Bu b\u00f6lg\u0259d\u0259 iki f\u0259rqli i\u015f yeri var. Zgorzelec banan anbar\u0131d\u0131r v\u0259 ayr\u0131 sistemd\u0259n istifad\u0259 edir. Bogatynia istixana v\u0259 anbar\u0131 \u0259hat\u0259 edir; burada Reader v\u0259 plan\u015fetl\u0259rd\u0259n istifad\u0259 olunur. Ba\u015flamazdan \u0259vv\u0259l t\u0259liminizin hans\u0131 yer\u0259 aid oldu\u011funu yoxlay\u0131n v\u0259 d\u00fczg\u00fcn sistemi se\u00e7in." },
      es: { hint: "Dos lugares de trabajo: Zgorzelec y Bogatynia.", title: "Elige el sistema de trabajo correcto.", gate: "Zgorzelec y Bogatynia tienen actividades diferentes. Lee la descripci\u00f3n antes de elegir.", spoken: "Bienvenido. Esta ubicaci\u00f3n incluye dos lugares de trabajo diferentes. Zgorzelec es el almac\u00e9n de bananas y utiliza un sistema independiente. Bogatynia incluye el invernadero y el almac\u00e9n, donde se utilizan Readers y tabletas. Antes de empezar, comprueba para qu\u00e9 lugar es tu formaci\u00f3n y elige el sistema correcto." },
      fil: { hint: "Dalawang lugar ng trabaho: Zgorzelec at Bogatynia.", title: "Piliin ang tamang work system.", gate: "Magkaiba ang saklaw ng Zgorzelec at Bogatynia. Basahin ang paliwanag bago pumili.", spoken: "Maligayang pagdating. Kasama sa lokasyong ito ang dalawang magkaibang lugar ng trabaho. Ang Zgorzelec ay bodega ng saging at may sariling system. Ang Bogatynia ay may greenhouse at bodega kung saan ginagamit ang Reader at tablet. Bago magsimula, tingnan kung aling lugar ang para sa iyong training at piliin ang tamang system." },
      id: { hint: "Dua tempat kerja: Zgorzelec dan Bogatynia.", title: "Pilih sistem kerja yang benar.", gate: "Zgorzelec dan Bogatynia memiliki area kerja yang berbeda. Baca penjelasan sebelum memilih.", spoken: "Selamat datang. Lokasi ini mencakup dua tempat kerja yang berbeda. Zgorzelec adalah gudang pisang dan menggunakan sistem tersendiri. Bogatynia mencakup rumah kaca dan gudang, tempat Reader dan tablet digunakan. Sebelum mulai, periksa untuk tempat mana pelatihan Anda ditujukan, lalu pilih sistem yang benar." },
      ne: { hint: "दुई काम गर्ने स्थान: Zgorzelec र Bogatynia।", title: "सही काम प्रणाली छान्नुहोस्।", gate: "Zgorzelec र Bogatynia का काम फरक छन्। छान्नुअघि विवरण पढ्नुहोस्।", spoken: "स्वागत छ। यस स्थानमा दुई फरक काम गर्ने ठाउँ छन्। Zgorzelec केरा राख्ने गोदाम हो र यसको छुट्टै प्रणाली छ। Bogatynia मा ग्रीनहाउस र गोदाम छन्, जहाँ Reader र ट्याब्लेट प्रयोग हुन्छ। सुरु गर्नुअघि तपाईंको तालिम कुन स्थानका लागि हो जाँच गर्नुहोस् र सही प्रणाली छान्नुहोस्।" }
    }
  };

  const GENERIC_GUIDE_COPY = {
    pl: { hint: "Kr\u00f3tki przewodnik po systemie.", title: "Witaj w systemie Citronex.", gate: "Wybierz j\u0119zyk, pos\u0142uchaj przewodnika i przejd\u017a do wybranego miejsca.", spoken: "Witaj w systemie Citronex. Wybierz j\u0119zyk, a nast\u0119pnie miejsce pracy. Znajdziesz tu mapy, instrukcje, kontakty i wa\u017cne zasady." },
    en: { hint: "A short guide to the system.", title: "Welcome to the Citronex system.", gate: "Choose a language, listen to the guide and continue to your workplace.", spoken: "Welcome to the Citronex system. Choose a language and then choose your workplace. You will find maps, instructions, contacts and important rules here." },
    ua: { hint: "\u041a\u043e\u0440\u043e\u0442\u043a\u0438\u0439 \u043f\u0443\u0442\u0456\u0432\u043d\u0438\u043a \u0441\u0438\u0441\u0442\u0435\u043c\u043e\u044e.", title: "\u0412\u0456\u0442\u0430\u0454\u043c\u043e \u0443 \u0441\u0438\u0441\u0442\u0435\u043c\u0456 Citronex.", gate: "\u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043c\u043e\u0432\u0443, \u043f\u043e\u0441\u043b\u0443\u0445\u0430\u0439\u0442\u0435 \u043f\u0443\u0442\u0456\u0432\u043d\u0438\u043a\u0430 \u0456 \u043f\u0435\u0440\u0435\u0439\u0434\u0456\u0442\u044c \u0434\u043e \u0432\u0430\u0448\u043e\u0433\u043e \u043c\u0456\u0441\u0446\u044f \u0440\u043e\u0431\u043e\u0442\u0438.", spoken: "\u0412\u0456\u0442\u0430\u044e \u0443 \u0441\u0438\u0441\u0442\u0435\u043c\u0456 Citronex. \u041e\u0431\u0435\u0440\u0456\u0442\u044c \u043c\u043e\u0432\u0443, \u0430 \u043f\u043e\u0442\u0456\u043c \u043c\u0456\u0441\u0446\u0435 \u0440\u043e\u0431\u043e\u0442\u0438. \u0422\u0443\u0442 \u0454 \u043a\u0430\u0440\u0442\u0438, \u0456\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0456\u0457, \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u0438 \u0442\u0430 \u0432\u0430\u0436\u043b\u0438\u0432\u0456 \u043f\u0440\u0430\u0432\u0438\u043b\u0430." },
    ru: { hint: "\u041a\u043e\u0440\u043e\u0442\u043a\u0438\u0439 \u0433\u0438\u0434 \u043f\u043e \u0441\u0438\u0441\u0442\u0435\u043c\u0435.", title: "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 \u0441\u0438\u0441\u0442\u0435\u043c\u0443 Citronex.", gate: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u044f\u0437\u044b\u043a, \u043f\u043e\u0441\u043b\u0443\u0448\u0430\u0439\u0442\u0435 \u0433\u0438\u0434\u0430 \u0438 \u043f\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u043a \u043c\u0435\u0441\u0442\u0443 \u0440\u0430\u0431\u043e\u0442\u044b.", spoken: "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432 \u0441\u0438\u0441\u0442\u0435\u043c\u0443 Citronex. \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u044f\u0437\u044b\u043a, \u0430 \u0437\u0430\u0442\u0435\u043c \u043c\u0435\u0441\u0442\u043e \u0440\u0430\u0431\u043e\u0442\u044b. \u0417\u0434\u0435\u0441\u044c \u0435\u0441\u0442\u044c \u043a\u0430\u0440\u0442\u044b, \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438, \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b \u0438 \u0432\u0430\u0436\u043d\u044b\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u0430." },
    az: { hint: "Sistem haqq\u0131nda q\u0131sa b\u0259l\u0259d\u00e7i.", title: "Citronex sistemin\u0259 xo\u015f g\u0259lmisiniz.", gate: "Dili se\u00e7in, b\u0259l\u0259d\u00e7iy\u0259 qulaq as\u0131n v\u0259 i\u015f yeriniz\u0259 ke\u00e7in.", spoken: "Citronex sistemin\u0259 xo\u015f g\u0259lmisiniz. Dili, sonra is\u0259 i\u015f yerinizi se\u00e7in. Burada x\u0259rit\u0259l\u0259r, t\u0259limatlar, kontaktlar v\u0259 vacib qaydalar var." },
    es: { hint: "Gu\u00eda breve del sistema.", title: "Bienvenido al sistema Citronex.", gate: "Elige el idioma, escucha la gu\u00eda y pasa a tu lugar de trabajo.", spoken: "Bienvenido al sistema Citronex. Elige el idioma y despu\u00e9s tu lugar de trabajo. Aqu\u00ed encontrar\u00e1s mapas, instrucciones, contactos y normas importantes." },
    fil: { hint: "Maikling gabay sa system.", title: "Maligayang pagdating sa Citronex.", gate: "Pumili ng wika, pakinggan ang gabay at pumunta sa lugar ng trabaho.", spoken: "Maligayang pagdating sa sistema ng Citronex. Pumili ng wika at pagkatapos ay piliin ang lugar ng iyong trabaho. Narito ang mga mapa, tagubilin, contact at mahahalagang patakaran." },
    id: { hint: "Panduan singkat untuk sistem.", title: "Selamat datang di sistem Citronex.", gate: "Pilih bahasa, dengarkan panduan, lalu buka tempat kerja Anda.", spoken: "Selamat datang di sistem Citronex. Pilih bahasa, lalu pilih tempat kerja Anda. Di sini tersedia peta, petunjuk, kontak, dan aturan penting." },
    ne: { hint: "\u092a\u094d\u0930\u0923\u093e\u0932\u0940\u0915\u094b \u091b\u094b\u091f\u094b \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u0928\u0964", title: "Citronex \u092a\u094d\u0930\u0923\u093e\u0932\u0940\u092e\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u091b\u0964", gate: "\u092d\u093e\u0937\u093e \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d, \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u0928 \u0938\u0941\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0915\u093e\u092e \u0917\u0930\u094d\u0928\u0947 \u0938\u094d\u0925\u093e\u0928\u092e\u093e \u091c\u093e\u0928\u0941\u0939\u094b\u0938\u094d\u0964", spoken: "Citronex \u092a\u094d\u0930\u0923\u093e\u0932\u0940\u092e\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u091b\u0964 \u092a\u0939\u093f\u0932\u0947 \u092d\u093e\u0937\u093e \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d, \u0924\u094d\u092f\u0938\u092a\u091b\u093f \u0915\u093e\u092e \u0917\u0930\u094d\u0928\u0947 \u0938\u094d\u0925\u093e\u0928 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964 \u092f\u0939\u093e\u0901 \u0928\u0915\u094d\u0938\u093e, \u0928\u093f\u0930\u094d\u0926\u0947\u0936\u0928, \u0938\u092e\u094d\u092a\u0930\u094d\u0915 \u0930 \u092e\u0939\u0924\u094d\u0924\u094d\u0935\u092a\u0942\u0930\u094d\u0923 \u0928\u093f\u092f\u092e\u0939\u0930\u0942 \u091b\u0928\u094d\u0964" }
  };

  Object.assign(LOCATION_GUIDE_COPY.ryczywol.pl, { hint: "Szkolenie dla lokalizacji Ryczyw\u00f3\u0142.", title: "Witaj w szkoleniu Ryczyw\u00f3\u0142.", gate: "Sprawd\u017a map\u0119 miejsca, do kt\u00f3rego jedziesz. Potem wybierz potrzebny modu\u0142.", spoken: "Witaj w szkoleniu dla lokalizacji Ryczyw\u00f3\u0142. Najpierw sprawd\u017a map\u0119 i wybierz w\u0142a\u015bciwe miejsce: hotel, biuro, szklarni\u0119, magazyn albo przystanek. Instrukcje pracy oraz obs\u0142ugi Reader\u00f3w i tablet\u00f3w s\u0105 w osobnych modu\u0142ach. Wybierz tylko to, czego teraz potrzebujesz." });
  Object.assign(LOCATION_GUIDE_COPY.ryczywol.en, { hint: "Training for the Ryczyw\u00f3\u0142 location.", title: "Welcome to Ryczyw\u00f3\u0142 training." });
  Object.assign(LOCATION_GUIDE_COPY.zgorzelec_bogatynia.pl, { title: "Wybierz w\u0142a\u015bciwy system pracy.", gate: "Zgorzelec i Bogatynia maj\u0105 r\u00f3\u017cny zakres pracy. Przeczytaj opis przed wyborem.", spoken: "Witaj. Ta lokalizacja obejmuje dwa r\u00f3\u017cne miejsca pracy. Zgorzelec dotyczy magazynu banan\u00f3w i korzysta z osobnego systemu. Bogatynia obejmuje szklarni\u0119 i magazyn, gdzie u\u017cywa si\u0119 Reader\u00f3w i tablet\u00f3w. Przed rozpocz\u0119ciem sprawd\u017a, kt\u00f3rego miejsca dotyczy Twoje szkolenie, a nast\u0119pnie wybierz w\u0142a\u015bciwy system." });
  Object.assign(LOCATION_GUIDE_COPY.siechnice.ne, { hint: "Siechnice \u0938\u094d\u0925\u093e\u0928\u0915\u093e \u0932\u093e\u0917\u093f \u0924\u093e\u0932\u093f\u092e\u0964", title: "Siechnice \u0924\u093e\u0932\u093f\u092e\u092e\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u091b\u0964", gate: "\u092a\u0939\u093f\u0932\u0947 \u0928\u0915\u094d\u0938\u093e \u0939\u0947\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964 \u0924\u094d\u092f\u0938\u092a\u091b\u093f \u0906\u0935\u0936\u094d\u092f\u0915 \u092e\u094b\u0921\u094d\u092f\u0941\u0932 \u092e\u093e\u0924\u094d\u0930 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964", spoken: "Siechnice \u0938\u094d\u0925\u093e\u0928\u0915\u094b \u0924\u093e\u0932\u093f\u092e\u092e\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u091b\u0964 \u092a\u0939\u093f\u0932\u0947 \u0928\u0915\u094d\u0938\u093e \u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0915\u0939\u093e\u0901 \u091c\u093e\u0928\u0941\u092a\u0930\u094d\u091b \u0939\u0947\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964 \u092f\u0939\u093e\u0901 \u0917\u094d\u0930\u0940\u0928\u0939\u093e\u0909\u0938, \u0917\u094b\u0926\u093e\u092e, Reader \u0930 \u091f\u094d\u092f\u093e\u092c\u0932\u0947\u091f\u0915\u093e \u0928\u093f\u0930\u094d\u0926\u0947\u0936\u0928, \u0938\u092e\u094d\u092a\u0930\u094d\u0915 \u0930 \u092e\u0939\u0924\u094d\u0924\u094d\u0935\u092a\u0942\u0930\u094d\u0923 \u0928\u093f\u092f\u092e\u0939\u0930\u0942 \u091b\u0928\u094d\u0964 \u0906\u0935\u0936\u094d\u092f\u0915 \u092e\u094b\u0921\u094d\u092f\u0941\u0932 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u091a\u0930\u0923\u092c\u0926\u094d\u0927 \u0930\u0942\u092a\u092e\u093e \u0905\u0917\u093e\u0921\u093f \u092c\u0922\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964" });
  Object.assign(LOCATION_GUIDE_COPY.ryczywol.ne, { hint: "Ryczyw\u00f3\u0142 \u0938\u094d\u0925\u093e\u0928\u0915\u093e \u0932\u093e\u0917\u093f \u0924\u093e\u0932\u093f\u092e\u0964", title: "Ryczyw\u00f3\u0142 \u0924\u093e\u0932\u093f\u092e\u092e\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u091b\u0964", gate: "\u0924\u092a\u093e\u0908\u0902 \u091c\u093e\u0928\u0947 \u0938\u094d\u0925\u093e\u0928 \u0928\u0915\u094d\u0938\u093e\u092e\u093e \u091c\u093e\u0901\u091a \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964 \u0924\u094d\u092f\u0938\u092a\u091b\u093f \u0906\u0935\u0936\u094d\u092f\u0915 \u092e\u094b\u0921\u094d\u092f\u0941\u0932 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964", spoken: "Ryczyw\u00f3\u0142 \u0938\u094d\u0925\u093e\u0928\u0915\u094b \u0924\u093e\u0932\u093f\u092e\u092e\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u091b\u0964 \u092a\u0939\u093f\u0932\u0947 \u0928\u0915\u094d\u0938\u093e \u0939\u0947\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0938\u0939\u0940 \u0938\u094d\u0925\u093e\u0928 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d: \u0939\u094b\u091f\u0932, \u0915\u093e\u0930\u094d\u092f\u093e\u0932\u092f, \u0917\u094d\u0930\u0940\u0928\u0939\u093e\u0909\u0938, \u0917\u094b\u0926\u093e\u092e \u0935\u093e \u092c\u0938 \u0938\u094d\u091f\u092a\u0964 \u0915\u093e\u092e, Reader \u0930 \u091f\u094d\u092f\u093e\u092c\u0932\u0947\u091f\u0915\u093e \u0928\u093f\u0930\u094d\u0926\u0947\u0936\u0928\u0939\u0930\u0942 \u091b\u0941\u091f\u094d\u091f\u093e\u091b\u0941\u091f\u094d\u091f\u0948 \u092e\u094b\u0921\u094d\u092f\u0941\u0932\u092e\u093e \u091b\u0928\u094d\u0964 \u0905\u0939\u093f\u0932\u0947 \u0906\u0935\u0936\u094d\u092f\u0915 \u0938\u0942\u091a\u0928\u093e \u092e\u093e\u0924\u094d\u0930 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964" });
  Object.assign(LOCATION_GUIDE_COPY.zgorzelec_bogatynia.ne, { hint: "\u0926\u0941\u0908 \u0915\u093e\u092e \u0917\u0930\u094d\u0928\u0947 \u0938\u094d\u0925\u093e\u0928: Zgorzelec \u0930 Bogatynia।", title: "\u0938\u0939\u0940 \u0915\u093e\u092e \u092a\u094d\u0930\u0923\u093e\u0932\u0940 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d।", gate: "Zgorzelec \u0930 Bogatynia \u0915\u093e \u0915\u093e\u092e \u092b\u0930\u0915 \u091b\u0928\u094d। \u091b\u093e\u0928\u094d\u0928\u0941\u0905\u0918\u093f \u0935\u093f\u0935\u0930\u0923 \u092a\u0922\u094d\u0928\u0941\u0939\u094b\u0938\u094d।", spoken: "\u0938\u094d\u0935\u093e\u0917\u0924 \u091b। \u092f\u0938 \u0938\u094d\u0925\u093e\u0928\u092e\u093e \u0926\u0941\u0908 \u092b\u0930\u0915 \u0915\u093e\u092e \u0917\u0930\u094d\u0928\u0947 \u0920\u093e\u0909\u0901 \u091b\u0928\u094d। Zgorzelec \u0915\u0947\u0930\u093e \u0930\u093e\u0916\u094d\u0928\u0947 \u0917\u094b\u0926\u093e\u092e \u0939\u094b \u0930 \u092f\u0938\u0915\u094b \u091b\u0941\u091f\u094d\u091f\u0948 \u092a\u094d\u0930\u0923\u093e\u0932\u0940 \u091b। Bogatynia \u092e\u093e \u0917\u094d\u0930\u0940\u0928\u0939\u093e\u0909\u0938 \u0930 \u0917\u094b\u0926\u093e\u092e \u091b\u0928\u094d, \u091c\u0939\u093e\u0901 Reader \u0930 \u091f\u094d\u092f\u093e\u092c\u0932\u0947\u091f \u092a\u094d\u0930\u092f\u094b\u0917 \u0939\u0941\u0928\u094d\u091b। \u0938\u0941\u0930\u0941 \u0917\u0930\u094d\u0928\u0941\u0905\u0918\u093f \u0924\u092a\u093e\u0908\u0902\u0915\u094b \u0924\u093e\u0932\u093f\u092e \u0915\u0941\u0928 \u0938\u094d\u0925\u093e\u0928\u0915\u093e \u0932\u093e\u0917\u093f \u0939\u094b \u091c\u093e\u0901\u091a \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0938\u0939\u0940 \u092a\u094d\u0930\u0923\u093e\u0932\u0940 \u091b\u093e\u0928\u094d\u0928\u0941\u0939\u094b\u0938\u094d।" });

  function getLocationGuideCopy(language) {
    const locationCopy = LOCATION_GUIDE_COPY[locationKey];
    if (locationCopy && locationCopy[language]) return locationCopy[language];
    return GENERIC_GUIDE_COPY[language] || GENERIC_GUIDE_COPY.en;
  }
  function findVoice(locale) {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const exact = locale.toLowerCase();
    const prefix = exact.split("-")[0];
    const matching = voices.filter((voice) => {
      const language = String(voice.lang || "").toLowerCase();
      return language === exact || language.startsWith(`${prefix}-`);
    });
    return matching.sort((left, right) => {
      const score = (voice) => {
        const language = String(voice.lang || "").toLowerCase();
        const name = String(voice.name || "").toLowerCase();
        let value = language === exact ? 100 : 60;
        if (/natural|neural|google|microsoft|enhanced|premium|siri/.test(name)) value += 35;
        if (/compact|espeak|robot/.test(name)) value -= 20;
        if (voice.default) value += 3;
        return value;
      };
      return score(right) - score(left);
    })[0] || null;
  }
  function waitForVoice(locale, callback) {
    const synth = window.speechSynthesis;
    if (!synth) { callback(null); return; }
    const immediate = findVoice(locale);
    if (immediate) { callback(immediate); return; }
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      synth.removeEventListener?.("voiceschanged", finish);
      callback(findVoice(locale));
    };
    synth.addEventListener?.("voiceschanged", finish, { once: true });
    window.setTimeout(finish, 450);
  }
  const SHORT_SCREEN_COPY = {
  "pl": {
    "hint": "Krótki przewodnik.",
    "title": "Witaj!",
    "intro": "Wybierz język i rozpocznij.",
    "gate": "Smok pokaże Ci, co zrobić.",
    "steps": [
      [
        "1",
        "Wybierz miejsce",
        "Mapa pracy."
      ],
      [
        "2",
        "Posłuchaj",
        "Krótka instrukcja."
      ],
      [
        "3",
        "Przejdź dalej",
        "Otworzy się lokalizacja."
      ]
    ]
  },
  "en": {
    "hint": "A short guide.",
    "title": "Welcome!",
    "intro": "Choose a language and start.",
    "gate": "The dragon will show you what to do.",
    "steps": [
      [
        "1",
        "Choose a place",
        "Work map."
      ],
      [
        "2",
        "Listen",
        "A short guide."
      ],
      [
        "3",
        "Continue",
        "Your location will open."
      ]
    ]
  },
  "ua": {
    "hint": "Короткий гід.",
    "title": "Вітаємо!",
    "intro": "Оберіть мову та почніть.",
    "gate": "Дракон покаже, що робити.",
    "steps": [
      [
        "1",
        "Оберіть місце",
        "Карта роботи."
      ],
      [
        "2",
        "Послухайте",
        "Коротка інструкція."
      ],
      [
        "3",
        "Перейдіть далі",
        "Відкриється локація."
      ]
    ]
  },
  "ru": {
    "hint": "Короткий гид.",
    "title": "Добро пожаловать!",
    "intro": "Выберите язык и начните.",
    "gate": "Дракон покажет, что делать.",
    "steps": [
      [
        "1",
        "Выберите место",
        "Карта работы."
      ],
      [
        "2",
        "Послушайте",
        "Короткая инструкция."
      ],
      [
        "3",
        "Перейдите дальше",
        "Откроется локация."
      ]
    ]
  },
  "az": {
    "hint": "Qısa bələdçi.",
    "title": "Salam!",
    "intro": "Dil seçin və başlayın.",
    "gate": "Əjdaha nə etməli olduğunuzu göstərəcək.",
    "steps": [
      [
        "1",
        "Məkan seçin",
        "İş xəritəsi."
      ],
      [
        "2",
        "Qulaq asın",
        "Qısa bələdçi."
      ],
      [
        "3",
        "Davam edin",
        "Məkan açılacaq."
      ]
    ]
  },
  "es": {
    "hint": "Guía breve.",
    "title": "¡Hola!",
    "intro": "Elige un idioma y empieza.",
    "gate": "El dragón te mostrará qué hacer.",
    "steps": [
      [
        "1",
        "Elige un lugar",
        "Mapa de trabajo."
      ],
      [
        "2",
        "Escucha",
        "Guía breve."
      ],
      [
        "3",
        "Continúa",
        "Se abrirá tu ubicación."
      ]
    ]
  },
  "fil": {
    "hint": "Maikling gabay.",
    "title": "Kumusta!",
    "intro": "Pumili ng wika at magsimula.",
    "gate": "Ipapakita ng dragon ang dapat gawin.",
    "steps": [
      [
        "1",
        "Pumili ng lugar",
        "Mapa ng trabaho."
      ],
      [
        "2",
        "Makinig",
        "Maikling gabay."
      ],
      [
        "3",
        "Magpatuloy",
        "Bubukas ang lokasyon."
      ]
    ]
  },
  "id": {
    "hint": "Panduan singkat.",
    "title": "Selamat datang!",
    "intro": "Pilih bahasa dan mulai.",
    "gate": "Naga akan menunjukkan apa yang harus dilakukan.",
    "steps": [
      [
        "1",
        "Pilih tempat",
        "Peta kerja."
      ],
      [
        "2",
        "Dengarkan",
        "Panduan singkat."
      ],
      [
        "3",
        "Lanjutkan",
        "Lokasi akan terbuka."
      ]
    ]
  },
  "ne": {
    "hint": "छोटो मार्गदर्शन?",
    "title": "स्वागत छ!",
    "intro": "भाषा छान्नुहोस् र सुरु गर्नुहोस्?",
    "gate": "ड्रागनले के गर्ने भनेर देखाउनेछ?",
    "steps": [
      [
        "1",
        "स्थान छान्नुहोस्",
        "कामको नक्सा?"
      ],
      [
        "2",
        "सुन्नुहोस्",
        "छोटो निर्देशन?"
      ],
      [
        "3",
        "अगाडि बढ्नुहोस्",
        "तपाईंको स्थान खुल्नेछ?"
      ]
    ]
  }
};
  const BUILD = "20260717-location-copy";
  const params = new URLSearchParams(window.location.search);
  const locationKey = params.get("location");
  const hasLocation = Object.prototype.hasOwnProperty.call(TARGETS, locationKey);
  const genericGuide = !locationKey;
  const validLocation = hasLocation || genericGuide;
  const forceGuide = params.get("welcome") === "1";
  const queryLang = LANGS.includes(params.get("lang")) ? params.get("lang") : "";
  const storedLang = LANGS.includes(localStorage.getItem("cxDragonGuide:lang")) ? localStorage.getItem("cxDragonGuide:lang") : "";
  function detectBrowserLanguage() {
    const candidates = [navigator.language, ...(Array.isArray(navigator.languages) ? navigator.languages : [])];
    for (const raw of candidates) {
      const primary = String(raw || "").toLowerCase().split(/[-_]/)[0];
      const normalized = primary === "uk" ? "ua" : primary;
      if (LANGS.includes(normalized)) return normalized;
    }
    return "en";
  }
  const browserLang = detectBrowserLanguage();
  let lang = queryLang || storedLang || browserLang;
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
    lang = LANGS.includes(nextLang) ? nextLang : "en";
    localStorage.setItem("cxDragonGuide:lang", lang);
    document.documentElement.lang = lang === "ua" ? "uk" : lang;
    languageSelect.value = lang;
    const copy = { ...t(), ...(TRANSLATION_REFINEMENTS[lang] || {}) };
    const locationCopy = getLocationGuideCopy(lang);
    setText("locationLabel", copy.locationLabel);
    setText("locationName", LOCATION_NAMES[locationKey] || "CITRONEX");
    setText("locationHint", locationCopy.hint);
    setText("guideTitle", locationCopy.title);
    setText("speechLabel", SPEECH_LABELS[lang] || SPEECH_LABELS.pl);
    setText("speechText", locationCopy.spoken);
    startButton.textContent = copy.start;
    openButton.textContent = copy.open;
    pauseButton.textContent = audio.paused ? copy.pause : copy.resume;
    replayButton.textContent = copy.replay;
    skipButton.textContent = copy.skip;
    audioStatus.textContent = copy.reading;
    setText("gateTitle", copy.gateTitle);
    setText("gateText", locationCopy.gate);
    if (audioSourceReady && !audio.paused) stopPlayback();
  }

  function setGateVisible(visible) { languageGate.hidden = !visible; if (visible) languageGate.querySelector("button")?.focus(); }

  function targetUrl() {
    if (genericGuide) {
      const portal = new URL("https://oleksandrkiris.github.io/citronex-hydra-project/");
      portal.searchParams.set("lang", lang);
      return portal.toString();
    }
    const target = new URL(TARGETS[locationKey]);
    target.searchParams.set("lang", lang);
    target.searchParams.set("from", "dragon");
    target.searchParams.set("intro", "done");
    return target.toString();
  }

  function finishAndOpen() {
    if (!validLocation) return;
    if (hasLocation) localStorage.setItem(`cxDragonGuide:${locationKey}:seen:${BUILD}`, "1");
    window.location.assign(targetUrl());
  }

  function wasSeen() { return hasLocation && localStorage.getItem(`cxDragonGuide:${locationKey}:seen:${BUILD}`) === "1"; }

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
    const phrases = [getLocationGuideCopy(lang).spoken];
    const locale = SPEECH_LOCALES[lang] || "en-US";
    const profile = VOICE_PROFILES[lang] || VOICE_PROFILES.en;
    waitForVoice(locale, (voice) => {
      const utterance = new SpeechSynthesisUtterance(phrases.join(" "));
      utterance.lang = locale;
      utterance.rate = profile.rate;
      utterance.pitch = profile.pitch;
      if (voice) utterance.voice = voice;
      utterance.onstart = () => { setSpeaking(true); audioStatus.textContent = t().playing; };
      utterance.onend = () => { speechFallbackActive = false; completeGuide(); };
      utterance.onerror = () => { speechFallbackActive = false; setSpeaking(false); audioStatus.textContent = t().fallback; openButton.hidden = false; };
      window.speechSynthesis.speak(utterance);
    });
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
    if (hasLocation) {
      startSpeechGuide();
      return;
    }
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

  function startSpeechGuide() {
    clearTimeout(redirectTimer);
    startButton.hidden = true;
    openButton.hidden = true;
    pauseButton.hidden = true;
    replayButton.hidden = false;
    speakFallback();
  }

  function replay() {
    clearTimeout(redirectTimer);
    if (hasLocation) {
      startSpeechGuide();
      return;
    }
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
  } else if (hasLocation && wasSeen() && !forceGuide) {
    document.body.classList.add("is-redirecting");
    window.setTimeout(finishAndOpen, 80);
  } else {
    app.hidden = false;
    applyLanguage(lang);
    if (!queryLang && !storedLang) setGateVisible(true);
  }

  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
