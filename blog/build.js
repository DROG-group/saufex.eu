const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_DIR = path.join(__dirname, '..', 'site', 'post');
const SITE_DIR = path.join(__dirname, '..', 'site');
const POST_TEMPLATE = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const LIST_TEMPLATE = fs.readFileSync(path.join(__dirname, 'list-template.html'), 'utf8');

// Configure marked for proper rendering
marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false
});

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function formatDate(dateStr) {
  if (!dateStr || dateStr === 'unknown') return 'Unknown';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

function cleanContent(content) {
  // Remove the header section that was scraped (logo, nav links)
  let cleaned = content;

  // Remove lines that look like navigation/header elements
  const lines = cleaned.split('\n');
  const filteredLines = [];
  let skipUntilHeading = true;

  for (const line of lines) {
    // Skip header elements (logo, nav links at the start)
    if (skipUntilHeading) {
      if (line.startsWith('# ')) {
        skipUntilHeading = false;
        filteredLines.push(line);
      } else if (line.includes('[![Logo]') ||
                 line.includes('[Contact]') ||
                 line.includes('[Join Discord]') ||
                 line.trim() === '*' ||
                 line.trim() === '') {
        continue;
      } else if (!line.startsWith('*')) {
        skipUntilHeading = false;
        filteredLines.push(line);
      }
    } else {
      // Skip footer elements
      if (line.includes('Subscribe now') ||
          line.includes('Get the latest updates') ||
          line === 'Subscribe' ||
          line.includes('[Home](') ||
          line.includes('[About](') ||
          line.includes('[Research](') ||
          line.includes('[Impact](') ||
          line.includes('[Policy](') ||
          line.includes('[Engagement](') ||
          line.includes('[![Co-funded by the European Union](')) {
        continue;
      }
      filteredLines.push(line);
    }
  }

  cleaned = filteredLines.join('\n');

  // Remove duplicate title if it appears in content
  // (the title is shown separately in the template)
  const titleMatch = cleaned.match(/^# .+\n/);
  if (titleMatch) {
    cleaned = cleaned.replace(titleMatch[0], '');
  }

  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  // Convert absolute saufex.eu links to relative links
  cleaned = cleaned.replace(/https:\/\/saufex\.eu\/post\/([^)\s"]+)/g, '$1.html');
  cleaned = cleaned.replace(/https:\/\/saufex\.eu\//g, '../');

  return cleaned;
}

function buildPost(filename) {
  const filepath = path.join(POSTS_DIR, filename);
  const fileContent = fs.readFileSync(filepath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);

  // Clean and convert content
  const cleanedContent = cleanContent(content);
  const htmlContent = marked(cleanedContent);

  // Build the HTML
  let html = POST_TEMPLATE;
  html = html.replace(/\{\{TITLE\}\}/g, frontmatter.title || 'Untitled');
  html = html.replace(/\{\{SLUG\}\}/g, frontmatter.slug || filename.replace('.md', ''));
  html = html.replace(/\{\{DESCRIPTION\}\}/g, (frontmatter.description || '').replace(/"/g, '&quot;'));
  html = html.replace(/\{\{AUTHOR\}\}/g, frontmatter.author || 'SAUFEX');
  html = html.replace(/\{\{DATE\}\}/g, formatDate(frontmatter.date));
  html = html.replace(/\{\{UPDATED\}\}/g, formatDate(frontmatter.updated));
  html = html.replace('{{CONTENT}}', htmlContent);

  // Write output
  const outputFilename = (frontmatter.slug || filename.replace('.md', '')) + '.html';
  const outputPath = path.join(OUTPUT_DIR, outputFilename);
  fs.writeFileSync(outputPath, html, 'utf8');

  return {
    slug: frontmatter.slug || filename.replace('.md', ''),
    title: frontmatter.title || 'Untitled',
    author: frontmatter.author || 'SAUFEX',
    date: frontmatter.date,
    updated: frontmatter.updated,
    description: frontmatter.description || ''
  };
}

function buildBlogList(posts) {
  // Sort posts by date (newest first)
  posts.sort((a, b) => {
    const dateA = new Date(a.updated || a.date || '1970-01-01');
    const dateB = new Date(b.updated || b.date || '1970-01-01');
    return dateB - dateA;
  });

  // Build post list HTML
  const postListHtml = posts.map(post => {
    const excerpt = post.description || '';
    return `
      <li class="post-item">
        <div class="post-meta">${formatDate(post.date)} | By ${post.author}</div>
        <h2><a href="post/${post.slug}.html">${post.title}</a></h2>
        <p class="post-excerpt">${excerpt}</p>
      </li>`;
  }).join('\n');

  // Build the full page
  let html = LIST_TEMPLATE;
  html = html.replace('{{POST_COUNT}}', posts.length.toString());
  html = html.replace('{{POST_LIST}}', postListHtml);

  // Write output
  const outputPath = path.join(SITE_DIR, 'blog.html');
  fs.writeFileSync(outputPath, html, 'utf8');

  console.log(`Built blog listing: ${posts.length} posts`);
}

function main() {
  console.log('Building blog...\n');

  // Get all markdown files (exclude template)
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  console.log(`Found ${files.length} posts\n`);

  const posts = [];
  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const post = buildPost(file);
      posts.push(post);
      successCount++;
      console.log(`Built: ${post.slug}`);
    } catch (error) {
      errorCount++;
      console.error(`Error building ${file}:`, error.message);
    }
  }

  console.log(`\nBuilt ${successCount} posts, ${errorCount} errors`);

  // Build the blog listing page
  buildBlogList(posts);

  console.log('\nDone!');
}

main();
