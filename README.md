# مصروفي (Masrofy) - Spending Intelligence

تطبيق ذكي وسريع لتتبع المصاريف والميزانية الشخصية، مبني بواسطة Vite + React + Tailwind CSS ومدعوم بـ Capacitor لبناء تطبيق Android APK أصلي.

---

## 📱 استخراج وتحميل ملف الـ APK من GitHub (Extract APK)

> **💡 للاطلاع على الدليل الشامل والمصور خطوة بخطوة، افتح ملف: [HOW_TO_EXTRACT_APK_FROM_GITHUB.md](HOW_TO_EXTRACT_APK_FROM_GITHUB.md)**

### الطريقة الأولى: استخراج الـ APK مباشرة عبر GitHub Actions (الأسهل والأسرع)
1. افتح صفحة المستودع: [https://github.com/oppreno52021-cloud/Jgcbk](https://github.com/oppreno52021-cloud/Jgcbk)
2. انتقل إلى تبويب **[Actions](https://github.com/oppreno52021-cloud/Jgcbk/actions)** في أعلى الصفحة.
3. اضغط على سير العمل **Build Android APK** من القائمة اليسرى.
4. اضغط على **Run workflow** ثم زر التشغيل الأخضر.
5. بعد دقيقة واحدة، اضغط على العملية المكتملة، وانزل لأسفل الصفحة لقسم **Artifacts**.
6. اضغط على **`Masrofy-Android-APK`** لتحميل ملف الـ APK مباشرة وتثبيته على هاتفك!
7. *كما يمكنك تحميل الـ APK بنقرة واحدة من صفحة [Releases](https://github.com/oppreno52021-cloud/Jgcbk/releases).*

---

### الطريقة الثانية: محلياً عبر السكربتات الجاهزة (Scripts)

#### على Linux أو macOS:
```bash
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh
```

#### على Windows:
```cmd
scripts\build-apk.bat
```

#### أو يدوياً عبر سطر الأوامر:
```bash
npm install --legacy-peer-deps
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```
ستجد ملف الـ APK في المسار:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

### الطريقة الثالثة: عبر Android Studio
1. نفذ:
```bash
npm run build
npx cap sync android
```
2. افتح مجلد `android` داخل **Android Studio**.
3. اختر من القائمة العلوية: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
