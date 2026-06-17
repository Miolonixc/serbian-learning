# 🇷🇸 Учим српски

Прогрессивное веб-приложение для изучения сербского языка. 100 слов, 10 уроков грамматики, 20 упражнений — всё работает оффлайн.

## Возможности

- **8 слов в день** — карточки с переводом и озвучкой (Web Speech API)
- **Алгоритм SM-2** — умное повторение: слова возвращаются в нужный момент
- **Грамматика** — 10 уроков (падежы, спряжения, числа, времена, фразы)
- **Упражнения** — выбор перевода, заполнение пропусков; неправильные вопросы повторяются
- **Прогресс** — стрики, статистика, точность
- **Оффлайн** — все данные в IndexedDB, работает без интернета

## Быстрый старт

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Откройте на телефоне: `http://<IP>:5173`

## Стек

- React + TypeScript + Vite
- Tailwind CSS
- Dexie.js (IndexedDB)
- Web Speech API (озвучка)

## Структура

```
src/
├── components/    # UI-компоненты
├── pages/         # Страницы (Главная, Словарь, Грамматика, Упражнения, Прогресс)
├── data/          # JSON-данные (слова, грамматика, упражнения)
├── db/            # IndexedDB схема
├── hooks/         # Логика слов дня и прогресса
└── utils/         # SM-2, аудио, seed базы
```

## Деплой

### GitHub Pages
```bash
git remote add origin https://github.com/user/serbian-learning.git
git push -u origin main
```
Settings → Pages → Deploy from branch → `main` / `dist`

### Docker
```bash
docker build -t serbian-learning .
docker run -d -p 80:80 serbian-learning
```

### Локально (продакшн)
```bash
npm run build
npx serve -s dist -l 5173
```

## Лицензия

MIT
