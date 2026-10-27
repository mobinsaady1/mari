MAEDE — 3D Studio Pro Upgrade

This build keeps the existing garden, boutique story, stage 3, and final message.

3D improvements in this build:
- Removed the extra remote GLB-loader dependency that could prevent the whole module from starting or replace the fitted body with a differently scaled mannequin.
- Keeps the avatar, dress, and accessories in one consistent 3D coordinate system.
- Reworked the torso as a smooth lathed surface and improved studio lighting, shadows, camera framing, and plinth.
- Added five procedural fabric looks: silk, satin, floral, lace, and glitter. The selected fabric changes the actual 3D dress material/texture.
- Added 3D dress fabric weave and material response, with different roughness/sheen settings by fabric type.
- Keeps drag-to-rotate, auto-rotation, zoom, reset view, 10 dress silhouettes, 15 dress colors, necklace variants, bag styles/colors, and existing accessory toggles.
- The full project remains local except for Three.js itself, which is imported from jsDelivr. An internet connection is still required for the Three.js module.

Run:
1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Start Live Server and open welcome.html (or serve the folder with any local HTTP server).
4. Keep internet access enabled for Three.js.

Validation notes:
- JavaScript syntax checks are run for designer3d.js, script.js, welcome.js, stage3.js, and stage4.js before packaging.
- HTML IDs and local CSS/JS references are checked for duplicates and missing files.
- Headless Chromium/WebGL screenshot testing timed out in the build environment, so full visual and pointer-interaction verification is not claimed.


Couture shape controls added in this revision:
- Independent skirt silhouette override: follow base model, A-line, ballgown, slim, mermaid, or pleated.
- Neckline choices: sweetheart, square, V, and off-shoulder styling. A skin-toned inset and piping update with the selection to make the neckline change visible in the stylized model.
- Sleeve choices: puff short, simple short, long, or sleeveless.
- Dress length slider: knee, midi, and long. The skirt profile and fold guides update together.
- The finish summary includes the selected skirt shape, neckline, sleeves, length, and fabric.
- Reset restores the default base model and independent shape controls.

The 3D body/dress remains a stylized procedural model, not a cloth-physics simulation or a production tailoring pattern. Check the result in a browser with WebGL enabled; visual fit still requires hands-on review on desktop and mobile.


نسخه ارتقای اکسسوری‌ها: برای دیدن تغییرات اکسسوری‌ها، فایل index.html را از طریق یک وب‌سرور محلی اجرا کنید (نه با باز کردن مستقیم فایل HTML). در بخش اکسسوری‌ها می‌توان مدل گوشواره، تاج، عینک، شنل، کمربند، دستبند، دستکش، رنگ نگین و فلز را تغییر داد؛ تغییرات در مدل سه‌بعدی به‌روزرسانی می‌شوند.

Latest 3D fit and material refinement:
- Necklace geometry now follows a closed path around the neck and collarbone; the front chain dips toward the upper chest and the pendant hangs close to the dress surface instead of floating far in front. Pearl and choker variants use their own fitted paths.
- Removed the flat, floating skin-colored neckline patch so the neckline reveals the curved mannequin surface beneath it.
- Refined the fabric material profiles for silk, satin, floral, lace, and glitter, including more nuanced sheen/roughness, a softer irregular woven bump texture, subtle silk/satin fibre patterns, irregular drape folds, a fine hem finish, and bodice dart details.
- This remains a procedural Three.js model; these changes improve the visual fit and material response but do not add cloth simulation or real garment physics.


Realism pass: real skirt drape (displaced folds), strand-based hair, glossy eyes with catchlights, iridescent pearls, transmissive gems, studio reflections. Optional: place a rigged/static female mannequin as mannequin.glb next to index.html to replace the procedural body (dresses are still procedural, so fit may need tuning).
