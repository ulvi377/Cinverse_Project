# Netflix — Mobil + Veb

Layihə üç hissədən ibarətdir:

- `CineVerse.API` — ASP.NET Core Web API və SQLite məlumat bazası
- `CineVerse` — Expo + React Native mobil tətbiqi
- `CineVerse.Web` — React + Vite veb saytı

Mobil tətbiq və veb sayt eyni API-yə qoşulur. Hesab, filmlər, rəylər və Watchlist backend-də saxlanılır.

## 1. Backend-i başlat

Visual Studio və ya PowerShell-də `CineVerse/CineVerse.API` qovluğuna keç:

```powershell
cd .\CineVerse.API
dotnet restore
dotnet run --urls http://0.0.0.0:5030
```

API ünvanı: `http://localhost:5030`

SQLite bazası `CineVerse.API/cineverse.db` faylındadır. İlk başladıqda cədvəllər və ilkin film məlumatları yaradılır.

## 2. Mobil tətbiqi başlat

Yeni terminal aç:

```powershell
cd .\CineVerse
npm install
npx expo start -c
```

- Android Emulator üçün API ünvanı `src/services/api.ts` daxilində `http://10.0.2.2:5030/api` olaraq təyin edilib.
- Fiziki telefonda yoxlamaq üçün həmin ünvanı kompüterinin lokal IPv4 ünvanı ilə dəyiş. Telefon və kompüter eyni Wi-Fi şəbəkəsində olmalıdır.

Expo SDK 58 paketləri `package.json` daxilində uyğun versiyalara gətirilib. Köhnə `node_modules` və lock faylı qəsdən ZIP-ə daxil edilməyib; `npm install` təmiz quraşdırma aparacaq.

## 3. Veb saytı başlat

Yeni terminal aç:

```powershell
cd .\CineVerse.Web
npm install
npm run dev
```

Vite terminalda göstərdiyi lokal ünvanı brauzerdə aç (adətən `http://localhost:5173`). Veb sayt API-yə `http://localhost:5030/api` ünvanından qoşulur.

## Tema

Mobil tətbiqdə Settings bölməsindəki Dark appearance seçimi bütün ekranlara tətbiq olunur və AsyncStorage-də saxlanılır. Veb versiyada yuxarı sağdakı günəş/ay düyməsi mövzunu dəyişir və brauzer yaddaşında saxlayır.

Bildirişlər seçimi və düyməsi çıxarılıb.

## Qeyd

Bu layihə inkişaf versiyasıdır. Backend-in JWT açarı lokal test üçündür. İctimai serverə yerləşdirməzdən əvvəl onu təhlükəsiz secret ilə əvəz etmək lazımdır. Mobil və veb tətbiqləri bu kompüterdə/emulatorda yoxlanmalıdır; burada istifadəçinin cihazında işlədilmə testi aparılmayıb.

## Yeni funksiyalar

- Tətbiq açılarkən qara fonda qırmızı Netflix üslublu `N` loqosu animasiya ilə görünür; tətbiqin adı və ikonası Netflix olaraq qurulub.
- Home ekranının yuxarısındakı `+` düyməsi ilə hesaba daxil olmuş istifadəçi film əlavə edə bilər.
- Film əlavə edərkən `Poster şəklinin linki` və `Trailer linki` ayrı-ayrı daxil edilir. Poster linki film kartında, trailer linki isə film detallarındakı `Watch trailer` düyməsində istifadə olunur.
- Film əlavə etmə sorğusu JWT ilə qorunan `POST /api/movies` endpoint-inə göndərilir. Giriş etməmiş istifadəçi əvvəlcə Login ekranına yönləndirilir.
- Film əlavə edildikdən sonra Home ekranı yenilənir.

Poster üçün birbaşa şəkil ünvanı (məsələn, `.jpg` və ya `.png`), trailer üçün isə YouTube video linki istifadə et.


## Əlavə məcburi checklist funksiyaları

- Stack + Tabs + ayrıca Drawer naviqasiyası, nested səhifə keçidləri və 404 Not Found ekranı.
- İlk açılışda 3 addımlı onboarding; sonrakı açılışlarda göstərilmir.
- Login tokeni Expo SecureStore-da, profil/tema/onboarding kimi həssas olmayan məlumatlar AsyncStorage-da saxlanılır.
- Profil və film əlavə etmə ekranlarında Image Picker; icazə verilmədikdə izahlı Alert göstərilir.
- Film API-si GET, POST, PUT və DELETE əməliyyatlarını dəstəkləyir; POST/PUT/DELETE autentifikasiya tələb edir.
- Add Movie formunda KeyboardAvoidingView, ScrollView, validasiya və poster seçimi var.
- Dark/Light Mode, Switch, splash animasiyası və onboarding keçid animasiyası mövcuddur.
- 404 səhifəsi, geri qayıtma və qorunan film əlavə etmə səhifəsi mövcuddur.

Drawer və SecureStore üçün əlavə Expo/React Navigation paketləri `package.json`-a əlavə edilib. Layihəni yeni qovluğa çıxardıqdan sonra `npm install` icra edin.

## Final tapşırığın qiymətləndirmə meyarları

