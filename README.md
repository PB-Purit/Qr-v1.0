# QR Store

A mobile-friendly store utility for generating QR codes and accessing store operations, reference templates, emergency contacts, and a fire-safety map.

## Features

- Generate a QR code from entered text, numbers, or a URL.
- View and download QR codes for opening and night-shift checkpoints and Smart Log Store.
- Open checkpoint lists in a scan popup and mark points as scanned.
- Browse operational message templates and PDA reference items from the menu.
- View emergency and local-support contact lists with tap-to-call links.
- View the fireman map.

The checkpoint popup currently tracks elapsed time and selected points in the browser; submitting displays a confirmation and does not send scan data to a backend.

## Tech stack

- **Next.js 15** with the App Router
- **React 19**
- **TypeScript 5** with strict type checking
- **Tailwind CSS 4** for styling
- **qrcode.react** for QR-code rendering
- **Lucide React** for icons
- **ESLint 9** and `eslint-config-next` for linting

There is no database or application API in this project. Station URLs, templates, PDA reference items, and contact lists are defined as static TypeScript data under `src/lib/`.

## Data structures

The application uses typed objects and arrays rather than database tables:

- **Station** (`src/lib/stations.ts`): `{ id: string; label: string; url: string }`. Opening and night checkpoints are arrays of stations; Smart Log Store is a single station.
- **PDA items** (`src/lib/stations.ts`): an array of `{ id, title, value }` records displayed in the menu.
- **TemplateItem** (`src/lib/templates.ts`): `{ id, title, text, url?, urlLabel?, credentials? }`. Optional credentials contain a username and password. Templates are grouped in records with an `id`, `title`, and `items` array.
- **EmergencyContact** (`src/lib/emergencyContacts.ts`): `{ name: string; role?: string; phone?: string }`. Contact groups contain a title and an array of contacts.
- **SupportContact** (`src/lib/emergencyContacts.ts`): `{ name: string; workPhone?: string; mobile?: string }`. Room contacts and local support contacts are also stored as arrays of contact records.

These values are maintained in source files; update the corresponding data in `src/lib/` when store information changes. Review store-specific contact and reference data before sharing or deploying the project.

## Getting started

### Requirements

- Node.js compatible with Next.js 15
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server (run `npm run build` first). |
| `npm run lint` | Run ESLint. |

## Project structure

```text
src/
  app/
    globals.css          Global styles
    layout.tsx           Root layout and page metadata
    page.tsx             Store utility home page
  components/
    CustomQrGenerator.tsx
    QrDisplay.tsx
    ScanPopup.tsx
    EmergencyContacts.tsx
    Header.tsx
    MenuDrawer.tsx
    CopyBox.tsx
  lib/
    stations.ts          Checkpoints, Smart Log Store, and PDA items
    templates.ts         Operational message templates
    emergencyContacts.ts Contact and support data
public/
  pic/Map.png            Fireman map image
```
