# Arrow Tracker Web Downloader

Single-file Web Bluetooth app for the Arrow Tracker flight recorder: connect,
list stored flights, download flight data as CSV, erase flash, and edit device
configuration.

**Live page:** https://craigfoo.github.io/arrow-tracker-web/

Requires Chrome on Android (or another Web Bluetooth browser whose adapter can
scan Coded PHY extended advertisements), served over HTTPS.

## Deploying

Push to `main`. GitHub Actions runs the unit tests (`node --test`) and, if they
pass, publishes the repo root to GitHub Pages.

This repo is a deploy target — the source of truth lives in the Arrow Tracker
project's `02 Development/Software/web-downloader/` folder and is copied here
by its `deploy.ps1`.