Layihə aşağıdakı 100 ballıq rubrikaya uyğun təqdim olunur:

| Meyar | Bal |
|---|---:|
| Professional UI/UX və responsive dizayn | 20 |
| Expo Router: Drawer, Tabs, Stack | 15 |
| Backend API inteqrasiyası və error handling | 20 |
| AsyncStorage / SQLite | 10 |
| CRUD və layihənin biznes funksionallığı | 15 |
| React Native komponentləri və cihaz API-ləri | 10 |
| Kod keyfiyyəti, Git və layihənin müdafiəsi | 10 |
| **Cəmi** | **100** |

## Minimum layihə tələbləri

- Minimum 10 işlək ekran; bu layihədə Home, Search, Watchlist, Profile, Movie Details, Add Movie, Edit Movie, Login, Register, Reviews, Watched, Settings, Drawer, Onboarding və Not Found marşrutları mövcuddur.
- Real ASP.NET Core REST API + SQLite backend; mobil tətbiq API-dən film kataloqu, watchlist və review məlumatlarını alır.
- Film CRUD: GET (siyahı və detal), POST (əlavə), PUT (redaktə), DELETE (silmə). Əlavə/redaktə/silmə üçün giriş tələb olunur.
- Axtarış, janr filtri, pagination, watchlist, baxılmış filmlər və review axını.
- AsyncStorage: tema, onboarding statusu, profil şəkli və film cache. SecureStore: JWT autentifikasiya tokeni.
- Expo Router Stack + Tabs + Drawer, nested marşrutlar, dinamik `/movie/[id]`, geri qayıtma, splash/onboarding və Not Found.
- Safe area, KeyboardAvoidingView, ScrollView, FlatList, SectionList, Image/ImageBackground, Modal, Pressable, Switch və ActivityIndicator.
- Image Picker icazəsi istənir; istifadəçi icazə vermədikdə tətbiq xəbərdarlıq göstərir. Keyboard, StatusBar və Alert istifadə olunur.
- Dark/Light Mode, form yoxlaması, splash/onboarding animasiyası və onboarding keçid animasiyası.
- Loading, empty, error və retry vəziyyətləri əsas axınlarda nəzərə alınır.

## Müdafiə zamanı canlı nümayiş ssenarisi

1. API-ni başladın və tətbiqdən film kataloqunun serverdən yükləndiyini göstərin.
2. Qeydiyyatdan keçin və ya mövcud hesabla daxil olun.
3. Yeni film əlavə edin (poster və trailer URL-ləri ayrı daxil edilir).
4. Həmin filmin məlumatlarını redaktə edin, sonra silin.
5. Filmi Watchlist-ə əlavə edin və baxılmış statusunu göstərin.
6. Tətbiqi bağlayıb yenidən başladın; tema/cache və sessiyanın saxlanmasını yoxlayın.
7. API-ni müvəqqəti dayandırıb Home ekranında error və retry vəziyyətini nümayiş etdirin.
8. Drawer, Tabs, Stack, dinamik film detalı, onboarding və Not Found marşrutlarını göstərin.

**Qeyd:** API və mobil tətbiq ayrı proseslərdir. Android emulator üçün `10.0.2.2` host ünvanı istifadə olunur; fiziki telefonda `src/services/api.ts` daxilində `API_URL` kompüterin lokal IPv4 ünvanına dəyişdirilməli və hər iki cihaz eyni Wi-Fi şəbəkəsində olmalıdır. Real təqdimatdan əvvəl bütün ssenariləri öz kompüterinizdə və cihazınızda yoxlayın.


## Son yeniliklər və yoxlama

- Search ekranına IMDb minimum reytinq filtri (Any, 5+, 6+, 7+, 8+, 9+) əlavə edilib. Filtr backend-in `minRating` parametrindən istifadə edir.
- Search nəticələri AsyncStorage-da filtr kombinasiyasına görə keşlənir; internet olmadıqda saxlanmış nəticələr göstərilir.
- Home film keşində yüklənmiş səhifələr birlikdə saxlanılır.
- Login tələb edən tab, drawer və digər qorunan marşrutlar üçün giriş yoxlaması əlavə edilib.
- Settings ekranına Expo Notifications icazəsi, icazə rədd ediləndə izah və test bildirişi əlavə edilib.
- Profil məlumatı AsyncStorage-da, JWT token isə yalnız SecureStore-da saxlanılır.

### Bildirişləri aktivləşdirmək
Settings → Enable notifications seçin və cihaz icazəsini təsdiqləyin. İcazə rədd edilərsə, telefonun tətbiq parametrlərindən Netflix bildirişlərinə icazə verin. Bildirişlərin tam test edilməsi üçün fiziki cihaz və ya uyğun development build istifadə edin.

### Mobil tətbiqi başlatmaq
```bash
cd CineVerse
npm install
npx expo install expo-notifications
npx expo start -c
```

### Qeyd
API ünvanı `src/services/api.ts` faylındadır. Android emulator üçün `10.0.2.2` uyğundur. Fiziki telefonda həmin sətri kompüterin lokal IPv4 ünvanı ilə dəyişin; telefon və kompüter eyni Wi-Fi şəbəkəsində olmalıdır.
