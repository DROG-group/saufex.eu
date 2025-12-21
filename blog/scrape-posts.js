const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

// All post slugs from user's list
const postSlugs = [
  // Numbered posts
  '1-Preserving-freedom-of-expression',
  '2-Resilience-Councils-the-concept',
  '3-What-is-FIMI',
  '4-Resilience',
  '5-A-Resilience-Council-statute',
  '6-Creating-a-bottom-line',
  '7-Involving-citizens',
  '8-Module-Outrageous-beliefs',
  '9-How-beliefs-form',
  '10-Module-Sustaining-beliefs',
  '11-Module-Countering-beliefs',
  '12-Summary',
  '13-For-high-school-students-the-learning-path-anatomy',
  '14-Resilience-Councils-A-thought-experiment',
  '15-The-Polish-Resilience-Councils',
  '16-Taking-inspiration-from-Cialdini',
  '17-Not-them-but-us',
  '18-What-could-be-the-place-of-young-people-in-the-Resilience-Councils',
  '19-We-need-two-types-of-discourses',
  '20-European-Master-of-countering-Disinformation-primer',
  '21-Resilience-Council-primer',
  '22-Redefined-concepts',
  '23-A-constructive-approach-to-information-resilience',
  '24-Disinfonomics',
  '25-Not-undemocratic-not-illiberal',
  '26-Policy-proposal-for-the-creation-of-a-European-Resilience-Council',
  '27-Achieving-credibility',
  '28-Critical-thinking-fact-speaking-belief-speaking-and-AI',
  '29-Module-Countering-information-incidents',
  '30-Specialist-module-Two-perceptions-of-honesty-Lewandowsky',
  '31-A-holistic-vision-on-effectively-enhancing-adolescent-resilience',
  '32-Module-Countering-information-campaigns',
  '33-Proposal-for-the-creation-of-the-European-Resilience-Council-revisited',
  '34-Belief-speaking-consultancy-a-simulation',
  '35-AI-should-refrain-from-belief-speaking-recommendations',
  '36-AI-and-FIMI-recommendations-1',
  '37-The-mission-of-the-Youth-Resilience-Council',
  '38-AI-and-FIMI-recommendations-2',
  '39-Human-rights-frame',
  '40-Why-Youth-Resilience-Councils-are-essential-to-Resilience-Councils',
  '41-Enhancing-adolescent-individual-and-societal-resilience',
  '42-Resilience-Councils-recap',
  '43-Longread-AI-ma-Interdemocracy-resilience',
  '44-Evolutionary-psychology',
  '45-A-system-of-interconnected-RCs',
  '46-Resilience-revisited',
  '47-Four-evolving-thoughts',
  '48-The-case-against-AI-simulated-empathy',
  '49-Answers-by-humans-and-by-AI-YRC-reflection',
  '50-AI-report-YRC-reflection',
  '51-Binary-forking-yrc-reflection',
  '52-Recommendations-YRC-reflection',
  '53-Program-Interdemocracy-recap',
  '54-Interdemocracys-philosophical-basics-and-participation',
  '55-AIs-dangerous-side-in-creating-educational-processes',
  '56-Flaws-in-AI-critical-thinking',
  '57-Longread-serious-limitations-of-AI',
  '57a-AI-on-blog-post-57',
  '58-AI-as-alien-thinking',
  '59-A-skeptics-manual-for-productive-AI-use',
  '60-How-AI-may-amplify-human-inequality',
  '60A-ChatGPT-on-the-SAUFEX-blog',
  '61-Claude-AIs-warning-What-I-am',
  '61A-ChatGPTs-reflections-on-blog-post-61',
  '66A-Claude-and-Grok-on-blog-posts-65-and-66',
  '67-How-AI-relates-to-fringe-ideas',
  '68-AI-on-AI-as-analyzed-by-me-a-human',
  '68A-AI-on-blog-post-68',
  '69-SAUFEX-phase-one-and-two',
  '70-Generative-AI-characteristics-1',
  '71-Generative-AI-characteristics-2',
  '72-Generative-AI-characteristics-3',
  '73-The-regional-Interdemocracy-pilot',
  '74-Toolkit-escalating-responses-to-mis-disinformation-and-FIMI-at-the-demand-side',
  '75-The-current-AI-imbalance',
  '76-A-third-ethical-frame-regarding-FIMI',
  '76A-Grok-reacts',
  '76B-ChatGPT-reacts',
  '76C-Epilogue',
  '77-Two-AI-literacy-recommendations',
  '78-The-limits-of-AI-in-content-moderation',
  '78A-On-the-consequences-of-blog-post-78',
  '79-PS',
  '80-SAUFEX-based-recommendations',
  '81-Belief-speaking-in-joint',
  '82-The-procedural-truth-of-resilience-autopoiesis-and-Interdemocracy',
  '84-The-resilience-battery-autopoiesis-through-procedural-integrity',
  '85-AI-and-education',
  '86-Unease',
  '86A-Another-day-another-group',
  '87-Interdemocracy-an-early-assessment',
  '87A-Reflections-on-blog-post-87',
  '88-Better-than-nothing',
  '89-Interdemocracy-as-a-trace',
  '89A-Notes-on-Interdemocracy-as-a-trace',

  // Non-numbered posts
  'The-EUs-Disinformation-Battle-Is-Missing-Its-Most-Vital-Ally-The-Public',
  'Preserving-the-Marketplace-of-ideas',
  'Beyond-Disinformation-Why-Information-Manipulation-Offers-a-More-Accurate-and-Neutral-Lens-on-Online-Deception',
  'Counter-Measures-Against-FIMI',
  'What-is-a-FIMI-incident',
  'Disaster-when-the-danger-of-disinformation-is-clearest',
  'Who-Fact-checks-the-fact-checkers',
  'Module-What-is-Disinformation',
  'What-is-FIMI',
  'EMOD-Template',
  'Why-FIMI',
  'Trust-module-2-How-to-build-it-the-Taiwan-example',
  'A-lack-of-trust-is-causing-disinformation-belief',
  'FIMI-detection-generally',
  'FIMI-Module-How-is-FIMI-reported',
  'FIMI-Module-Protecting-what-against-FIMI',
  'FIMI-module-how-do-you-know-if-it-is-foreign',
  'Perhaps-the-Flaws-arent-with-AI-Theyre-With-Us',
  'What-is-the-ABCDE-Framework',
  'What-are-the-DISARM-Frameworks'
];

