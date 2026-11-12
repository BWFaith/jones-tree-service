# Jones Tree Service Website
Static site (HTML/CSS/JS). Open `index.html` or upload the folder to any host.
Pages: index, about, services, gallery, process, areas, reviews, faq, contact, quote.

## Replace images
- Before/after: `assets/img/before-1..3.svg` and `after-1..3.svg` (swap for same-named JPGs and update the paths in gallery.html/index.html). Use 1200x800.
- Job photos: `assets/img/*.jpg` (your uploads are already used).

## Quote emails (customer + owner copy)
A static site cannot send email alone. Use free EmailJS:
1. Create account at emailjs.com, add an email service (Gmail).
2. Create a template using variables `{{to_email}}`, `{{subject}}`, `{{name}}`, `{{summary}}`, `{{estimate}}`; set "To" = `{{to_email}}`.
3. Paste Public Key, Service ID, Template ID into `assets/js/config.js`.
Each booking sends one email to the customer and one to Jonesdalton911@gmail.com. Until configured, it falls back to opening the visitor's email app.

## Pricing
Edit base prices in `assets/js/main.js` (array `S`) and multipliers in `quote.html`.
## Colors
`assets/css/style.css` variables at the top (`--or` orange, `--gr` green).
