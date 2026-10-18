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
  const TEXT_LANGS = ["ka", "tr", "hy"];
  LANGS.push(...TEXT_LANGS);
  function textOnlyLanguage() { return TEXT_LANGS.includes(lang); }
  // Reuse the service labels already published in the PrimServ arrival guide.
  const SERVICE_LABELS = {
    pl: ["Firma PrimServ", "Oferty pracy", "Bot Telegram", "Wróć do Hydry"],
    ru: ["Компания PrimServ", "Вакансии", "Telegram-бот", "Вернуться в Hydra"],
    ua: ["Компанія PrimServ", "Вакансії", "Telegram-бот", "Повернутися до Hydra"],
    en: ["Company PrimServ", "Vacancies", "Telegram bot", "Back to Hydra"],
    az: ["PrimServ şirkəti", "Vakansiyalar", "Telegram botu", "Hydra-ya qayıt"],
    es: ["Empresa PrimServ", "Vacantes", "Bot de Telegram", "Volver a Hydra"],
    fil: ["Kumpanya PrimServ", "Mga bakanteng trabaho", "Telegram bot", "Bumalik sa Hydra"],
    id: ["Perusahaan PrimServ", "Lowongan kerja", "Bot Telegram", "Kembali ke Hydra"],
    ne: ["PrimServ कम्पनी", "रिक्त पदहरू", "Telegram बोट", "Hydra मा फर्कनुहोस्"]
  };
  function readSaved(key) {
    try { return localStorage.getItem(key) || ""; } catch { return ""; }
  }
  function savePreference(key, value) {
    try { localStorage.setItem(key, value); return true; } catch { return false; /* Storage is optional. */ }
  }
  const params = new URLSearchParams(window.location.search);
  const requestedLang = params.get("lang") || "";
  const savedLocation = readSaved('cxDragonGuide:location');
  let lastLocationChoice = Object.hasOwn(TARGETS, savedLocation) ? savedLocation : '';
  let locationMemoryOnly = false;
  let locationKey = params.get("location") || null;
  let hasLocation = Object.prototype.hasOwnProperty.call(TARGETS, locationKey);
  let genericGuide = !locationKey;
  let validLocation = hasLocation || genericGuide;
  const forceGuide = params.get("welcome") === "1";
  let fallbackLanguage = false;
  const normalizedLang = requestedLang === "uk" ? "ua" : fallbackLanguage ? "en" : requestedLang;
  const queryLang = LANGS.includes(normalizedLang) ? normalizedLang : "";
  const savedLang = readSaved("cxDragonGuide:lang");
  const storedLang = LANGS.includes(savedLang) ? savedLang : "";
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
  let speechFallbackActive = false;
  let redirectTimer = null;
  let playbackGeneration = 0;
  let playbackActive = false;

  const $ = (id) => document.getElementById(id);
  const app = $("guideApp");
  const invalidState = $("invalidState");
  const languageGate = $("languageGate");
  const gateBackground = document.querySelectorAll(".page-shell > :not(#languageGate)");
  const gateInertState = new Map();
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

  // Local draft translations of accepted EN guide facts; not native-reviewed.
  const TEXT_PATH = {
  "tr": {
    "copy": [
      "Rehber bağlantısını kopyala",
      "Bağlantı kopyalandı.",
      "Aşağıdaki bağlantıyı elle kopyalayın.",
      "Rehber bağlantısı"
    ],
    "services": [
      "PrimServ şirketi",
      "İş ilanları",
      "Telegram botu",
      "Hydra’ya dön"
    ],
    "steps": [
      "1. Çalışma yerinizi seçin.",
      "2. Haritayı ve ihtiyacınız olan talimatları okuyun.",
      "3. Eğitimi açın veya rehber bağlantısını kopyalayın."
    ],
    "audio": "Metin Türkçedir. İsteğe bağlı mevcut ses İngilizcedir. Otomatik başlamaz.",
    "target": "Eğitim sayfasına Türkçe dil seçimi ile geçilir. Bazı eğitim içeriklerinin Türkçe çevirisi henüz bulunmayabilir.",
    "location": "Çalışma yeri seçin",
    "generic": "Genel rehber",
    "invalidTitle": "Konum bulunamadı",
    "invalidText": "Hydra’ya dönün veya geçerli bir çalışma yeri bağlantısı açın.",
    "genericText": "Citronex sistemine hoş geldiniz. Dilinizi ve çalışma yerinizi seçin. Burada haritalar, talimatlar, iletişim bilgileri ve önemli kurallar bulunur.",
    "locations": {
      "siechnice": "Siechnice eğitimine hoş geldiniz. Önce haritayı açın ve nereye gitmeniz gerektiğini kontrol edin. Sayfada sera, depo, Reader (kayıt okuyucu cihaz) ve tablet talimatları, iletişim bilgileri ve önemli kurallar bulunur. İhtiyacınız olan bölümü seçin ve adım adım izleyin.",
      "ryczywol": "Ryczywół eğitimine hoş geldiniz. Önce haritayı kontrol edin ve doğru yeri seçin: otel, ofis, sera, depo veya otobüs durağı. İş, Reader (kayıt okuyucu cihaz) ve tablet talimatları ayrı bölümlerdedir. Şimdi ihtiyacınız olan bilgiyi seçin.",
      "zgorzelec_bogatynia": "Bu konum iki ayrı çalışma yerini kapsar. Zgorzelec muz deposudur ve ayrı bir sistem kullanır. Bogatynia’da sera ve depo bulunur; Reader (kayıt okuyucu cihaz) ve tabletler kullanılır. Başlamadan önce eğitiminizin hangi yer için olduğunu kontrol edin ve doğru sistemi seçin."
    },
    "controls": {
      "locationLabel": "KONUM",
      "title": "Citronex rehberine hoş geldiniz.",
      "intro": "Dil ve çalışma yeri seçin. Metni okuyun.",
      "start": "İngilizce sesi dinle",
      "open": "Eğitimi aç",
      "pause": "Duraklat",
      "resume": "Devam et",
      "replay": "Tekrar dinle",
      "skip": "Ses olmadan devam et",
      "reading": "Metni okuyabilirsiniz. Ses isteğe bağlıdır ve İngilizcedir.",
      "playing": "İngilizce ses çalıyor. Metni kendi dilinizde okuyabilirsiniz.",
      "paused": "Ses duraklatıldı.",
      "finished": "Ses bitti. Eğitimi açabilirsiniz.",
      "fallback": "Ses kullanılamıyor. Metni okuyabilir ve eğitimi açabilirsiniz.",
      "gateTitle": "Dil seçin",
      "gateText": "Önce dili, sonra çalışma yerini seçin."
    }
  },
  "ka": {
    "copy": [
      "გზამკვლევის ბმულის კოპირება",
      "ბმული დაკოპირებულია.",
      "ქვემოთ მოცემული ბმული ხელით დააკოპირეთ.",
      "გზამკვლევის ბმული"
    ],
    "services": [
      "კომპანია PrimServ",
      "ვაკანსიები",
      "Telegram ბოტი",
      "Hydra-ზე დაბრუნება"
    ],
    "steps": [
      "1. აირჩიეთ თქვენი სამუშაო ადგილი.",
      "2. წაიკითხეთ რუკა და საჭირო ინსტრუქციები.",
      "3. გახსენით სწავლება ან დააკოპირეთ გზამკვლევის ბმული."
    ],
    "audio": "ტექსტი ქართულადაა. არსებული აუდიო არჩევითია და ინგლისურენოვანია. ის ავტომატურად არ ირთვება.",
    "target": "სწავლების გვერდს ქართული ენის არჩევანით გახსნით. ზოგი სასწავლო მასალის ქართული თარგმანი შეიძლება ჯერ არ იყოს ხელმისაწვდომი.",
    "location": "აირჩიეთ სამუშაო ადგილი",
    "generic": "ზოგადი გზამკვლევი",
    "invalidTitle": "ლოკაცია ვერ მოიძებნა",
    "invalidText": "დაბრუნდით Hydra-ზე ან გახსენით სწორი სამუშაო ადგილის ბმული.",
    "genericText": "კეთილი იყოს თქვენი მობრძანება Citronex-ის სისტემაში. აირჩიეთ ენა და სამუშაო ადგილი. აქ ნახავთ რუკებს, ინსტრუქციებს, საკონტაქტო ინფორმაციას და მნიშვნელოვან წესებს.",
    "locations": {
      "siechnice": "კეთილი იყოს თქვენი მობრძანება Siechnice-ის სწავლებაზე. ჯერ გახსენით რუკა და შეამოწმეთ, სად უნდა მიხვიდეთ. გვერდზე არის სათბურის, საწყობის, Reader-ის (აღრიცხვის წამკითხველი მოწყობილობის) და პლანშეტის ინსტრუქციები, საკონტაქტო ინფორმაცია და მნიშვნელოვანი წესები. აირჩიეთ საჭირო განყოფილება და მიჰყევით ნაბიჯებს.",
      "ryczywol": "კეთილი იყოს თქვენი მობრძანება Ryczywół-ის სწავლებაზე. ჯერ შეამოწმეთ რუკა და აირჩიეთ სწორი ადგილი: სასტუმრო, ოფისი, სათბური, საწყობი ან ავტობუსის გაჩერება. სამუშაოს, Reader-ის (აღრიცხვის წამკითხველი მოწყობილობის) და პლანშეტის ინსტრუქციები ცალკე განყოფილებებშია. აირჩიეთ ახლა საჭირო ინფორმაცია.",
      "zgorzelec_bogatynia": "ეს ლოკაცია ორ სხვადასხვა სამუშაო ადგილს მოიცავს. Zgorzelec ბანანის საწყობია და ცალკე სისტემას იყენებს. Bogatynia-ში არის სათბური და საწყობი, სადაც Reader-ს (აღრიცხვის წამკითხველ მოწყობილობას) და პლანშეტებს იყენებენ. დაწყებამდე შეამოწმეთ, რომელი ადგილისთვისაა სწავლება და აირჩიეთ სწორი სისტემა."
    },
    "controls": {
      "locationLabel": "ლოკაცია",
      "title": "კეთილი იყოს თქვენი მობრძანება Citronex-ის გზამკვლევში.",
      "intro": "აირჩიეთ ენა და სამუშაო ადგილი. წაიკითხეთ ტექსტი.",
      "start": "ინგლისური აუდიოს მოსმენა",
      "open": "სწავლების გახსნა",
      "pause": "პაუზა",
      "resume": "გაგრძელება",
      "replay": "ხელახლა მოსმენა",
      "skip": "გაგრძელება აუდიოს გარეშე",
      "reading": "შეგიძლიათ წაიკითხოთ ტექსტი. აუდიო არჩევითია და ინგლისურენოვანია.",
      "playing": "ინგლისური აუდიო ირთვება. ტექსტი შეგიძლიათ თქვენს ენაზე წაიკითხოთ.",
      "paused": "აუდიო შეჩერებულია.",
      "finished": "აუდიო დასრულდა. შეგიძლიათ გახსნათ სწავლება.",
      "fallback": "აუდიო მიუწვდომელია. შეგიძლიათ წაიკითხოთ ტექსტი და გახსნათ სწავლება.",
      "gateTitle": "აირჩიეთ ენა",
      "gateText": "ჯერ აირჩიეთ ენა, შემდეგ სამუშაო ადგილი."
    }
  },
  "hy": {
    "copy": [
      "Պատճենել ուղեցույցի հղումը",
      "Հղումը պատճենված է։",
      "Ստորև նշված հղումը պատճենեք ձեռքով։",
      "Ուղեցույցի հղում"
    ],
    "services": [
      "PrimServ ընկերություն",
      "Թափուր աշխատատեղեր",
      "Telegram բոտ",
      "Վերադառնալ Hydra"
    ],
    "steps": [
      "1. Ընտրեք ձեր աշխատանքի վայրը։",
      "2. Կարդացեք քարտեզը և անհրաժեշտ հրահանգները։",
      "3. Բացեք ուսուցումը կամ պատճենեք ուղեցույցի հղումը։"
    ],
    "audio": "Տեքստը հայերեն է։ Առկա ձայնագրությունն ընտրովի է և անգլերեն։ Այն ինքնաբերաբար չի միանում։",
    "target": "Ուսուցման էջը կբացվի հայերենի ընտրությամբ։ Որոշ ուսումնական նյութերի հայերեն թարգմանությունը կարող է դեռ հասանելի չլինել։",
    "location": "Ընտրեք աշխատանքի վայրը",
    "generic": "Ընդհանուր ուղեցույց",
    "invalidTitle": "Տեղանքը չի գտնվել",
    "invalidText": "Վերադարձեք Hydra կամ բացեք աշխատանքի վայրի ճիշտ հղումը։",
    "genericText": "Բարի գալուստ Citronex համակարգ։ Ընտրեք լեզուն և աշխատանքի վայրը։ Այստեղ կգտնեք քարտեզներ, հրահանգներ, կապի տվյալներ և կարևոր կանոններ։",
    "locations": {
      "siechnice": "Բարի գալուստ Siechnice-ի ուսուցում։ Նախ բացեք քարտեզը և ստուգեք, թե ուր պետք է գնաք։ Էջում կան ջերմոցի, պահեստի, Reader-ի (հաշվառման ընթերցող սարքի) և պլանշետի հրահանգներ, կապի տվյալներ և կարևոր կանոններ։ Ընտրեք անհրաժեշտ բաժինը և հետևեք քայլերին։",
      "ryczywol": "Բարի գալուստ Ryczywół-ի ուսուցում։ Նախ ստուգեք քարտեզը և ընտրեք ճիշտ տեղը՝ հյուրանոց, գրասենյակ, ջերմոց, պահեստ կամ ավտոբուսի կանգառ։ Աշխատանքի, Reader-ի (հաշվառման ընթերցող սարքի) և պլանշետի հրահանգները առանձին բաժիններում են։ Ընտրեք հիմա անհրաժեշտ տեղեկությունը։",
      "zgorzelec_bogatynia": "Այս տեղանքը ներառում է երկու տարբեր աշխատավայր։ Zgorzelec-ը բանանի պահեստ է և օգտագործում է առանձին համակարգ։ Bogatynia-ում կան ջերմոց և պահեստ, որտեղ օգտագործվում են Reader (հաշվառման ընթերցող սարք) և պլանշետներ։ Սկսելուց առաջ ստուգեք, թե որ վայրի համար է ուսուցումը և ընտրեք ճիշտ համակարգը։"
    },
    "controls": {
      "locationLabel": "ՏԵՂԱՆՔ",
      "title": "Բարի գալուստ Citronex-ի ուղեցույց։",
      "intro": "Ընտրեք լեզուն և աշխատանքի վայրը։ Կարդացեք տեքստը։",
      "start": "Լսել անգլերեն ձայնագրությունը",
      "open": "Բացել ուսուցումը",
      "pause": "Դադար",
      "resume": "Շարունակել",
      "replay": "Կրկին լսել",
      "skip": "Շարունակել առանց ձայնի",
      "reading": "Կարող եք կարդալ տեքստը։ Ձայնագրությունն ընտրովի է և անգլերեն։",
      "playing": "Նվագարկվում է անգլերեն ձայնագրությունը։ Տեքստը կարող եք կարդալ ձեր լեզվով։",
      "paused": "Ձայնագրությունը դադարեցված է։",
      "finished": "Ձայնագրությունն ավարտվեց։ Կարող եք բացել ուսուցումը։",
      "fallback": "Ձայնագրությունն անհասանելի է։ Կարող եք կարդալ տեքստը և բացել ուսուցումը։",
      "gateTitle": "Ընտրեք լեզուն",
      "gateText": "Նախ ընտրեք լեզուն, ապա աշխատանքի վայրը։"
    }
  }
};
  const LINK_COPY = {
    pl: ['Kopiuj link do przewodnika', 'Link skopiowany.', 'Skopiuj ręcznie poniższy link.', 'Link do przewodnika'],
    en: ['Copy guide link', 'Link copied.', 'Copy the link below manually.', 'Guide link'],
    ua: ['Копіювати посилання на гід', 'Посилання скопійовано.', 'Скопіюйте посилання нижче вручну.', 'Посилання на гід'],
    ru: ['Копировать ссылку на гид', 'Ссылка скопирована.', 'Скопируйте ссылку ниже вручную.', 'Ссылка на гид'],
    az: ['Bələdçi keçidini kopyala', 'Keçid kopyalandı.', 'Aşağıdakı keçidi əl ilə kopyalayın.', 'Bələdçi keçidi'],
    es: ['Copiar enlace de la guía', 'Enlace copiado.', 'Copia manualmente el enlace de abajo.', 'Enlace de la guía'],
    fil: ['Kopyahin ang link ng gabay', 'Nakopya ang link.', 'Manwal na kopyahin ang link sa ibaba.', 'Link ng gabay'],
    id: ['Salin tautan panduan', 'Tautan disalin.', 'Salin tautan di bawah secara manual.', 'Tautan panduan'],
    ne: ['गाइडको लिङ्क प्रतिलिपि गर्नुहोस्', 'लिङ्क प्रतिलिपि भयो।', 'तलको लिङ्क आफैँ प्रतिलिपि गर्नुहोस्।', 'गाइडको लिङ्क']
  };
  for (const code of TEXT_LANGS) {
    const entry = TEXT_PATH[code];
    TEXT[code] = entry.controls;
    SERVICE_LABELS[code] = entry.services;
    LINK_COPY[code] = entry.copy;
    GENERIC_GUIDE_COPY[code] = { title: entry.controls.title, hint: entry.controls.intro, gate: entry.controls.gateText, spoken: entry.genericText };
    for (const location of Object.keys(TARGETS)) LOCATION_GUIDE_COPY[location][code] = {
      title: entry.controls.title, hint: LOCATION_NAMES[location], gate: entry.controls.gateText, spoken: entry.locations[location]
    };
  }
  const LOCATION_UI = {
  "pl": [
    "Wybierz miejsce pracy",
    "Przewodnik ogólny",
    "Ostatnie miejsce pracy",
    "Wróć do ostatniego miejsca",
    "Usuń wybór",
    "Wybór miejsca usunięty.",
    "Nieznane miejsce pracy",
    "Wybierz prawidłowe miejsce z listy.",
    "Zapis na urządzeniu jest niedostępny. Wybór działa na tej stronie."
  ],
  "en": [
    "Choose workplace",
    "General guide",
    "Last workplace",
    "Return to last workplace",
    "Clear selection",
    "Workplace selection cleared.",
    "Unknown workplace",
    "Choose a valid workplace from the list.",
    "Device storage is unavailable. The selection works on this page."
  ],
  "ua": [
    "Оберіть місце роботи",
    "Загальний гід",
    "Останнє місце роботи",
    "Повернутися до останнього місця",
    "Очистити вибір",
    "Вибір місця очищено.",
    "Невідоме місце роботи",
    "Оберіть правильне місце зі списку.",
    "Збереження на пристрої недоступне. Вибір діє на цій сторінці."
  ],
  "ru": [
    "Выберите место работы",
    "Общий гид",
    "Последнее место работы",
    "Вернуться к последнему месту",
    "Очистить выбор",
    "Выбор места очищен.",
    "Неизвестное место работы",
    "Выберите правильное место из списка.",
    "Сохранение на устройстве недоступно. Выбор действует на этой странице."
  ],
  "az": [
    "İş yerini seçin",
    "Ümumi bələdçi",
    "Son iş yeri",
    "Son iş yerinə qayıt",
    "Seçimi sil",
    "İş yeri seçimi silindi.",
    "Naməlum iş yeri",
    "Siyahıdan düzgün iş yerini seçin.",
    "Cihazda saxlama mümkün deyil. Seçim bu səhifədə işləyir."
  ],
  "es": [
    "Elige el lugar de trabajo",
    "Guía general",
    "Último lugar de trabajo",
    "Volver al último lugar",
    "Borrar selección",
    "Selección del lugar borrada.",
    "Lugar de trabajo desconocido",
    "Elige un lugar válido de la lista.",
    "No se puede guardar en el dispositivo. La selección funciona en esta página."
  ],
  "fil": [
    "Piliin ang lugar ng trabaho",
    "Pangkalahatang gabay",
    "Huling lugar ng trabaho",
    "Bumalik sa huling lugar",
    "Alisin ang napili",
    "Naalis ang napiling lugar.",
    "Hindi kilalang lugar ng trabaho",
    "Pumili ng tamang lugar sa listahan.",
    "Hindi makapag-save sa device. Gumagana ang napili sa pahinang ito."
  ],
  "id": [
    "Pilih tempat kerja",
    "Panduan umum",
    "Tempat kerja terakhir",
    "Kembali ke tempat terakhir",
    "Hapus pilihan",
    "Pilihan tempat kerja dihapus.",
    "Tempat kerja tidak dikenal",
    "Pilih tempat kerja yang valid dari daftar.",
    "Penyimpanan perangkat tidak tersedia. Pilihan berlaku di halaman ini."
  ],
  "ne": [
    "कार्यस्थल छान्नुहोस्",
    "सामान्य मार्गदर्शन",
    "पछिल्लो कार्यस्थल",
    "पछिल्लो कार्यस्थलमा फर्कनुहोस्",
    "छनोट हटाउनुहोस्",
    "कार्यस्थलको छनोट हटाइयो।",
    "अज्ञात कार्यस्थल",
    "सूचीबाट सही कार्यस्थल छान्नुहोस्।",
    "उपकरणमा सुरक्षित गर्न सकिँदैन। छनोट यस पृष्ठमा काम गर्छ।"
  ],
  "ka": [
    "აირჩიეთ სამუშაო ადგილი",
    "ზოგადი გზამკვლევი",
    "ბოლო სამუშაო ადგილი",
    "ბოლო სამუშაო ადგილზე დაბრუნება",
    "არჩევანის გასუფთავება",
    "სამუშაო ადგილის არჩევანი გასუფთავდა.",
    "უცნობი სამუშაო ადგილი",
    "სიიდან აირჩიეთ სწორი სამუშაო ადგილი.",
    "მოწყობილობაზე შენახვა მიუწვდომელია. არჩევანი ამ გვერდზე მოქმედებს."
  ],
  "tr": [
    "Çalışma yeri seçin",
    "Genel rehber",
    "Son çalışma yeri",
    "Son çalışma yerine dön",
    "Seçimi temizle",
    "Çalışma yeri seçimi temizlendi.",
    "Bilinmeyen çalışma yeri",
    "Listeden geçerli bir çalışma yeri seçin.",
    "Cihaza kaydetme kullanılamıyor. Seçim bu sayfada geçerlidir."
  ],
  "hy": [
    "Ընտրեք աշխատանքի վայրը",
    "Ընդհանուր ուղեցույց",
    "Վերջին աշխատանքի վայրը",
    "Վերադառնալ վերջին վայրին",
    "Մաքրել ընտրությունը",
    "Աշխատանքի վայրի ընտրությունը մաքրված է։",
    "Անհայտ աշխատանքի վայր",
    "Ցանկից ընտրեք ճիշտ աշխատանքի վայր։",
    "Սարքում պահպանումն անհասանելի է։ Ընտրությունը գործում է այս էջում։"
  ]
};
  function renderLocationControls() {
    const labels = LOCATION_UI[lang] || LOCATION_UI.en;
    setText('locationSelectLabel', labels[0]);
    setText('genericLocationOption', labels[1]);
    $('locationSelect').value = hasLocation ? locationKey : '';
    setText('lastLocationLabel', labels[2]);
    setText('lastLocationName', LOCATION_NAMES[lastLocationChoice] || '');
    setText('returnLocation', labels[3]);
    setText('clearLocation', labels[4]);
    $('lastLocationPanel').hidden = !lastLocationChoice;
    $('clearLocation').hidden = !(lastLocationChoice || hasLocation);
    $('locationChoiceStatus').textContent = locationMemoryOnly ? labels[8] : '';
    setText('invalidTitle', labels[6]);
    setText('invalidText', labels[7]);
  }
  function selectLocation(selected, clearLast = false) {
    if (selected && !Object.hasOwn(TARGETS, selected)) return;
    const departedLocation = hasLocation ? locationKey : '';
    locationKey = selected || null;
    hasLocation = Boolean(selected);
    genericGuide = !selected;
    validLocation = true;
    if (clearLast) {
      lastLocationChoice = '';
      try { localStorage.removeItem('cxDragonGuide:location'); locationMemoryOnly = false; } catch { locationMemoryOnly = true; }
    } else if (selected) {
      lastLocationChoice = selected;
      locationMemoryOnly = !savePreference('cxDragonGuide:location', selected);
    } else if (departedLocation) {
      lastLocationChoice = departedLocation;
      locationMemoryOnly = !savePreference('cxDragonGuide:location', departedLocation);
    }
    try {
      const current = new URL(window.location.href);
      current.search = '';
      if (current.hash !== '#guideApp') current.hash = '';
      current.searchParams.set('lang', lang);
      if (selected) current.searchParams.set('location', selected);
      current.searchParams.set('welcome', '1');
      history.replaceState(history.state, '', current.toString());
    } catch { /* In-memory selection remains usable when History is denied. */ }
    app.hidden = false;
    invalidState.hidden = true;
    applyLanguage(lang);
    if (clearLast) {
      const labels = LOCATION_UI[lang] || LOCATION_UI.en;
      setText('locationChoiceStatus', labels[5] + (locationMemoryOnly ? ' ' + labels[8] : ''));
      $('locationSelect').focus();
    }
  }
  const MEMO_UI = {
  "pl": [
    "Pobierz notatkę (.txt)",
    "Tekst notatki do ręcznego zapisania",
    "Poproszono o pobranie. Jeśli plik się nie pojawi, zapisz poniższy tekst ręcznie.",
    "Pobieranie jest niedostępne. Zapisz poniższy tekst ręcznie."
  ],
  "en": [
    "Download memo (.txt)",
    "Memo text for manual saving",
    "Download requested. If no file appears, save the text below manually.",
    "Download is unavailable. Save the text below manually."
  ],
  "ua": [
    "Завантажити пам’ятку (.txt)",
    "Текст пам’ятки для ручного збереження",
    "Завантаження запрошено. Якщо файл не з’явиться, збережіть текст нижче вручну.",
    "Завантаження недоступне. Збережіть текст нижче вручну."
  ],
  "ru": [
    "Скачать памятку (.txt)",
    "Текст памятки для ручного сохранения",
    "Скачивание запрошено. Если файл не появился, сохраните текст ниже вручную.",
    "Скачивание недоступно. Сохраните текст ниже вручную."
  ],
  "az": [
    "Yaddaş qeydi endir (.txt)",
    "Əl ilə saxlamaq üçün qeyd mətni",
    "Endirmə tələb edildi. Fayl görünməzsə, aşağıdakı mətni əl ilə saxlayın.",
    "Endirmə mümkün deyil. Aşağıdakı mətni əl ilə saxlayın."
  ],
  "es": [
    "Descargar nota (.txt)",
    "Texto de la nota para guardar manualmente",
    "Descarga solicitada. Si no aparece el archivo, guarda el texto de abajo manualmente.",
    "La descarga no está disponible. Guarda el texto de abajo manualmente."
  ],
  "fil": [
    "I-download ang paalala (.txt)",
    "Teksto ng paalala para sa manwal na pag-save",
    "Hiniling ang download. Kung walang file, manwal na i-save ang teksto sa ibaba.",
    "Hindi available ang download. Manwal na i-save ang teksto sa ibaba."
  ],
  "id": [
    "Unduh catatan (.txt)",
    "Teks catatan untuk disimpan manual",
    "Unduhan diminta. Jika file tidak muncul, simpan teks di bawah secara manual.",
    "Unduhan tidak tersedia. Simpan teks di bawah secara manual."
  ],
  "ne": [
    "स्मरणपत्र डाउनलोड गर्नुहोस् (.txt)",
    "आफैँ सुरक्षित गर्न मिल्ने स्मरणपत्रको पाठ",
    "डाउनलोड अनुरोध गरियो। फाइल नआए तलको पाठ आफैँ सुरक्षित गर्नुहोस्।",
    "डाउनलोड उपलब्ध छैन। तलको पाठ आफैँ सुरक्षित गर्नुहोस्।"
  ],
  "ka": [
    "სამახსოვროს ჩამოტვირთვა (.txt)",
    "სამახსოვროს ტექსტი ხელით შესანახად",
    "ჩამოტვირთვა მოთხოვნილია. თუ ფაილი არ გამოჩნდა, ქვემოთ მოცემული ტექსტი ხელით შეინახეთ.",
    "ჩამოტვირთვა მიუწვდომელია. ქვემოთ მოცემული ტექსტი ხელით შეინახეთ."
  ],
  "tr": [
    "Bilgi notunu indir (.txt)",
    "Elle kaydetmek için bilgi notu metni",
    "İndirme istendi. Dosya görünmezse aşağıdaki metni elle kaydedin.",
    "İndirme kullanılamıyor. Aşağıdaki metni elle kaydedin."
  ],
  "hy": [
    "Ներբեռնել հուշաթերթը (.txt)",
    "Հուշաթերթի տեքստը ձեռքով պահպանելու համար",
    "Ներբեռնումը պահանջված է։ Եթե ֆայլը չի հայտնվում, ստորև նշված տեքստը պահպանեք ձեռքով։",
    "Ներբեռնումն անհասանելի է։ Ստորև նշված տեքստը պահպանեք ձեռքով։"
  ]
};
  const MEMO_COPY = {
  "pl": [
    "Kopiuj tekst notatki",
    "Tekst notatki skopiowany.",
    "Kopiowanie niedostępne. Zaznaczony tekst skopiuj ręcznie."
  ],
  "en": [
    "Copy memo text",
    "Memo text copied.",
    "Copy unavailable. Copy the selected text manually."
  ],
  "ua": [
    "Скопіювати текст пам’ятки",
    "Текст пам’ятки скопійовано.",
    "Копіювання недоступне. Скопіюйте виділений текст вручну."
  ],
  "ru": [
    "Скопировать текст памятки",
    "Текст памятки скопирован.",
    "Копирование недоступно. Скопируйте выделенный текст вручную."
  ],
  "az": [
    "Qeyd mətnini kopyala",
    "Qeyd mətni kopyalandı.",
    "Kopyalama mümkün deyil. Seçilmiş mətni əl ilə kopyalayın."
  ],
  "es": [
    "Copiar texto de la nota",
    "Texto de la nota copiado.",
    "No se puede copiar. Copia el texto seleccionado manualmente."
  ],
  "fil": [
    "Kopyahin ang teksto ng paalala",
    "Nakopya ang teksto ng paalala.",
    "Hindi makopya. Manwal na kopyahin ang napiling teksto."
  ],
  "id": [
    "Salin teks catatan",
    "Teks catatan disalin.",
    "Tidak dapat menyalin. Salin teks yang dipilih secara manual."
  ],
  "ne": [
    "स्मरणपत्रको पाठ प्रतिलिपि गर्नुहोस्",
    "स्मरणपत्रको पाठ प्रतिलिपि भयो।",
    "प्रतिलिपि उपलब्ध छैन। चयन गरिएको पाठ आफैँ प्रतिलिपि गर्नुहोस्।"
  ],
  "ka": [
    "სამახსოვროს ტექსტის კოპირება",
    "სამახსოვროს ტექსტი დაკოპირებულია.",
    "კოპირება მიუწვდომელია. მონიშნული ტექსტი ხელით დააკოპირეთ."
  ],
  "tr": [
    "Bilgi notu metnini kopyala",
    "Bilgi notu metni kopyalandı.",
    "Kopyalama kullanılamıyor. Seçili metni elle kopyalayın."
  ],
  "hy": [
    "Պատճենել հուշաթերթի տեքստը",
    "Հուշաթերթի տեքստը պատճենված է։",
    "Պատճենումն անհասանելի է։ Ընտրված տեքստը պատճենեք ձեռքով։"
  ]
};
  let clipboardGeneration = 0;
  let memoObjectURL = null;
  let memoCleanupTimer = null;
  function releaseMemoURL() {
    if (memoCleanupTimer !== null) clearTimeout(memoCleanupTimer);
    memoCleanupTimer = null;
    const pendingURL = memoObjectURL;
    memoObjectURL = null;
    if (pendingURL && typeof URL.revokeObjectURL === 'function') {
      try { URL.revokeObjectURL(pendingURL); } catch { /* Optional browser cleanup must not block readable fallback. */ }
    }
  }
  function resetMemo() {
    clipboardGeneration++;
    setText('copyMemo', (MEMO_COPY[lang] || MEMO_COPY.en)[0]);
    $('copyMemo').disabled = !validLocation;
    releaseMemoURL();
    const labels = MEMO_UI[lang] || MEMO_UI.en;
    setText('downloadMemo', labels[0]);
    setText('memoTextLabel', labels[1]);
    setText('memoStatus', '');
    $('memoText').value = '';
    $('manualMemo').hidden = true;
    $('downloadMemo').disabled = !validLocation;
  }
  function publicMemoText() {
    const copy = getLocationGuideCopy(lang);
    const site = hasLocation ? LOCATION_NAMES[locationKey] : (LOCATION_UI[lang] || LOCATION_UI.en)[1];
    const destination = new URL(hasLocation ? TARGETS[locationKey] : 'https://oleksandrkiris.github.io/citronex-hydra-project/');
    destination.searchParams.set('lang', lang);
    const textPath = TEXT_PATH[lang];
    return [copy.title, site, '', copy.spoken,
      ...(textPath ? ['', ...textPath.steps, '', textPath.audio, textPath.target] : []),
      '', (LINK_COPY[lang] || LINK_COPY.en)[3] + ': ' + publicGuideURL(),
      t().open + ': ' + destination.toString(), ''].join('\n');
  }
  function downloadMemo() {
    if (!validLocation) return;
    clipboardGeneration++;
    releaseMemoURL();
    const text = publicMemoText();
    const labels = MEMO_UI[lang] || MEMO_UI.en;
    const field = $('memoText');
    field.value = text;
    $('manualMemo').hidden = false;
    let anchor;
    try {
      anchor = document.createElement('a');
      if (!('download' in anchor) || typeof Blob !== 'function' ||
          typeof URL.createObjectURL !== 'function' || typeof URL.revokeObjectURL !== 'function') throw Error('Download unavailable');
      const safeLang = LANGS.includes(lang) ? lang : 'en';
      const safeSite = hasLocation && Object.hasOwn(TARGETS, locationKey) ? locationKey : 'generic';
      const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
      memoObjectURL = url;
      anchor.href = url;
      anchor.download = `primserv-guide-${safeLang}-${safeSite}.txt`;
      document.body.appendChild(anchor);
      anchor.click();
      setText('memoStatus', labels[2]);
      memoCleanupTimer = window.setTimeout(() => { if (memoObjectURL === url) releaseMemoURL(); }, 1000);
    } catch {
      releaseMemoURL();
      setText('memoStatus', labels[3]);
      field.focus();
      field.select();
    } finally { anchor?.remove(); }
  }
  async function copyMemo() {
    if (!validLocation) return;
    const generation = ++clipboardGeneration;
    releaseMemoURL();
    const text = publicMemoText();
    const labels = MEMO_COPY[lang] || MEMO_COPY.en;
    const field = $('memoText');
    field.value = text;
    $('manualMemo').hidden = false;
    setText('memoStatus', '');
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') throw Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if (generation !== clipboardGeneration) return;
      setText('memoStatus', labels[1]);
    } catch {
      if (generation !== clipboardGeneration) return;
      setText('memoStatus', labels[2]);
      field.focus();
      field.select();
    }
  }
  function publicGuideURL() {
    const url = new URL('https://oleksandrkiris.github.io/citronex-dragon-guide/');
    url.searchParams.set('lang', fallbackLanguage ? requestedLang : lang);
    if (hasLocation) url.searchParams.set('location', locationKey);
    url.searchParams.set('welcome', '1');
    if (new URL(window.location.href).hash === '#guideApp') url.hash = 'guideApp';
    return url.toString();
  }
  function resetGuideCopy() {
    clipboardGeneration++;
    const copy = LINK_COPY[lang] || LINK_COPY.en;
    setText('copyGuideLink', copy[0]);
    setText('copyGuideStatus', '');
    setText('guideLinkLabel', copy[3]);
    $('manualGuideLink').hidden = true;
    $('guideLinkURL').value = publicGuideURL();
  }
  async function copyGuideLink() {
    const generation = ++clipboardGeneration;
    const url = publicGuideURL();
    setText('copyGuideStatus', '');
    $('manualGuideLink').hidden = true;
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') throw Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      if (generation !== clipboardGeneration) return;
      setText('copyGuideStatus', (LINK_COPY[lang] || LINK_COPY.en)[1]);
    } catch {
      if (generation !== clipboardGeneration) return;
      const input = $('guideLinkURL');
      input.value = url;
      $('manualGuideLink').hidden = false;
      setText('copyGuideStatus', (LINK_COPY[lang] || LINK_COPY.en)[2]);
      input.focus();
      input.select();
    }
  }

  function t() { return TEXT[lang] || TEXT.pl; }
  function setText(id, value) { const node = $(id); if (node) node.textContent = value; }

  function applyLanguage(nextLang, manualChoice = false) {
    if (manualChoice) fallbackLanguage = false;
    stopPlayback();
    lang = LANGS.includes(nextLang) ? nextLang : "en";
    savePreference("cxDragonGuide:lang", lang);
    try {
      const current = new URL(window.location.href);
      current.searchParams.set("lang", fallbackLanguage && lang === "en" ? requestedLang : lang);
      history.replaceState(history.state, "", current.toString());
    } catch { /* Embedded browser history may be restricted. */ }
    const portal = new URL("https://oleksandrkiris.github.io/citronex-hydra-project/");
    portal.searchParams.set("lang", lang);
    document.querySelectorAll("[data-hydra-link]").forEach(link => { link.href = portal.toString(); });
    const services = SERVICE_LABELS[lang] || SERVICE_LABELS.en;
    ["companyLink", "jobsLink", "botLink", "hydraLink"].forEach((id, index) => setText(id, services[index]));
    const jobs = new URL("https://oleksandrkiris.github.io/kiris-jobs/");
    jobs.searchParams.set("lang", lang === "ua" ? "uk" : lang);
    const jobsLink = $("jobsLink");
    if (jobsLink) jobsLink.href = jobs.toString();
    const fallbackNote = $("languageFallback");
    if (fallbackNote) {
      fallbackNote.hidden = !(fallbackLanguage && lang === "en");
      fallbackNote.textContent = `${({ ka: "ქართული", tr: "Türkçe", hy: "Հայերեն" })[requestedLang] || ""} → English (EN)`;
    }
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
    pauseButton.textContent = copy.pause;
    startButton.hidden = false;
    openButton.hidden = true;
    pauseButton.hidden = true;
    replayButton.hidden = true;
    replayButton.textContent = copy.replay;
    skipButton.textContent = copy.skip;
    audioStatus.textContent = copy.reading;
    setText("gateTitle", copy.gateTitle);
    setText("languageLabel", copy.gateTitle);
    setText("gateText", locationCopy.gate);
    const textPath = TEXT_PATH[lang];
    $('textPathControls').hidden = !textPath;
    $('audioLanguageNotice').hidden = !textPath;
    $('targetLanguageNotice').hidden = !textPath;
    if (textPath) {
      setText('audioLanguageNotice', textPath.audio);
      setText('targetLanguageNotice', textPath.target);
      setText('locationSelectLabel', textPath.location);
      setText('genericLocationOption', textPath.generic);
      $('locationSelect').value = hasLocation ? locationKey : '';
      textPath.steps.forEach((step, index) => setText('textStep' + (index + 1), step));
      setText('speechLabel', textPath.controls.intro);
      $('guideActions').setAttribute('aria-label', textPath.controls.title);
      setText('invalidTitle', textPath.invalidTitle);
      setText('invalidText', textPath.invalidText);
      setText('invalidReturn', textPath.services[3]);
      openButton.hidden = false;
    } else {
      $('guideActions').setAttribute('aria-label', 'Sterowanie przewodnikiem');
      setText('invalidTitle', 'Nie wybrano lokalizacji');
      setText('invalidText', 'Wróć do głównego portalu HYDRA i wybierz miejsce pracy.');
      setText('invalidReturn', 'Wróć do portalu');
    }
    renderLocationControls();
    resetGuideCopy();
    resetMemo();
  }

  function setGateVisible(visible) {
    languageGate.hidden = !visible;
    gateBackground.forEach(node => {
      if (visible) {
        if (!gateInertState.has(node)) gateInertState.set(node, Boolean(node.inert));
        node.inert = true;
      } else if (gateInertState.has(node)) {
        node.inert = gateInertState.get(node);
        gateInertState.delete(node);
      }
    });
    if (visible) languageGate.querySelector(`[data-gate-lang="${lang}"]`)?.focus();
    else startButton.focus();
  }

  languageGate.addEventListener("keydown", event => {
    if (languageGate.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setGateVisible(false);
      return;
    }
    if (event.key !== "Tab") return;
    const buttons = Array.from(languageGate.querySelectorAll("[data-gate-lang]"));
    const first = buttons[0], last = buttons[buttons.length - 1];
    if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  });

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
    stopPlayback();
    if (hasLocation) savePreference(`cxDragonGuide:${locationKey}:seen:${BUILD}`, "1");
    window.location.assign(targetUrl());
  }

  function wasSeen() { return hasLocation && readSaved(`cxDragonGuide:${locationKey}:seen:${BUILD}`) === "1"; }

  function setSpeaking(active) { dragonWrap.classList.toggle("is-speaking", active); }

  function updateStep() {
    const elapsed = audio.duration && Number.isFinite(audio.currentTime / audio.duration) ? audio.currentTime / audio.duration : 0;
    const stepIndex = Math.min(2, Math.floor(elapsed * 3));
    document.querySelectorAll(".guide-step").forEach((step, index) => step.classList.toggle("is-active", index === stepIndex));
  }

  function stopSpeechFallback() { if (window.speechSynthesis) window.speechSynthesis.cancel(); speechFallbackActive = false; }

  function showSpeechState(paused) {
    setSpeaking(!paused);
    startButton.hidden = true;
    openButton.hidden = true;
    pauseButton.hidden = false;
    replayButton.hidden = false;
    pauseButton.textContent = paused ? t().resume : t().pause;
    audioStatus.textContent = paused ? t().paused : t().playing;
  }

  function speakFallback() {
    if (textOnlyLanguage()) {
      playbackActive = false;
      setSpeaking(false);
      audioStatus.textContent = t().fallback;
      openButton.hidden = false;
      pauseButton.hidden = true;
      return;
    }
    if (speechFallbackActive) return;
    if (!window.speechSynthesis) { playbackActive = false; audioStatus.textContent = t().fallback; openButton.hidden = false; pauseButton.hidden = true; return; }
    stopSpeechFallback();
    speechFallbackActive = true;
    const generation = playbackGeneration;
    const isCurrent = () => generation === playbackGeneration && playbackActive;
    const phrases = [getLocationGuideCopy(lang).spoken];
    const locale = SPEECH_LOCALES[lang] || "en-US";
    const profile = VOICE_PROFILES[lang] || VOICE_PROFILES.en;
    waitForVoice(locale, (voice) => {
      if (!isCurrent()) return;
      const utterance = new SpeechSynthesisUtterance(phrases.join(" "));
      utterance.lang = locale;
      utterance.rate = profile.rate;
      utterance.pitch = profile.pitch;
      if (voice) utterance.voice = voice;
      utterance.onstart = () => { if (isCurrent()) showSpeechState(false); };
      utterance.onpause = () => { if (isCurrent()) showSpeechState(true); };
      utterance.onresume = () => { if (isCurrent()) showSpeechState(false); };
      utterance.onend = () => { if (!isCurrent()) return; speechFallbackActive = false; completeGuide(); };
      utterance.onerror = () => { if (!isCurrent()) return; playbackActive = false; speechFallbackActive = false; setSpeaking(false); audioStatus.textContent = t().fallback; openButton.hidden = false; pauseButton.hidden = true; };
      // cancel() clears the queue but retains its paused state. A user-requested
      // replay or new-language start must release that state before speaking.
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    });
  }

  function prepareAudio() {
    const nextSource = AUDIO[lang] || AUDIO.en;
    // A failed media resource needs a new load cycle on explicit start/replay.
    // Keep the healthy recording buffered; never retry from an error event.
    if (audio.src.endsWith(nextSource) && !audio.error) return;
    stopSpeechFallback();
    audio.src = nextSource;
    audio.load();
  }

  function completeGuide() {
    if (!playbackActive) return;
    playbackActive = false;
    const generation = playbackGeneration;
    setSpeaking(false);
    pauseButton.hidden = true;
    replayButton.hidden = false;
    openButton.hidden = false;
    startButton.hidden = true;
    audioStatus.textContent = t().finished;
    if (textOnlyLanguage()) return;
    clearTimeout(redirectTimer);
    redirectTimer = window.setTimeout(() => { if (generation === playbackGeneration) finishAndOpen(); }, 1100);
  }

  function startPlayback() {
    if (hasLocation && !textOnlyLanguage()) {
      startSpeechGuide();
      return;
    }
    stopPlayback();
    playbackActive = true;
    prepareAudio();
    const generation = playbackGeneration;
    audio.play().then(() => {
      if (generation !== playbackGeneration || !playbackActive) return;
      setSpeaking(true);
      startButton.hidden = true;
      openButton.hidden = true;
      pauseButton.hidden = false;
      replayButton.hidden = false;
      audioStatus.textContent = t().playing;
    }).catch(() => {
      if (generation !== playbackGeneration || !playbackActive) return;
      setSpeaking(false);
      audioStatus.textContent = t().fallback;
      speakFallback();
    });
  }

  function stopPlayback() {
    // Invalidate callbacks before pause/cancel can dispatch their own events.
    playbackGeneration += 1;
    playbackActive = false;
    clearTimeout(redirectTimer);
    redirectTimer = null;
    audio.pause();
    stopSpeechFallback();
    setSpeaking(false);
  }

  function startSpeechGuide() {
    stopPlayback();
    playbackActive = true;
    startButton.hidden = true;
    openButton.hidden = true;
    pauseButton.hidden = true;
    replayButton.hidden = false;
    speakFallback();
  }

  function replay() {
    if (hasLocation && !textOnlyLanguage()) {
      startSpeechGuide();
      return;
    }
    stopPlayback();
    playbackActive = true;
    prepareAudio();
    audio.currentTime = 0;
    startButton.hidden = true;
    openButton.hidden = true;
    pauseButton.hidden = false;
    replayButton.hidden = false;
    const generation = playbackGeneration;
    audio.play().then(() => { if (generation !== playbackGeneration || !playbackActive) return; setSpeaking(true); pauseButton.textContent = t().pause; audioStatus.textContent = t().playing; }).catch(() => { if (generation === playbackGeneration && playbackActive) speakFallback(); });
  }

  function togglePause() {
    if (speechFallbackActive) {
      const resume = window.speechSynthesis.paused;
      if (resume) window.speechSynthesis.resume();
      else window.speechSynthesis.pause();
      showSpeechState(!resume);
      return;
    }
    if (audio.paused) {
      const generation = playbackGeneration;
      audio.play().then(() => { if (generation !== playbackGeneration || !playbackActive) return; setSpeaking(true); pauseButton.textContent = t().pause; audioStatus.textContent = t().playing; }).catch(() => { if (generation === playbackGeneration && playbackActive) speakFallback(); });
    } else {
      playbackGeneration += 1;
      audio.pause(); setSpeaking(false); pauseButton.textContent = t().resume; audioStatus.textContent = t().paused;
    }
  }

  audio.addEventListener("timeupdate", updateStep);
  audio.addEventListener("ended", () => { if (playbackActive && !speechFallbackActive) completeGuide(); });
  audio.addEventListener("pause", () => { if (!audio.ended && !speechFallbackActive) setSpeaking(false); });
  audio.addEventListener("error", () => { if (playbackActive && !speechFallbackActive) { audioStatus.textContent = t().fallback; speakFallback(); } });
  languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value, true));
  startButton.addEventListener("click", startPlayback);
  openButton.addEventListener("click", finishAndOpen);
  pauseButton.addEventListener("click", togglePause);
  replayButton.addEventListener("click", replay);
  skipButton.addEventListener("click", finishAndOpen);
  $("copyGuideLink").addEventListener("click", copyGuideLink);
  $("downloadMemo").addEventListener("click", downloadMemo);
  $("copyMemo").addEventListener("click", copyMemo);
  window.addEventListener("pagehide", () => { clipboardGeneration++; releaseMemoURL(); });
  $('locationSelect').addEventListener('change', () => selectLocation($('locationSelect').value));
  $('returnLocation').addEventListener('click', () => { if (lastLocationChoice) selectLocation(lastLocationChoice); });
  $('clearLocation').addEventListener('click', () => selectLocation('', true));
  languageGate.querySelectorAll("[data-gate-lang]").forEach((button) => button.addEventListener("click", () => { applyLanguage(button.dataset.gateLang, true); setGateVisible(false); }));

  if (!validLocation) {
    invalidState.hidden = false;
    applyLanguage(lang);
  } else {
    app.hidden = false;
    applyLanguage(lang);
    if (!queryLang && !storedLang) setGateVisible(true);
  }

  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
