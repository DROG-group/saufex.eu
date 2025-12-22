const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const SITE_DIR = path.join(__dirname, '..', 'site');

// Shared CSS for all pages
const SHARED_CSS = `
:root {
  --color-1: #070325;
  --color-2: #2B024D;
  --color-3: #735B00;
  --color-4: #A88500;
  --color-5: #07336F;
  --color-6: #1A0C75;
  --color-7: #463803;
  --color-8: #06172E;
  --color-9: #FFFFFF;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-size: 16px;
  line-height: 1.7;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  color: #616773;
  background-color: #ffffff;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Baloo Bhai', display;
  color: var(--color-2);
  margin-bottom: 0.5em;
}

h1 { font-size: 2.5rem; line-height: 1.3; letter-spacing: -1px; }
h2 { font-size: 2rem; line-height: 1.3; }
h3 { font-size: 1.5rem; line-height: 1.4; font-family: 'Montserrat', sans-serif; font-weight: 600; }
h4 { font-size: 1.25rem; font-family: 'Montserrat', sans-serif; font-weight: 600; }
h5 { font-size: 1rem; font-family: 'Montserrat', sans-serif; font-weight: 600; }

a {
  color: var(--color-4);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  background-color: var(--color-8);
  padding: 20px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.3s ease;
}

.header.scrolled {
  background-color: var(--color-4);
}

.header-spacer {
  height: 80px;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.logo img {
  height: 40px;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav a {
  color: var(--color-9);
  font-size: 14px;
}

/* Sections */
.section {
  padding: 60px 20px;
}

.section-dark {
  background: linear-gradient(135deg, var(--color-8) 0%, var(--color-2) 100%);
  color: var(--color-9);
}

.section-light {
  background-color: #f8f9fa;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
}

.section-title h2 {
  color: var(--color-4);
}

/* Grid */
.grid {
  display: grid;
  gap: 30px;
}

.grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.grid-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

/* Cards */
.card {
  background: #fff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.card h3, .card h4 {
  margin-bottom: 15px;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: var(--color-4);
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: var(--color-3);
  text-decoration: none;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--color-4);
  color: var(--color-4);
}

.btn-outline:hover {
  background-color: var(--color-4);
  color: #fff;
}

/* Footer */
.footer {
  background-color: var(--color-8);
  color: var(--color-9);
  padding: 60px 20px 30px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer h4 {
  color: var(--color-9);
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
}

.footer a {
  color: var(--color-9);
  opacity: 0.8;
  display: block;
  margin-bottom: 10px;
}

.footer a:hover {
  opacity: 1;
}

.footer-bottom {
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 12px;
  opacity: 0.6;
  text-align: center;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, var(--color-8) 0%, var(--color-2) 100%);
  color: var(--color-9);
  padding: 100px 20px 80px;
  text-align: center;
}

.hero h1 {
  color: var(--color-4);
  margin-bottom: 20px;
}

.hero p {
  max-width: 700px;
  margin: 0 auto 30px;
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Partners */
.partner {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  margin-bottom: 40px;
}

.partner img {
  width: 120px;
  height: auto;
  flex-shrink: 0;
}

/* Lists */
ul, ol {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

li {
  margin-bottom: 0.5em;
}

/* Text utilities */
.text-center { text-align: center; }
.text-gold { color: var(--color-4); }
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 1rem; }
.mb-2 { margin-bottom: 2rem; }

@media (max-width: 768px) {
  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.5rem; }
  .header-inner { justify-content: center; text-align: center; }
  .hero { padding: 60px 20px 40px; }
  .partner { flex-direction: column; align-items: center; text-align: center; }
  .partner img { width: 80px; }
}
`;

function extractText($, el) {
  return $(el).text().trim();
}

function extractContent($, selector) {
  const items = [];
  $(selector).each((i, el) => {
    items.push($(el).html());
  });
  return items;
}

function cleanupPage(filename) {
  console.log(`Processing: ${filename}`);

  const filepath = path.join(SITE_DIR, filename);
  const html = fs.readFileSync(filepath, 'utf8');
  const $ = cheerio.load(html);

  // Extract metadata
  const title = $('title').text() || 'SAUFEX';
  const description = $('meta[name="description"]').attr('content') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';

  // Extract main content structure
  const sections = [];

  // Find all section elements
  $('section, [data-testid="section"]').each((i, section) => {
    const $section = $(section);
    const content = {
      headings: [],
      paragraphs: [],
      images: [],
      links: [],
      lists: []
    };

    // Extract headings
    $section.find('h1, h2, h3, h4, h5, h6').each((j, h) => {
      const text = $(h).text().trim();
      if (text && text.length < 500) {
        content.headings.push({
          level: h.tagName.toLowerCase(),
          text: text
        });
      }
    });

    // Extract paragraphs
    $section.find('p').each((j, p) => {
      const text = $(p).text().trim();
      if (text && text.length > 10) {
        content.paragraphs.push(text);
      }
    });

    // Extract images
    $section.find('img').each((j, img) => {
      const src = $(img).attr('src');
      const alt = $(img).attr('alt') || '';
      if (src && !src.includes('spinner') && !src.includes('data:')) {
        content.images.push({ src, alt });
      }
    });

    // Extract links (buttons and anchors)
    $section.find('a[href]').each((j, a) => {
      const href = $(a).attr('href');
      const text = $(a).text().trim();
      if (href && text && !href.startsWith('#') && href !== '/') {
        content.links.push({ href, text });
      }
    });

    // Extract lists
    $section.find('ul, ol').each((j, list) => {
      const items = [];
      $(list).find('li').each((k, li) => {
        const text = $(li).text().trim();
        if (text) items.push(text);
      });
      if (items.length > 0) {
        content.lists.push(items);
      }
    });

    if (content.headings.length > 0 || content.paragraphs.length > 0) {
      sections.push(content);
    }
  });

  return { title, description, ogImage, sections, filename };
}

