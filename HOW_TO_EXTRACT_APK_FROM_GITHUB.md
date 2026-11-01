# كيفية استخراج وتحميل ملف الـ APK من GitHub
# How to Extract & Download the Android APK from GitHub

هذا الدليل يوضح لك خطوة بخطوة كيفية استخراج ملف التطبيق **APK** الجاهز للتثبيت على هواتف الأندرويد من مستودع **GitHub**.

---

## 🚀 الطريقة السريعة: استخراج الـ APK مباشرة من GitHub Actions

لا تحتاج إلى تثبيت أي برامج أو أدوات برمجية على حاسوبك! خوادم GitHub السحابية ستقوم ببناء ملف الـ APK بدلاً منك.

### الخطوات:
1. **افتح مستودع المشروع على GitHub**:
   - رابط المستودع: `https://github.com/oppreno52021-cloud/Jgcbk`
   *(أو المستودع الخاص بك إذا قمت بعمل Fork أو رفع المشروع لحسابك)*.

2. **ادخل إلى تبويب "Actions"**:
   - في الشريط العلوي للمستودع، اضغط على **Actions** (أيقونة المثلث/التشغيل ▶️).
   - أو مباشرة عبر الرابط: `https://github.com/oppreno52021-cloud/Jgcbk/actions`

3. **اختر سير العمل (Workflow)**:
   - من القائمة الجانبية اليسرى، اضغط على: **Build Android APK**.

4. **تشغيل البناء (Run Workflow)**:
   - اضغط على زر **Run workflow** الأزرق الموجود في الجانب الأيمن.
   - اختر الفرع `main`.
   - حدد نوع البناء (Build Type): `debug` (أو `release`).
   - اضغط على الزر الأخضر **Run workflow**.

5. **تحميل ملف الـ APK (Extract / Download APK)**:
   - انتظر حوالي 1 إلى 2 دقيقة حتى تظهر علامة الصح الخضراء ✅.
   - اضغط على اسم عملية التشغيل (Run) التي اكتملت.
   - انزل لأسفل الصفحة إلى قسم **Artifacts** (المرفقات).
   - ستجد ملفاً باسم **`Masrofy-Android-APK`**.
   - اضغط عليه للتحميل المباشر!
   - قم بفك الضغط عن الملف وستجد داخله ملف التطبيق:
     - `masrofy-app-debug.apk` (أو `app-debug.apk`).

6. **أو من قسم الـ Releases**:
   - إذا تم تفعيل خيار "Publish release"، يمكنك الدخول إلى تبويب **Releases** في الصفحة الرئيسية للمستودع وتحميل الـ APK بنقرة واحدة بدون الحاجة لتسجيل الدخول في GitHub!

---

## 📲 كيفية تثبيت ملف الـ APK على هاتفك الأندرويد

1. أرسل ملف `masrofy-app-debug.apk` إلى هاتفك عبر (واتساب، تيليجرام، Google Drive، أو كابل USB).
2. افتح الملف واضغط على **تثبيت (Install)**.
3. إذا ظهر لك تنبيه من نظام الحماية (Google Play Protect / مصادر غير معروفة):
   - اضغط على **الإعدادات (Settings)**.
   - فعّل خيار **السماح من هذا المصدر (Allow from this source)**.
   - اضغط على **التثبيت على أي حال (Install anyway)**.
4. مبروك! التطبيق سيعمل معك بكامل كفاءته دون أي مشكلة وبقاعدة بيانات محلية سريعة.

---

## 💻 الطريقة الثانية: البناء محلياً على جهازك

إذا كان لديك **Node.js 20+** و **Java JDK 17/21** و **Android Studio / SDK**:

### لأنظمة Linux / macOS:
```bash
# 1. منح صلاحيات التنفيذ
chmod +x scripts/build-apk.sh

# 2. تشغيل السكربت المخصص
./scripts/build-apk.sh
```

### لأنظمة Windows:
```cmd
scripts\build-apk.bat
```

أو بالأوامر اليدوية:
```bash
npm install --legacy-peer-deps
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```
وستجد ملف الـ APK في:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔑 توقيع تطبيق Release للإنتاج (اختياري)
إذا أردت توقيع التطبيق بشهادة Keystore خاصة بك:
1. أنشئ Keystore مشفر.
2. حوّله إلى Base64:
   ```bash
   base64 -w 0 my-release-key.keystore > keystore-base64.txt
   ```
3. أضفه في GitHub Secrets تحت اسم: `ANDROID_KEYSTORE_BASE64`
4. أضف كلمات المرور في GitHub Secrets:
   - `RELEASE_STORE_PASSWORD`
   - `RELEASE_KEY_ALIAS`
   - `RELEASE_KEY_PASSWORD`
وسيقوم GitHub Actions تلقائياً بإنتاج APK موقع بالكامل!
