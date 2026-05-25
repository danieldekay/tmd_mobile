# Design: Footer Cleanup And Debug Page

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Route Pages                                     │
│                                                                              │
│    /impressum/+page.html (Impressum)                                         │
│    /datenschutz/+page.html (Datenschutz)                                     │
│    /impressum/+page.html (Impressum)                                         │
│    /datenschutz/+page.html (Datenschutz)                                     │
│    /impressum/+page.html (Impressum)                                         │
│    /datenschutz/+page.html (Datenschutz)                                     │
│    /impressum/+page.html (Impressum)                                         │
│    /datenschutz/+page.html (Datenschutz)                                     │
│    /impressum/+page.html (Impressum)                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### File Structure

```json
{
   "impressum": "...",
   "datenschutz": "...",
   "impressum": "...",
   "datenschutz": "...",
   "impressum": "...",
   "datenschutz": "..."
}
```

### Print Layout

```css
@media print {
  body {
     -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
     --color-text: #000;
     --color-bg: #fff;
     --font-size: 12pt;
     --line-height: 1.6;
     --margin: 1cm;
     --page-break: always;
   }
   .legal-page {
    display: block;
   }
   .legal-nav {
    display: none;
   }
   .legal-header {
    page-break-after: always;
   }
   .legal-section {
    page-break-inside: avoid;
    page-break-after: auto;
   }
   .legal-footer {
    display: none;
   }
}
```
