// src/script.js

const translations = {
  en: {
    title: 'Base64 Image Converter',
    uploadLabel: '1. Upload an image',
    toBase64Btn: 'Image → Base64',
    base64OutputPlaceholder: 'Base64 code will appear here...',
    decodeLabel: '2. Paste Base64 to decode',
    base64InputPlaceholder: 'Paste base64 code...',
    toImgBtn: 'Base64 → Image',
    note: 'Your data never leaves your browser. Everything works locally and securely.',
    errorNoImage: 'Please select an image.',
    errorNoBase64: 'Enter base64 code.',
    errorInvalidBase64: 'Invalid base64 code or unsupported format.'
  },
  ru: {
    title: 'Конвертер изображений Base64',
    uploadLabel: '1. Загрузите изображение',
    toBase64Btn: 'В изображение → Base64',
    base64OutputPlaceholder: 'Base64 код появится здесь...',
    decodeLabel: '2. Вставьте Base64 для декодирования',
    base64InputPlaceholder: 'Вставьте base64 код...',
    toImgBtn: 'Base64 → В изображение',
    note: 'Данные не покидают ваш браузер. Всё работает локально и безопасно.',
    errorNoImage: 'Пожалуйста, выберите изображение.',
    errorNoBase64: 'Введите base64 код.',
    errorInvalidBase64: 'Некорректный base64 код или неподдерживаемый формат.'
  },
  es: {
    title: 'Convertidor de Imágenes Base64',
    uploadLabel: '1. Sube una imagen',
    toBase64Btn: 'Imagen → Base64',
    base64OutputPlaceholder: 'El código Base64 aparecerá aquí...',
    decodeLabel: '2. Pega Base64 para decodificar',
    base64InputPlaceholder: 'Pega el código base64...',
    toImgBtn: 'Base64 → Imagen',
    note: 'Tus datos nunca salen de tu navegador. Todo funciona localmente y de forma segura.',
    errorNoImage: 'Por favor, selecciona una imagen.',
    errorNoBase64: 'Introduce el código base64.',
    errorInvalidBase64: 'Código base64 inválido o formato no soportado.'
  }
};

function updateText(lang) {
  document.querySelectorAll('[data-i18n]').forEach((elem) => {
    const key = elem.getAttribute('data-i18n');
    if (translations[lang][key]) {
      elem.textContent = translations[lang][key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((elem) => {
    const key = elem.getAttribute('data-i18n-placeholder');
    if (translations[lang][key]) {
      elem.placeholder = translations[lang][key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '🌙';
  } else {
    themeToggle.textContent = '☀️';
  }
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Language
  const languageSwitcher = document.getElementById('language-switcher');
  const savedLanguage = localStorage.getItem('language') || 'en';
  languageSwitcher.value = savedLanguage;
  document.documentElement.lang = savedLanguage;
  updateText(savedLanguage);
  languageSwitcher.addEventListener('change', (e) => {
    const lang = e.target.value;
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    updateText(lang);
  });

  // Base64 logic
  const imgInput = document.getElementById('imgInput');
  const toBase64Btn = document.getElementById('toBase64Btn');
  const base64Output = document.getElementById('base64Output');
  const base64Input = document.getElementById('base64Input');
  const toImgBtn = document.getElementById('toImgBtn');
  const imgPreview = document.getElementById('imgPreview');

  function getLang() {
    return document.getElementById('language-switcher').value;
  }

  toBase64Btn.onclick = () => {
    const file = imgInput.files[0];
    if (!file) {
      base64Output.value = translations[getLang()].errorNoImage;
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      base64Output.value = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  toImgBtn.onclick = () => {
    const b64 = base64Input.value.trim();
    imgPreview.innerHTML = '';
    if (!b64) {
      imgPreview.innerHTML = `<span class="error">${translations[getLang()].errorNoBase64}</span>`;
      return;
    }
    let src = b64;
    if (!/^data:image\//.test(b64)) {
      src = 'data:image/png;base64,' + b64;
    }
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Decoded Image';
    img.onload = () => {
      imgPreview.appendChild(img);
    };
    img.onerror = () => {
      imgPreview.innerHTML = `<span class="error">${translations[getLang()].errorInvalidBase64}</span>`;
    };
  };
});