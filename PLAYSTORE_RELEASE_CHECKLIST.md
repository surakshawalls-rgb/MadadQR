# Google Play Console Release Checklist

This checklist is for releasing MadadQR to Google Play Console.

## 1) File To Upload

Use this file for production release upload:
- `android/app/build/outputs/bundle/release/app-release.aab`

Optional for direct install/testing only:
- `public/MadadQR.apk`

## 2) Before Upload

- Confirm package name (applicationId) is final.
- Confirm versionCode is incremented for each new release.
- Confirm versionName is updated for the release.
- Build release AAB from latest source.
- Verify release signing key is available and backed up.

Key files to back up securely:
- `android/app/madadqr-upload.jks`
- `android/keystore.properties`

## 3) Play Console Steps

1. Open Google Play Console.
2. Select your app or create a new app.
3. Go to `Release` -> `Production`.
4. Click `Create new release`.
5. Upload `app-release.aab`.
6. Add release notes.
7. Save and review release.
8. Start rollout to production.

## 4) Required Store Setup Sections

Complete these before publishing:
- App access
- Ads declaration
- Content rating questionnaire
- Target audience and content
- Data safety form
- Privacy policy URL
- App category and contact details
- Store listing assets (icon, feature graphic, screenshots, short/full description)

## 5) Quick Validation Commands

From project root:

```powershell
npm run build
npx cap sync android
Set-Location android
.\gradlew.bat :app:bundleRelease
```

Verify signed APK (optional local verification):

```powershell
$apk='D:\All Projects\MadadQR\android\app\build\outputs\apk\release\app-release.apk'
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\34.0.0\apksigner.bat" verify --print-certs $apk
```

## 6) Release Hygiene

- Never lose the upload keystore.
- Never commit real secrets in public repos.
- Keep a secure backup of signing files.
- Increment versionCode on every upload.
- Keep changelog/release notes clear and short.
