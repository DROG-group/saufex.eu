const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SITE_DIR = path.join(__dirname, '..', 'site');

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function isUpcoming(dateStr) {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

function buildEvents() {
  console.log('Building events...\n');

  // Read events YAML
  const eventsPath = path.join(DATA_DIR, 'events.yaml');
  const eventsContent = fs.readFileSync(eventsPath, 'utf8');
  const data = yaml.parse(eventsContent);

  if (!data.events || data.events.length === 0) {
    console.log('No events found.');
    return { upcoming: [], past: [] };
  }

  // Sort by date
  const events = data.events.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Split into upcoming and past
  const upcoming = events.filter(e => isUpcoming(e.date));
  const past = events.filter(e => !isUpcoming(e.date)).reverse();

  console.log(`Found ${upcoming.length} upcoming events, ${past.length} past events`);

  return { upcoming, past, all: events };
}

function generateEventsHTML(events) {
  const { upcoming, past } = events;

  let html = '';

  // Upcoming events
  if (upcoming.length > 0) {
    html += '<div class="events-section">\n';
    html += '  <h3>Upcoming Events</h3>\n';
    html += '  <div class="events-list">\n';

    upcoming.forEach(event => {
      html += `    <div class="event-card">
      <div class="event-date">${formatDate(event.date)}</div>
      <h4>${event.what}</h4>
      <div class="event-location">${event.where}</div>
      <p>${event.desc}</p>`;

      if (event.links && event.links.length > 0) {
        html += '\n      <div class="event-links">\n';
        event.links.forEach(link => {
          html += `        <a href="${link.url}" class="btn" target="_blank">${link.text}</a>\n`;
        });
        html += '      </div>';
      }

      html += '\n    </div>\n';
    });

    html += '  </div>\n';
    html += '</div>\n\n';
  }

  // Past events
  if (past.length > 0) {
    html += '<div class="events-section events-past">\n';
    html += '  <h3>Past Events</h3>\n';
    html += '  <div class="events-list">\n';

    past.forEach(event => {
      html += `    <div class="event-card event-past">
      <div class="event-date">${formatDate(event.date)}</div>
      <h4>${event.what}</h4>
      <div class="event-location">${event.where}</div>
      <p>${event.desc}</p>
    </div>\n`;
    });

    html += '  </div>\n';
    html += '</div>\n';
  }

  return html;
}

function generateEventsPage(events) {
  const eventsHTML = generateEventsHTML(events);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Events - SAUFEX</title>
  <meta name="description" content="Upcoming and past SAUFEX events, webinars, and workshops.">
  <meta property="og:title" content="Events - SAUFEX">
  <meta property="og:description" content="Upcoming and past SAUFEX events, webinars, and workshops.">
  <meta property="og:url" content="https://saufex.eu/events">
  <meta property="og:type" content="website">
  <link rel="icon" href="https://cdn.dorik.com/5ffdabc144afdb0011b83e1d/62474e909f34ad00115b4d4f/images/vignette_37inqvsf.png">
  <link rel="preload" href="https://fonts.cmsfly.com/css?family=Montserrat:400,300,600,800|Baloo+Bhai:400&display=swap" as="style">
  <link rel="stylesheet" href="https://fonts.cmsfly.com/css?family=Montserrat:400,300,600,800|Baloo+Bhai:400&display=swap">
  <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="707053d9-cf31-4d9b-91f2-2c466abd95bb" data-blockingmode="auto" type="text/javascript"></script>
  <link rel="stylesheet" href="css/style.css">
  <style>
    .events-list {
      display: grid;
      gap: 25px;
      margin-top: 25px;
    }
    .event-card {
      background: #fff;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border-left: 4px solid var(--color-4);
    }
    .event-card.event-past {
      opacity: 0.7;
      border-left-color: #ccc;
    }
    .event-date {
      color: var(--color-4);
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .event-card h4 {
      margin-bottom: 8px;
    }
    .event-location {
      color: #888;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .event-location::before {
      content: "📍 ";
    }
    .event-links {
      margin-top: 15px;
    }
    .events-past h3 {
      color: #888;
      margin-top: 50px;
    }
  </style>
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
    <section class="hero">
      <div class="container">
        <h1>Events</h1>
        <p>SAUFEX events, webinars, workshops, and conferences.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
${eventsHTML}
      </div>
    </section>
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

function getNextEvent(events) {
  if (events.upcoming.length === 0) return null;
  return events.upcoming[0];
}

function main() {
  const events = buildEvents();

  // Generate events page
  const eventsPage = generateEventsPage(events);
  fs.writeFileSync(path.join(SITE_DIR, 'events.html'), eventsPage);
  console.log('Generated: events.html');

  // Output next event info for embedding
  const nextEvent = getNextEvent(events);
  if (nextEvent) {
    console.log(`\nNext event: ${nextEvent.what}`);
    console.log(`  Date: ${formatDate(nextEvent.date)}`);
    console.log(`  Where: ${nextEvent.where}`);
  }

  console.log('\nDone!');
}

main();
