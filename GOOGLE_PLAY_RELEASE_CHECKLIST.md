# Google Play Release Checklist

## App Listing Materials

- App name: Strucforge Estimates Pro v5.0
- Short description: Construction cost estimator for materials, labor, budgets, and estimate reports.
- Full description: Strucforge Estimates Pro v5.0 helps contractors, engineers, architects, foremen, quantity surveyors, estimators, and construction students prepare construction cost estimates with project details, material and labor breakdowns, saved local revisions, printable BOQ reports, and spreadsheet exports.
- App icon: prepare a final 512x512 PNG.
- Feature graphic: prepare a 1024x500 PNG.
- Phone screenshots: capture Android phone screens for Home, New Estimate, Saved Estimates, Reports/BOQ, and Help/Policies.
- Privacy Policy URL: publish the in-app privacy policy as a public web page before production submission.
- Support email: support@strucforge.com.
- App category: Business / Productivity / Construction Tools.
- Content rating questionnaire: complete in Google Play Console.
- Data Safety form: declare local estimate data storage and confirm whether analytics, crash reporting, backend APIs, cloud storage, ads, or remote services are used.
- Target audience: professional construction users and construction students.
- App access instructions: not required unless authentication is added later.
- Release artifact: signed Android App Bundle (.aab).

## Testing Checklist

- Install on a real Android phone.
- Test first launch.
- Test estimate creation.
- Test calculation result against a known manual sample.
- Test saved estimates and loading a saved revision.
- Test print/export from Dashboard and Reports/BOQ.
- Test offline or slow internet behavior.
- Test Android back button behavior.
- Test portrait mode.
- Test app restart and local data persistence.

## Policy Risk Checklist

- Not a low-quality website wrapper: packaged static app with local estimating functionality.
- Has real app functionality: calculators, project setup, saved estimates, reports, print, and Excel export.
- Has privacy policy.
- Has construction estimate disclaimer.
- Has support contact.
- No unnecessary Android permissions.
- No cleartext traffic enabled.
- No misleading claims about final cost accuracy.
- If paid digital features are added later, use Google Play Billing.
- No hardcoded secrets or production API keys.

## Closed Testing Reminder

New personal Google Play developer accounts may need closed testing with at least 12 testers for 14 continuous days before production access.

## Android Icon And Splash Assets

Replace placeholder launcher and splash assets before release:

- `android/app/src/main/res/mipmap-*/ic_launcher.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_round.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_foreground.png`
- `android/app/src/main/res/drawable*/splash.png`
- `android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml`
- `android/app/src/main/res/values/ic_launcher_background.xml`

Use Android Studio Image Asset tools or Capacitor asset tooling to regenerate density-specific assets from final brand artwork.

## Release Build Steps

1. Open Android Studio.
2. Open `D:\_CLAUDE\_ESTIMATES-2\android`.
3. Wait for Gradle sync to finish.
4. Choose Build > Generate Signed Bundle / APK.
5. Select Android App Bundle.
6. Create or select a secure keystore.
7. Build the signed `.aab`.
8. Upload the `.aab` to a Google Play Console testing track.

## Command Line Verification

```powershell
npm install
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

## Before Production Submission

- Publish an external privacy policy URL.
- Replace placeholder app icon and splash assets.
- Capture real phone screenshots.
- Complete the Data Safety and Content Rating forms.
- Verify calculations against known estimating examples.
- Build and archive a signed release `.aab` from a secure keystore.
