# CineVerse Project

CineVerse is a movie discovery and personal watchlist application built with Expo / React Native and an ASP.NET Core API.

## Language selection

The application includes a language selector that stays visible above the current screen. It can be opened on the splash, onboarding, authentication, tab, profile, settings, movie, review, and other routed screens.

Available languages:
- 🇦🇿 Azerbaijani (`az`)
- 🇬🇧 English (`en`)
- 🇹🇷 Turkish (`tr`)

### How it works

1. `src/context/LanguageContext.tsx` creates a React Context shared by the whole application.
2. `LanguageProvider` is placed near the root in `src/app/_layout.tsx`, so every routed screen can access the same language state.
3. The selected language is stored in AsyncStorage with the key `cineverse_language`. When the app starts, the provider reads that value and restores the previous choice.
4. `src/components/LanguageSwitcher.tsx` displays the language button and the three language options. Selecting an option updates the shared context and saves the choice.
5. `src/components/LocalizedText.tsx` uses the `t()` translation function for screen text. The language dictionaries are kept in `LanguageContext.tsx`.

### How to add another translation

Add the English text as a key in the `az` and `tr` dictionaries in `src/context/LanguageContext.tsx`, then provide the translated value. English is the fallback language: if a key is not translated yet, its original text is displayed. Text entered by users and movie information returned by the API are not translated automatically; they remain in the language in which that content was saved or provided.

## Run the mobile app

From the mobile project directory:

```bash
cd CineVerse
npm install
npx expo start
```

Press `a` to open the Android emulator, or scan the QR code with Expo Go when supported by the installed SDK.

## Run the API

Open `CineVerse.API/CineVerse.API.slnx` in Visual Studio, set the API project as the startup project, and run it. The mobile app's API base URL is configured in `src/services/api.ts`.

## Explaining the implementation to the teacher

"I implemented language selection with React Context so the selected language is shared by all screens instead of maintaining a separate language state on every page. The language selector is rendered in the root layout, which makes it accessible throughout navigation. When a user selects Azerbaijani, English, or Turkish, the context state changes immediately and AsyncStorage saves the selected code. On the next launch, the provider reads the saved code and restores the language. Screen text goes through a small translation component and a central dictionary, so translations can be maintained in one place. If a phrase has not been translated yet, the original English phrase is shown."

## Notes about translation coverage

The selector and shared language state are global. The central dictionary currently translates the interface phrases that have entries in `LanguageContext.tsx`; any phrase without an entry stays in its original language. User-entered values, API-provided movie titles/descriptions, and some system alert messages are not automatically translated. To translate one of those, add its exact displayed phrase to both language dictionaries. Input placeholders and alert text should be passed through `t()` when adding their translations.

The project archive intentionally excludes generated folders such as `.expo`, `.vs`, `bin`, and `obj`. The source projects and API database are included. I could not run a full Expo/TypeScript build in this environment because the uploaded archive did not include the installed `node_modules` dependencies, so please launch the app and check the screens on your emulator after extracting it.
