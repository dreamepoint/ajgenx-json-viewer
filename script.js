console.log('AjGenX Enhanced Loaded');

const input = document.getElementById('jsonInput');
const output = document.getElementById('jsonOutput');
const formatBtn = document.getElementById('formatBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn'); // ✅ already exists in HTML
const tabs = document.querySelectorAll('.tab');
const themeToggle = document.getElementById('themeToggle');
const languageToggle = document.getElementById('languageToggle');
const errorOutput = document.getElementById('errorOutput');

const translations = {
  en: {
    title: "AjGenX - JSON Viewer & Formatter",
    'btn.format': "Format JSON",
    'btn.download': "Download JSON",
    'tab.general': "General",
    'tab.ecommerce': "E-Commerce",
    'tab.healthcare': "Healthcare",
    'tab.edtech': "EdTech",
    'tab.iot': "IoT",
    'tab.custom': "Custom",
    'footer.text': "Made by Ajay Singh Rajput & ChatGPT — AjGenX",
    'input.placeholder': "Paste your JSON here..."
  },
  hi: {
    title: "AjGenX - JSON दर्शक और स्वरूपक",
    'btn.format': "JSON स्वरूपित करें",
    'btn.download': "JSON डाउनलोड करें",
    'tab.general': "सामान्य",
    'tab.ecommerce': "ई-कॉमर्स",
    'tab.healthcare': "स्वास्थ्य सेवा",
    'tab.edtech': "एडटेक",
    'tab.iot': "आईओटी",
    'tab.custom': "कस्टम",
    'footer.text': "अजय सिंह राजपूत और ChatGPT द्वारा निर्मित — AjGenX",
    'input.placeholder': "यहां अपना JSON पेस्ट करें..."
  }
};

function setLanguage(lang) {
  const langMap = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (langMap[key]) el.textContent = langMap[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (langMap[key]) el.placeholder = langMap[key];
  });
  document.title = langMap.title;
  localStorage.setItem('ajgenx-lang', lang);
}

window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('ajgenx-lang') || 'en';
  setLanguage(savedLang);
  languageToggle.value = savedLang;

  const savedTheme = localStorage.getItem('ajgenx-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark && !savedTheme) {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
});

languageToggle.addEventListener('change', () => {
  setLanguage(languageToggle.value);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('ajgenx-theme', isDark ? 'dark' : 'light');
});

const templates = {
  general: `{ "name": "Ajay", "project": "AjGenX" }`,
  ecommerce: `{ "product": "Shirt", "price": 499, "stock": true }`,
  healthcare: `{ "patient": "John Doe", "diagnosis": "Flu", "prescription": ["MedA", "MedB"] }`,
  edtech: `{ "course": "Physics", "duration": "3 months", "enrolled": 120 }`,
  iot: `{ "device": "Sensor01", "status": "active", "battery": 87 }`,
  custom: localStorage.getItem('ajgenx-custom') || ''
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const key = tab.dataset.tab;
    input.value = templates[key] || '';
  });
});

formatBtn.addEventListener('click', () => {
  errorOutput.style.display = 'none';
  output.innerHTML = '';

  if (typeof JSONViewer === 'undefined') {
    errorOutput.style.display = 'block';
    errorOutput.textContent = '⚠️ JSONViewer लाइब्रेरी लोड नहीं हुई!';
    return;
  }

  try {
    const parsed = JSON.parse(input.value);
    const viewer = new JSONViewer();
    output.appendChild(viewer.getContainer());
    viewer.showJSON(parsed, -1, 2);

    if (document.querySelector('.tab.active').dataset.tab === 'custom') {
      localStorage.setItem('ajgenx-custom', input.value);
    }
  } catch (err) {
    errorOutput.style.display = 'block';
    errorOutput.textContent = '⚠️ Invalid JSON: ' + err.message;
  }
});

downloadBtn.addEventListener('click', () => {
  const blob = new Blob([input.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ajgenx.json';
  a.click();
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(output.textContent)
    .then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy JSON', 1500);
    })
    .catch(() => {
      copyBtn.textContent = 'Failed!';
    });
});

document.getElementById("uploadJsonBtn").addEventListener("click", () => {
  const file = document.getElementById("jsonFileInput").files[0];
  if (!file) {
    alert("Please select a JSON file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const json = JSON.parse(e.target.result);
      input.value = JSON.stringify(json, null, 2);
      output.textContent = JSON.stringify(json);
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
});

document.getElementById("fetchBtn").addEventListener("click", async () => {
  const url = document.getElementById("apiUrl").value.trim();
  if (!url) {
    alert("Please enter a valid URL");
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const data = await response.json();
    input.value = JSON.stringify(data, null, 2);
    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    output.textContent = '⚠️ Error fetching JSON: ' + error.message;
  }
});
