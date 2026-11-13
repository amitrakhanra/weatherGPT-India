# 🌦️ WeatherGPT India

**Block-aware weather forecasts and monsoon intelligence for Indian farmers, in their own language.**

🔗 **Live demo:** https://weathergpt2o.vercel.app/

WeatherGPT India turns raw forecast data into something a farmer can act on: live weather for any block, village or PIN code, a monsoon onset/break estimate, plain-language farm advice, and a voice-enabled assistant, all in a single static web page with no build step.

> Built by **Team NEXO** for **Smart India Hackathon 2026** (Problem Statement 26086).

---

## ✨ Features

| Area | What it does |
|---|---|
| **Hyperlocal weather** | Live current conditions, 9-hour strip, 7-day forecast, sunrise/sunset, pressure, UV, soil moisture and air quality for any selected point |
| **Location picker** | State → District → Block → Village, covering all 36 states/UTs and every district (built in, works offline). All 23 West Bengal districts have a complete, cross-checked block list |
| **PIN code search** | Resolves any 6-digit Indian PIN code to a post office / block / district and loads its weather |
| **Instant map** | A compact map right under the search boxes shows the selected spot immediately; the larger risk map below supports tap-to-mark |
| **Smart geocoding** | Looks up village → block → district → state until one resolves, so small rural names never leave stale data on screen |
| **Monsoon intelligence** | Onset and break windows with confidence, lead time, explainable signal weights, a hyperlocal phase map and a historical backtest |
| **Farmer decision engine** | Sowing window, irrigation and break advisory, dry-spell / waterlogging / flash-flood flags |
| **Disease risk index** | Heuristic dengue/malaria, heat-stress and waterborne illness read |
| **Megh, the assistant** | Voice and text chat that answers from the live numbers on screen. Replies in the language you type in |
| **Indian languages** | UI language switcher with native digit scripts (Devanagari, Bengali, Tamil, etc.) for every number |

## 🗣️ Languages

The picker lists 22 Indian languages. Core UI and numerals are localized; the monsoon, decision, backtest and disease sections are tagged for translation, and any string without a translation falls back to English. Languages marked **beta** support voice only for now.

Contributions of native-speaker translations are very welcome (see [Contributing](#-contributing)).

## 🧱 Tech stack

- **Plain HTML + CSS + JavaScript** in a single `index.html`. No framework, no bundler
- [Leaflet](https://leafletjs.com/) with OpenStreetMap tiles for maps
- Web Speech API (`SpeechSynthesis` and `SpeechRecognition`) for voice
- Hosted on **Vercel** as a static site

## 🌐 Data sources

| Data | Source | Key needed |
|---|---|---|
| Weather, forecast, soil moisture | [Open-Meteo](https://open-meteo.com/) | No |
| Air quality | Open-Meteo Air Quality API | No |
| Geocoding | Open-Meteo Geocoding API | No |
| PIN code lookup | [India Post public API](https://api.postalpincode.in) | No |
| Block lists (West Bengal) | Built-in, compiled from district sites, Wikipedia and igod.gov.in | n/a |
| Block lists (other states) | Live scrape of the Bharat Directory (with CORS-proxy fallbacks) | No |
| Map tiles | © OpenStreetMap contributors | No |

**No API keys are used or stored anywhere in the code.**

> ⚠️ **Honesty note:** live weather, air quality and geocoding values are never faked. If a fetch fails, the UI says so. The monsoon onset/break numbers, signal weights, phase map and backtest are **modelled demo content** for the prototype, not output from IMD/NCMRWF models.

## 🚀 Run locally

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# Option 1: just open the file
open index.html            # macOS (use xdg-open on Linux, start on Windows)

# Option 2: serve it locally
python3 -m http.server 8000
# then visit http://localhost:8000
```

There is nothing to install or build.

## ☁️ Deploy

Any static host works. On Vercel:

1. Import the repository
2. Framework preset: **Other** (no build command, no output directory)
3. Deploy

## 🗂️ Project structure

```
.
├── index.html     # markup, styles and all application logic
├── AGENTS.md      # architecture notes and conventions for contributors
└── README.md
```

Inside `index.html` the script is organized as: `DISTRICTS` / `SEED_BLOCKS` (location data) → `lookupPincode` → weather fetch and render functions → `initMap` / `initQuickMap` / `dropPin` → `I18N` / `LANGS` / `applyLang` → Megh chat and voice. See `AGENTS.md` for details.

## 🌍 Adding a language or string

1. Add the key to `I18N.en`, then to any language you are translating.
2. Tag the element with `data-i18n`, `data-i18n-html`, `data-i18n-ph` or `data-i18n-title`.
3. Run any number that will be displayed through `LN()` so it uses the right script's digits.
4. For a new language, add an entry to `LANGS` and, if it uses non-Latin digits, to `DIGIT_MAPS`.

## ⚠️ Known limitations

- Megh is a rule-based keyword matcher, not an LLM. There is no backend, and API keys must never be placed in client-side code.
- Block names outside West Bengal depend on a third-party scrape; if it is down, use the village box or PIN code.
- Kolkata has no rural blocks (it is fully urban), so use a locality name or PIN code.
- Monsoon and farm-advisory figures are illustrative until connected to an authoritative model.

## 🤝 Contributing

Issues and pull requests are welcome, especially:

- Native-speaker translations
- Verified block lists for more states (please cite sources; do not invent names)
- Real monsoon-model integration

## 🙏 Acknowledgements

[Open-Meteo](https://open-meteo.com/) · [OpenStreetMap](https://www.openstreetmap.org/copyright) · [Leaflet](https://leafletjs.com/) · India Post · Bharat Directory

## 📄 License

Add your chosen license here (for example MIT).

---

<sub>Team NEXO · SIH 2026 · PS 26086</sub>
