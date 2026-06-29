# Google Play Release Checklist

## App Identity

- App name: StrucForge Estimates
- Android package ID: `com.strucforge.estimates`
- Version name: `1.0.0`
- Version code: `1`
- Category: Business / Productivity / Construction Tools
- Support email: support@strucforge.com
- Internal product/version note: Pro v5.0 may appear in About/help text only, not as the Android launcher label.

## Required Play Console Materials

- App name: StrucForge Estimates
- Short description: Construction cost estimator for materials, labor, budgets, and estimate reports.
- Full description: StrucForge Estimates helps contractors, engineers, architects, foremen, quantity surveyors, estimators, and construction students prepare construction cost estimates with project details, material and labor breakdowns, saved local revisions, printable BOQ reports, and spreadsheet exports.
- App icon: final 512x512 PNG.
- Feature graphic: final 1024x500 PNG.
- Phone screenshots: Home, New Estimate, Saved Estimates, Reports/BOQ, Help/Policies, and at least one calculator screen.
- Privacy Policy URL: publish a public URL before production submission.
- Support email: support@strucforge.com.
- App category: Business / Productivity / Construction Tools.
- Data Safety form: confirm local storage, no ads, no analytics, no backend, and no cloud sync unless production services are added later.
- Content rating questionnaire: complete in Google Play Console.
- Target audience: professional construction users and construction students.
- App access instructions: not required unless authentication is added later.
- Signed Android App Bundle: upload the final `.aab` to a testing track first.

## Testing Checklist

- Test install on a real Android device.
- Test first launch.
- Test estimate creation.
- Test calculation results against known manual examples.
- Test report, print, and Excel export.
- Test saved estimates and loading a saved revision.
- Test offline or slow internet behavior.
- Test Android back button behavior.
- Test portrait mode.
- Test Privacy Policy, Disclaimer, About, and Support sections.
- Test all external links if any are added later.
- Test app restart and local data persistence.

## Policy Checklist

- App is not only a low-quality website wrapper; it packages local web assets through Capacitor.
- App has real construction estimating functionality.
- App has Privacy Policy.
- App has Disclaimer.
- App has Support page/contact section.
- App does not make misleading engineering or final cost guarantees.
- App does not request unnecessary permissions.
- Cleartext traffic remains disabled.
- No hardcoded secrets, API keys, passwords, or private tokens.
- Paid digital features must use Google Play Billing.
- New personal developer accounts may require closed testing before production release.

## Android Icon And Splash Asset Locations

Replace placeholder/generated assets before commercial release:

- Launcher icon PNGs: `android/app/src/main/res/mipmap-*/ic_launcher.png`
- Round launcher icon PNGs: `android/app/src/main/res/mipmap-*/ic_launcher_round.png`
- Adaptive icon foreground PNGs: `android/app/src/main/res/mipmap-*/ic_launcher_foreground.png`
- Adaptive icon XML: `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- Adaptive round icon XML: `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`
- Adaptive icon background: `android/app/src/main/res/values/ic_launcher_background.xml`
- Splash screen images: `android/app/src/main/res/drawable*/splash.png`
- Splash/theme styles: `android/app/src/main/res/values/styles.xml`

Use Android Studio Image Asset tools or Capacitor asset tooling to regenerate density-specific assets from final brand artwork.

## Android Studio Release Build Steps

1. Open Android Studio.
2. Open `D:\_CLAUDE\_ESTIMATES-2\android`.
3. Wait for Gradle sync to finish.
4. Confirm the app module is selected.
5. Choose Build > Generate Signed Bundle / APK.
6. Choose Android App Bundle.
7. Create or select the upload keystore.
8. Build the signed `.aab`.
9. Upload the `.aab` to a Google Play Console internal, closed, or open testing track first.

## Command Line Verification

```powershell
npm install
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
.\gradlew.bat bundleRelease
```

## Before Production Submission

- Publish an external privacy policy URL.
- Replace placeholder app icon and splash assets.
- Capture real phone screenshots.
- Complete the Data Safety form.
- Complete the Content Rating questionnaire.
- Verify calculations against known estimating examples.
- Build and archive a signed release `.aab` from a secure keystore.
- Run closed testing if required by the account type.
