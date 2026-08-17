# PetCare Passport — Free GitHub Pages Version

This is the browser-only version of the PetCare Passport concept.

## No Streamlit. No backend. No API key.

Stack:
- HTML
- CSS
- Vanilla JavaScript
- Browser localStorage
- No required third-party service

It can be hosted directly on GitHub Pages because GitHub Pages publishes static HTML, CSS and JavaScript files.

## Run locally

Double-click `index.html` or use a simple local server:

```bash
cd PetCare_Passport_Web
python3 -m http.server 8000
```

Open:

http://localhost:8000

## Publish on GitHub Pages

1. Create a public repository, for example `PetCare`.
2. Upload `index.html`, `styles.css` and `app.js`.
3. Go to Settings → Pages.
4. Under Build and deployment, choose `Deploy from a branch`.
5. Select `main` and `/root`.
6. Save.
7. GitHub will publish the site at:

`https://YOUR_USERNAME.github.io/PetCare/`

GitHub Pages supports static HTML/CSS/JavaScript and is available in public repositories on GitHub Free.

## Important architecture limitation

This version stores data in the visitor's browser with localStorage.

Therefore:
- data does not sync between devices
- there is no real multi-user account system
- community posts are local to the browser
- documents are local browser data
- reminders appear when the site is opened
- no background email/push service exists

For a real public product, the next version should add a backend, authentication, PostgreSQL, private object storage, notification workers, OCR and an actual LLM service.

## Medical safety

The application is a record-keeping and reminder tool. It does not diagnose pets. Vaccination, deworming, medication and treatment schedules should be confirmed with a veterinarian. Community experiences should be treated as personal experiences, not medical guidance.

## Files

- `index.html` — landing page and app shell
- `styles.css` — responsive visual system
- `app.js` — state, local database, forms, dashboard, timeline, reminders and local AI assistant
