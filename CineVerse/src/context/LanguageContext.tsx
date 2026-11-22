
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppLanguage = "az" | "en" | "tr";
const LANGUAGE_KEY = "cineverse_language";

const translations: Record<AppLanguage, Record<string, string>> = {
  en: {
    "Daily movie reminder": "Daily movie reminder",
    "Get a daily reminder to discover a movie.": "Get a daily reminder to discover a movie.",
    "Reminder time": "Reminder time",
    "Choose when you want to receive reminders.": "Choose when you want to receive reminders.",
    "Daily reminder at": "Daily reminder at",
    "Receive notifications from CineVerse.": "Receive notifications from CineVerse.",
    "It's movie time! Discover a new movie today.": "It's movie time! Discover a new movie today.",
    "Permission required": "Permission required",
    "Please enable notifications from your device settings.": "Please enable notifications from your device settings.",
    "Notification Error": "Notification Error",
    "Notifications disabled": "Notifications disabled",
    "Notifications enabled": "Notifications enabled",
    "Notification permission error": "Notification permission error",
    "Enable notifications to use daily reminders.": "Enable notifications to use daily reminders.",
  },

  az: {
    "Home": "Ana səhifə", "Search": "Axtarış", "Watchlist": "İzləmə siyahısı", "Profile": "Profil", "Settings": "Tənzimləmələr",
    "Login": "Daxil ol", "Register": "Qeydiyyat", "Email": "E-poçt", "Password": "Şifrə", "Confirm password": "Şifrəni təsdiqlə",
    "Trending now": "Hazırda trenddə", "Top rated": "Ən yüksək reytinq", "Fresh arrivals": "Yeni filmlər", "Explore movies": "Filmləri kəşf et",
    "YOUR PERSONAL MOVIE UNIVERSE": "SƏNİN ŞƏXSİ KİNO Kainatın", "TONIGHT'S ESCAPE STARTS HERE": "BU GECƏKİ MACƏRAN BURADAN BAŞLAYIR",
    "Stories worth": "Dəyərli hekayələr", "staying in for.": "evdə qalmağa dəyər.", "Find your next obsession in a universe of cinema.": "Kino kainatında növbəti sevimli filmini tap.",
    "The films everyone's talking about": "Hamının danışdığı filmlər", "Critically loved, endlessly watchable": "Tənqidçilərin sevdiyi, dəfələrlə izlənəsi", "A little something new": "Bir az yenilik",
    "SEE ALL": "HAMISINA BAX", "Load more movies": "Daha çox film yüklə", "Enable notifications": "Bildirişləri aktiv et", "Dark appearance": "Qaranlıq görünüş",
    "Appearance": "Görünüş", "NOTIFICATIONS": "BİLDİRİŞLƏR", "Language": "Dil", "Save": "Yadda saxla", "Cancel": "Ləğv et", "Back": "Geri",
    "Edit profile": "Profili redaktə et", "Logout": "Çıxış", "Watched": "İzlənilənlər", "Reviews": "Rəylər", "Add movie": "Film əlavə et",
    "No movies found": "Film tapılmadı", "No movies in your watchlist yet.": "İzləmə siyahında hələ film yoxdur.", "Search movies": "Film axtar",
    "Your experience,": "Sənin təcrübən,", "your atmosphere.": "sənin atmosferin.", "Customize the look and feel of your Netflix space.": "Netflix görünüşünü öz zövqünə uyğunlaşdır.",
    "A cinematic dark experience is active.": "Kinematoqrafik qaranlıq görünüş aktivdir.", "A clean, bright experience is active.": "Sadə və işıqlı görünüş aktivdir.",
    "A universe of stories, made yours.": "Hekayələr kainatı artıq sənindir.",
    "NETFLIX": "NETFLIX", "SEE WHAT'S NEXT": "NÖVBƏTİ HEKAYƏNİ KƏŞF ET", "NETFLIX EXPERIENCE": "NETFLIX TƏCRÜBƏSİ",
    "Edit movie": "Filmi redaktə et", "Add a movie": "Film əlavə et", "NETFLIX COMMUNITY": "NETFLIX İCMASI", "YOUR NAME": "ADINIZ", "EMAIL ADDRESS": "E-POÇT ÜNVANI", "PASSWORD": "ŞİFRƏ", "Sign in": "Daxil ol", "Welcome": "Xoş gəlmisən", "back.": "yenidən.", "New to Netflix?": "Netflix-də yenisən?", "Create an account": "Hesab yarat",
    "This scene is missing": "Bu səhifə tapılmadı", "Go to Home": "Ana səhifəyə keç", "YOUR CINEMA JOURNEY": "SƏNİN KİNO SƏYAHƏTİN", "Every story leaves a little something behind.": "Hər hekayə öz izini qoyur.", "WATCHED": "İZLƏNİLİB", "TOP GENRE": "ƏN ÇOX İZLƏNƏN JANR", "AVG. RATING": "ORTA REYTİNQ", "Your watched movies will appear here.": "İzlədiyin filmlər burada görünəcək.",
    "Skip introduction": "Girişi keç", "MAKE IT YOURS": "ÖZÜNƏ UYĞUNLAŞDIR", "APPEARANCE": "GÖRÜNÜŞ", "LIVE PREVIEW": "CANLI ÖNİZLƏMƏ", "Your next movie night": "Növbəti film gecən", "NETFLIX ORIGINAL": "NETFLIX ORIGINAL",
    "COMMUNITY VOICES": "İCMA RƏYLƏRİ", "Movie": "Film", "reviews": "rəyləri", "YOUR RATING": "SƏNİN QİYMƏTLƏNDİRMƏN", "Cancel editing": "Redaktəni ləğv et", "WHAT PEOPLE ARE SAYING": "İSTİFADƏÇİLƏR NƏ DEYİR", "Edit": "Redaktə et", "Delete": "Sil", "No reviews yet. Be the first to share your thoughts.": "Hələ rəy yoxdur. İlk fikrini sən paylaş.",
    "NETFLIX FEATURE": "NETFLIX XÜSUSİYYƏTİ", "THE STORY": "MƏZMUN", "CAST & CREW": "AKTYORLAR VƏ HEYƏT", "Add to Watchlist": "İzləmə siyahısına əlavə et", "Read & write reviews": "Rəyləri oxu və yaz", "Watch trailer": "Treylerə bax",
    "EXPLORE YOUR UNIVERSE": "KİNO KAINATINI KƏŞF ET", "Netflix Menu": "Netflix menyusu", "YOUR NETFLIX": "SƏNİN NETFLIX-İN", "CINEMA ENTHUSIAST": "KİNO HƏVƏSKARI", "YOUR SPACE": "SƏNİN SAHƏN", "Watched movies": "İzlənilən filmlər", "Your viewing history and stats": "İzləmə tarixçən və statistikan", "Personalize your experience": "Təcrübəni fərdiləşdir", "Log out": "Hesabdan çıx", "NETFLIX · MADE FOR MOVIE LOVERS": "NETFLIX · KİNO SEVƏNLƏR ÜÇÜN",
    "YOUR PERSONAL COLLECTION": "SƏNİN ŞƏXSİ KOLLEKSİYAN", "My": "Mənim", "All the stories waiting for you.": "Səni gözləyən bütün hekayələr.", "Your list is waiting": "Siyahın səni gözləyir", "Save movies you want to watch and they will appear here.": "İzləmək istədiyin filmləri saxla, onlar burada görünəcək.", "THE COLLECTION": "KOLLEKSİYA", "EXPLORE BY GENRE": "JANRA GÖRƏ AXTAR", "MINIMUM IMDb RATING": "MİNİMUM IMDb REYTİNQİ",

    "Daily movie reminder": "Gündəlik film xatırlatması",
    "Get a daily reminder to discover a movie.": "Hər gün yeni film kəşf etmək üçün xatırlatma al.",
    "Reminder time": "Xatırlatma vaxtı",
    "Choose when you want to receive reminders.": "Xatırlatmanın gələcəyi vaxtı seç.",
    "Daily reminder at": "Gündəlik xatırlatma saatı:",
    "Receive notifications from CineVerse.": "CineVerse-dən bildirişlər al.",
    "It's movie time! Discover a new movie today.": "Film vaxtıdır! Bu gün yeni film kəşf et.",
    "Permission required": "İcazə tələb olunur",
    "Please enable notifications from your device settings.": "Zəhmət olmasa, cihazın tənzimləmələrindən bildirişləri aktiv et.",
    "Notification Error": "Bildiriş xətası",
    "Notifications disabled": "Bildirişlər deaktivdir",
    "Notifications enabled": "Bildirişlər aktivdir",
    "Notification permission error": "Bildiriş icazəsi xətası",
    "Enable notifications to use daily reminders.": "Gündəlik xatırlatmalardan istifadə etmək üçün bildirişləri aktiv et."
  },

  tr: {
    "Home": "Ana sayfa", "Search": "Ara", "Watchlist": "İzleme listesi", "Profile": "Profil", "Settings": "Ayarlar",
    "Login": "Giriş yap", "Register": "Kayıt ol", "Email": "E-posta", "Password": "Şifre", "Confirm password": "Şifreyi doğrula",
    "Trending now": "Şu anda trend", "Top rated": "En yüksek puanlı", "Fresh arrivals": "Yeni eklenenler", "Explore movies": "Filmleri keşfet",
    "YOUR PERSONAL MOVIE UNIVERSE": "KİŞİSEL FİLM EVRENİN", "TONIGHT'S ESCAPE STARTS HERE": "BU GECEKİ MACERA BURADA BAŞLIYOR",
    "Stories worth": "İzlemeye değer", "staying in for.": "hikâyeler.", "Find your next obsession in a universe of cinema.": "Sinema evreninde yeni favori filmini bul.",
    "The films everyone's talking about": "Herkesin konuştuğu filmler", "Critically loved, endlessly watchable": "Eleştirmenlerin sevdiği, tekrar tekrar izlenecek", "A little something new": "Biraz yenilik",
    "SEE ALL": "TÜMÜNÜ GÖR", "Load more movies": "Daha fazla film yükle", "Enable notifications": "Bildirimleri etkinleştir", "Dark appearance": "Koyu görünüm",
    "Appearance": "Görünüm", "NOTIFICATIONS": "BİLDİRİMLER", "Language": "Dil", "Save": "Kaydet", "Cancel": "İptal", "Back": "Geri",
    "Edit profile": "Profili düzenle", "Logout": "Çıkış yap", "Watched": "İzlenenler", "Reviews": "Yorumlar", "Add movie": "Film ekle",
    "No movies found": "Film bulunamadı", "No movies in your watchlist yet.": "İzleme listende henüz film yok.", "Search movies": "Film ara",
    "Your experience,": "Senin deneyimin,", "your atmosphere.": "senin atmosferin.", "Customize the look and feel of your Netflix space.": "Netflix görünümünü kendi zevkine göre özelleştir.",
    "A cinematic dark experience is active.": "Sinematik koyu görünüm etkin.", "A clean, bright experience is active.": "Sade ve aydınlık görünüm etkin.",
    "A universe of stories, made yours.": "Hikâyeler evreni artık senin.",
    "NETFLIX": "NETFLIX", "SEE WHAT'S NEXT": "SIRADAKİ HİKÂYENİ KEŞFET", "NETFLIX EXPERIENCE": "NETFLIX DENEYİMİ",
    "Edit movie": "Filmi düzenle", "Add a movie": "Film ekle", "NETFLIX COMMUNITY": "NETFLIX TOPLULUĞU", "YOUR NAME": "ADINIZ", "EMAIL ADDRESS": "E-POSTA ADRESİ", "PASSWORD": "ŞİFRE", "Sign in": "Giriş yap", "Welcome": "Hoş geldin", "back.": "yeniden.", "New to Netflix?": "Netflix'e yeni misin?", "Create an account": "Hesap oluştur",
    "This scene is missing": "Bu sayfa bulunamadı", "Go to Home": "Ana sayfaya dön", "YOUR CINEMA JOURNEY": "SİNEMA YOLCULUĞUN", "Every story leaves a little something behind.": "Her hikâye geride bir iz bırakır.", "WATCHED": "İZLENDİ", "TOP GENRE": "EN ÇOK İZLENEN TÜR", "AVG. RATING": "ORTALAMA PUAN", "Your watched movies will appear here.": "İzlediğin filmler burada görünecek.",
    "Skip introduction": "Tanıtımı geç", "MAKE IT YOURS": "KENDİNE GÖRE AYARLA", "APPEARANCE": "GÖRÜNÜM", "LIVE PREVIEW": "CANLI ÖNİZLEME", "Your next movie night": "Bir sonraki film gecen", "NETFLIX ORIGINAL": "NETFLIX ORIGINAL",
    "COMMUNITY VOICES": "TOPLULUK YORUMLARI", "Movie": "Film", "reviews": "yorumları", "YOUR RATING": "PUANIN", "Cancel editing": "Düzenlemeyi iptal et", "WHAT PEOPLE ARE SAYING": "KULLANICILAR NE DİYOR", "Edit": "Düzenle", "Delete": "Sil", "No reviews yet. Be the first to share your thoughts.": "Henüz yorum yok. İlk düşünceni sen paylaş.",
    "NETFLIX FEATURE": "NETFLIX ÖZELLİĞİ", "THE STORY": "HİKÂYE", "CAST & CREW": "OYUNCULAR VE EKİP", "Add to Watchlist": "İzleme listesine ekle", "Read & write reviews": "Yorumları oku ve yaz", "Watch trailer": "Fragmanı izle",
    "EXPLORE YOUR UNIVERSE": "SİNEMA EVRENİNİ KEŞFET", "Netflix Menu": "Netflix menüsü", "YOUR NETFLIX": "SENİN NETFLIX'İN", "CINEMA ENTHUSIAST": "SİNEMA TUTKUNU", "YOUR SPACE": "SENİN ALANIN", "Watched movies": "İzlenen filmler", "Your viewing history and stats": "İzleme geçmişin ve istatistiklerin", "Personalize your experience": "Deneyimini kişiselleştir", "Log out": "Çıkış yap", "NETFLIX · MADE FOR MOVIE LOVERS": "NETFLIX · SİNEMA TUTKUNLARI İÇİN",
    "YOUR PERSONAL COLLECTION": "KİŞİSEL KOLEKSİYONUN", "My": "Benim", "All the stories waiting for you.": "Seni bekleyen tüm hikâyeler.", "Your list is waiting": "Listen seni bekliyor", "Save movies you want to watch and they will appear here.": "İzlemek istediğin filmleri kaydet, burada görünsünler.", "THE COLLECTION": "KOLEKSİYON", "EXPLORE BY GENRE": "TÜRE GÖRE KEŞFET", "MINIMUM IMDb RATING": "MİNİMUM IMDb PUANI",

    "Daily movie reminder": "Günlük film hatırlatıcısı",
    "Get a daily reminder to discover a movie.": "Her gün yeni bir film keşfetmek için hatırlatma al.",
    "Reminder time": "Hatırlatma saati",
    "Choose when you want to receive reminders.": "Hatırlatmanın geleceği saati seç.",
    "Daily reminder at": "Günlük hatırlatma saati:",
    "Receive notifications from CineVerse.": "CineVerse bildirimlerini al.",
    "It's movie time! Discover a new movie today.": "Film zamanı! Bugün yeni bir film keşfet.",
    "Permission required": "İzin gerekli",
    "Please enable notifications from your device settings.": "Lütfen cihaz ayarlarından bildirimleri etkinleştir.",
    "Notification Error": "Bildirim hatası",
    "Notifications disabled": "Bildirimler devre dışı",
    "Notifications enabled": "Bildirimler etkin",
    "Notification permission error": "Bildirim izni hatası",
    "Enable notifications to use daily reminders.": "Günlük hatırlatmaları kullanmak için bildirimleri etkinleştir."
  }
};

type LanguageContextType = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (value: string) => string;
  ready: boolean;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setCurrentLanguage] = useState<AppLanguage>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then(value => {
        if (value === "az" || value === "en" || value === "tr") {
          setCurrentLanguage(value);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const setLanguage = async (next: AppLanguage) => {
    setCurrentLanguage(next);
    await AsyncStorage.setItem(LANGUAGE_KEY, next);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (text: string) => translations[language][text] || text,
      ready,
    }),
    [language, ready]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
