# Сборка Android-приложения

Ваше веб-приложение уже подготовлено для упаковки в нативное Android-приложение через **Capacitor**. Интерфейс и логика те же, что в макете Figma и в текущем веб-приложении.

## Быстрый способ получить APK (через GitHub)

1. Создайте репозиторий на GitHub и загрузите проект:
   ```bash
   cd market
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git
   git push -u origin main
   ```

2. После push автоматически запустится сборка APK (workflow «Build Android APK»). Либо запустите вручную: **Actions** → **Build Android APK** → **Run workflow**.

3. Скачайте APK:
   - Откройте репозиторий на GitHub → вкладка **Actions**
   - Выберите последний успешный запуск
   - В разделе **Artifacts** скачайте **app-debug**

4. Установите APK на телефон: скопируйте файл на устройство и откройте его (разрешите установку из неизвестных источников при необходимости).

## Требования

- **Node.js 20** или новее (LTS). Скачать: https://nodejs.org/
- **Android Studio** (для сборки и эмулятора). Скачать: https://developer.android.com/studio
- **JDK 17** (обычно ставится вместе с Android Studio)

## Шаги сборки

1. Установите зависимости (если ещё не установлены):
   ```bash
   npm install
   ```
   Если при установке падает скрипт Tailwind, попробуйте:
   ```bash
   npm install --ignore-scripts
   ```

2. Соберите веб-приложение:
   ```bash
   npm run build
   ```

3. Добавьте платформу Android (один раз):
   ```bash
   npx cap add android
   ```

4. Синхронизируйте проект (после каждого изменения веб-кода):
   ```bash
   npx cap sync android
   ```

5. Откройте проект в Android Studio и запустите на устройстве или эмуляторе:
   ```bash
   npx cap open android
   ```

Либо одной командой после первого `cap add android`:
```bash
npm run android
```
(она выполнит `build` → `cap sync android` → `cap open android`)

## Что уже настроено

- В **vite.config.ts** заданы `base: './'` и `outDir: 'dist'` для корректной работы в WebView.
- В **capacitor.config.ts** указаны:
  - `appId`: `ru.market.tovarov`
  - `appName`: «Маркет товаров»
  - `webDir`: `dist`
- В **index.html** добавлен viewport и `theme-color` для мобильных устройств.

После выполнения шагов выше у вас будет готовое Android-приложение с теми же экранами и функциями, что в макете и веб-версии.