const BASE_URL = 'https://saufex.eu/post/';
const OUTPUT_DIR = path.join(__dirname, 'posts');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchPost(slug) {
  const url = BASE_URL + slug;
  console.log(`Fetching: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  Failed to fetch ${slug}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract metadata from JSON-LD
    let metadata = {};
    const jsonLd = $('script[type="application/ld+json"]').html();
    if (jsonLd) {
      try {
        metadata = JSON.parse(jsonLd);
      } catch (e) {
        console.error(`  Failed to parse JSON-LD for ${slug}`);
      }
    }

    // Extract title
    const title = metadata.headline || $('title').text() || slug;

    // Extract author
    const author = metadata.author?.name || 'Onno Hansen-Staszynski';

    // Extract dates
    const datePublished = metadata.datePublished
      ? new Date(metadata.datePublished).toISOString().split('T')[0]
      : null;
    const dateModified = metadata.dateModified
      ? new Date(metadata.dateModified).toISOString().split('T')[0]
      : null;

    // Extract description
    const description = $('meta[name="description"]').attr('content') || '';

    // Extract main content
    // The content is typically in sections after the header
    // We need to find the main content area
    let contentHtml = '';

    // Try to find the main content section (usually after header, before footer)
    // Look for text content in dorik sections
    $('section').each((i, section) => {
      const sectionHtml = $(section).html();
      // Skip header and footer sections (usually have specific class patterns)
      if (!$(section).hasClass('symbol--37i6ho0s') &&
          !sectionHtml.includes('SAUFEX Header') &&
          !sectionHtml.includes('SAUFEX Footer')) {
        contentHtml += sectionHtml;
      }
    });

    // If no sections found, try to get body content
    if (!contentHtml) {
      // Remove header, footer, scripts
      $('header, footer, script, style, nav').remove();
      contentHtml = $('body').html() || '';
    }

    // Convert to markdown
    let markdown = '';
    if (contentHtml) {
      // Clean up the HTML before conversion
      const $content = cheerio.load(contentHtml);
      // Remove empty elements and Dorik-specific classes
      $content('[class*="dorik-"]').each((i, el) => {
        // Keep the content but remove Dorik-specific wrapper divs if they're just containers
        const $el = $content(el);
        if ($el.text().trim() === '' && $el.find('img').length === 0) {
          $el.remove();
        }
      });

      markdown = turndown.turndown($content.html() || '');
    }

    // Clean up markdown
    markdown = markdown
      .replace(/\n{3,}/g, '\n\n')  // Remove excessive newlines
      .replace(/^\s+|\s+$/g, '');   // Trim

    return {
      slug,
      title,
      author,
      datePublished,
      dateModified,
      description,
      content: markdown
    };

  } catch (error) {
    console.error(`  Error fetching ${slug}:`, error.message);
    return null;
  }
}

function savePost(post) {
  if (!post) return;

  const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
slug: "${post.slug}"
author: "${post.author}"
date: "${post.datePublished || 'unknown'}"
updated: "${post.dateModified || post.datePublished || 'unknown'}"
description: "${post.description.replace(/"/g, '\\"')}"
---

`;

  const content = frontmatter + post.content;
  const filename = `${post.slug}.md`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`  Saved: ${filename}`);
}

async function main() {
  console.log(`Starting to scrape ${postSlugs.length} posts...\n`);

  let successCount = 0;
  let failCount = 0;

  // Process posts sequentially to avoid overwhelming the server
  for (const slug of postSlugs) {
    const post = await fetchPost(slug);
    if (post) {
      savePost(post);
      successCount++;
    } else {
      failCount++;
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\nDone! Successfully scraped ${successCount} posts, failed: ${failCount}`);
}

main();