function generateCleanHTML(pageData) {
  const { title, description, ogImage, sections, filename } = pageData;
  const slug = filename.replace('.html', '');

  let sectionsHTML = '';

  sections.forEach((section, i) => {
    const isHero = i === 0 && section.headings.some(h => h.level === 'h1');
    const sectionClass = isHero ? 'hero' : (i % 2 === 0 ? 'section' : 'section section-light');

    let content = '<div class="container">';

    // Add headings
    section.headings.forEach(h => {
      content += `<${h.level}>${h.text}</${h.level}>\n`;
    });

    // Add paragraphs
    section.paragraphs.forEach(p => {
      content += `<p>${p}</p>\n`;
    });

    // Add images
    section.images.forEach(img => {
      content += `<img src="${img.src}" alt="${img.alt}" loading="lazy">\n`;
    });

    // Add lists
    section.lists.forEach(list => {
      content += '<ul>\n';
      list.forEach(item => {
        content += `  <li>${item}</li>\n`;
      });
      content += '</ul>\n';
    });

    // Add links as buttons
    if (section.links.length > 0) {
      content += '<div class="buttons" style="margin-top: 20px;">\n';
      section.links.forEach(link => {
        const target = link.href.startsWith('http') ? ' target="_blank"' : '';
        content += `  <a href="${link.href}" class="btn"${target}>${link.text}</a>\n`;
      });
      content += '</div>\n';
    }

    content += '</div>';

    sectionsHTML += `<section class="${sectionClass}">\n${content}\n</section>\n\n`;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://saufex.eu/${slug}">
  <meta property="og:type" content="website">
  ${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}
  <link rel="icon" href="https://cdn.dorik.com/5ffdabc144afdb0011b83e1d/62474e909f34ad00115b4d4f/images/vignette_37inqvsf.png">
  <link rel="preload" href="https://fonts.cmsfly.com/css?family=Montserrat:400,300,600,800|Baloo+Bhai:400&display=swap" as="style">
  <link rel="stylesheet" href="https://fonts.cmsfly.com/css?family=Montserrat:400,300,600,800|Baloo+Bhai:400&display=swap">
  <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="707053d9-cf31-4d9b-91f2-2c466abd95bb" data-blockingmode="auto" type="text/javascript"></script>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="header" id="header">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <img src="https://cdn.dorik.com/5ffdabc144afdb0011b83e1d/62474e909f34ad00115b4d4f/images/Saufex_09cgctgm.png" alt="SAUFEX">
      </a>
      <nav class="nav">
        <a href="index.html">Home</a>
        <a href="engagement.html">Engagement</a>
        <a href="research.html">Research</a>
        <a href="impact.html">Impact</a>
        <a href="about.html">About</a>
        <a href="blog.html">Blog</a>
      </nav>
    </div>
  </header>
  <div class="header-spacer"></div>

  <main>
${sectionsHTML}
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>SAUFEX</h4>
          <p>Secure Automated Unified Framework for Exchange - combating foreign information manipulation and interference.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="index.html">Home</a>
          <a href="engagement.html">Engagement & Collaboration</a>
          <a href="research.html">Research & Resources</a>
          <a href="impact.html">Impact & Outreach</a>
          <a href="about.html">About & Contact</a>
          <a href="blog.html">Blog</a>
        </div>
        <div>
          <h4>Connect</h4>
          <a href="mailto:info@saufex.eu">info@saufex.eu</a>
          <a href="https://discord.gg/bvaGd5rahu">Discord</a>
        </div>
      </div>
      <div class="footer-bottom">
        Funded by the European Union.
      </div>
    </div>
  </footer>

  <script>
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  </script>
</body>
</html>`;
}

function main() {
  console.log('Cleaning up SAUFEX site...\n');

  // Write shared CSS
  const cssDir = path.join(SITE_DIR, 'css');
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  fs.writeFileSync(path.join(cssDir, 'style.css'), SHARED_CSS);
  console.log('Created: css/style.css\n');

  // Process each page
  const pages = ['index.html', 'engagement.html', 'research.html', 'impact.html', 'about.html'];

  for (const page of pages) {
    try {
      const pageData = cleanupPage(page);
      const cleanHTML = generateCleanHTML(pageData);

      // Backup original
      const backupPath = path.join(SITE_DIR, `${page}.backup`);
      fs.copyFileSync(path.join(SITE_DIR, page), backupPath);

      // Write clean version
      fs.writeFileSync(path.join(SITE_DIR, page), cleanHTML);

      const oldSize = fs.statSync(backupPath).size;
      const newSize = fs.statSync(path.join(SITE_DIR, page)).size;
      console.log(`  ${page}: ${Math.round(oldSize/1024)}KB -> ${Math.round(newSize/1024)}KB (${Math.round((1 - newSize/oldSize) * 100)}% reduction)`);
    } catch (error) {
      console.error(`Error processing ${page}:`, error.message);
    }
  }

  console.log('\nDone! Original files backed up with .backup extension');
}

main();
