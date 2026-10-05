// Ajusta el proyecto Android generado por Capacitor (se ejecuta en GitHub Actions después de `npx cap add android`).
// - permisos (micrófono, notificaciones)
// - íconos y splash del búho
// - colores oscuros
// - firma fija (para que las actualizaciones se instalen encima de la versión anterior)
// - versionCode/versionName automáticos
import { readFileSync, writeFileSync, cpSync, existsSync } from "node:fs";
import { join } from "node:path";

const A = "android/app";
const run = Number(process.env.GITHUB_RUN_NUMBER || 1);
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

// 1) Manifest
const manPath = join(A, "src/main/AndroidManifest.xml");
let man = readFileSync(manPath, "utf8");
const perms = [
  "android.permission.RECORD_AUDIO",
  "android.permission.MODIFY_AUDIO_SETTINGS",
  "android.permission.POST_NOTIFICATIONS",
  "android.permission.VIBRATE",
];
for (const p of perms) {
  if (!man.includes(p)) man = man.replace("</manifest>", `    <uses-permission android:name="${p}" />\n</manifest>`);
}
if (!man.includes("android.intent.action.TTS_SERVICE")) {
  man = man.replace("</manifest>", `    <queries>\n        <intent><action android:name="android.intent.action.TTS_SERVICE" /></intent>\n        <intent><action android:name="android.speech.RecognitionService" /></intent>\n    </queries>\n</manifest>`);
}
if (!man.includes("windowSoftInputMode")) man = man.replace('android:name=".MainActivity"', 'android:name=".MainActivity"\n            android:windowSoftInputMode="adjustResize"');
writeFileSync(manPath, man);

// 2) Versión + firma fija
const gradlePath = join(A, "build.gradle");
let gr = readFileSync(gradlePath, "utf8");
gr = gr.replace(/versionCode \d+/, `versionCode ${run}`);
gr = gr.replace(/versionName "[^"]*"/, `versionName "${pkg.version}.${run}"`);
if (!gr.includes("signingConfigs")) {
  gr = gr.replace(/android\s*\{/, `android {
    lint {
        checkReleaseBuilds false
        abortOnError false
    }
    signingConfigs {
        debug {
            storeFile file("../../keystore/debug.keystore")
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
        release {
            storeFile file("../../keystore/debug.keystore")
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
    }`);
  gr = gr.replace(/buildTypes\s*\{\s*release\s*\{/, `buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release`);
}
writeFileSync(gradlePath, gr);

// 3) Íconos y splash
if (existsSync("android-res")) cpSync("android-res", join(A, "src/main/res"), { recursive: true });
const bgPath = join(A, "src/main/res/values/ic_launcher_background.xml");
writeFileSync(bgPath, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#140D0F</color>\n</resources>\n`);

// 4) Tema oscuro (barras de estado y navegación)
const stylesPath = join(A, "src/main/res/values/styles.xml");
let st = readFileSync(stylesPath, "utf8");
st = st.replace(/<style name="AppTheme.NoActionBar"([^>]*)>/, `<style name="AppTheme.NoActionBar"$1>
        <item name="android:statusBarColor">#140D0F</item>
        <item name="android:navigationBarColor">#140D0F</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowBackground">@color/ic_launcher_background</item>
        <item name="android:windowOptOutEdgeToEdgeEnforcement">true</item>`);
st = st.replace(/<style name="AppTheme.NoActionBarLaunch"([^>]*)>/, `<style name="AppTheme.NoActionBarLaunch"$1>
        <item name="windowSplashScreenBackground">#140D0F</item>
        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>`);
writeFileSync(stylesPath, st);

// 5) Variables: SDK objetivo (Capacitor 7 usa 35; Android 16 ejecuta apps con target 35 sin problema)
console.log(`Android configurado: versionCode ${run}, versionName ${pkg.version}.${run}`);
