# SAUFEX Blog System

## Adding a New Post

1. **Copy the template:**
   ```bash
   cp posts/_template.md posts/90-Your-Post-Title.md
   ```

2. **Edit the frontmatter** at the top of the file:
   ```yaml
   ---
   title: "(90) Your Post Title"
   slug: "90-Your-Post-Title"
   author: "Onno Hansen-Staszyński"
   date: "2025-12-22"
   updated: "2025-12-22"
   description: "Brief description for the blog listing."
   ---
   ```

   - `title`: The display title (include number in parentheses if numbered)
   - `slug`: URL-friendly name (use hyphens, no spaces)
   - `date`: Publication date (YYYY-MM-DD)
   - `updated`: Last modified date
   - `description`: Short excerpt shown on the blog listing page

3. **Write your content** in markdown below the frontmatter.

4. **Build the blog:**
   ```bash
   cd blog
   npm run build
   ```

5. **View the result** at `site/post/90-Your-Post-Title.html`

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Generate HTML from all markdown posts |
| `npm run scrape` | Re-fetch posts from live saufex.eu |

## File Structure

```
blog/
├── posts/           # Markdown source files
│   ├── _template.md # Template for new posts
│   └── *.md         # Blog posts
├── build.js         # Build script
├── template.html    # Post page template
└── list-template.html # Blog listing template

site/
├── blog.html        # Generated blog listing
└── post/            # Generated post HTML files
```

## Markdown Tips

- Use `## Heading` for sections
- Use `**bold**` and `*italic*`
- Link to other posts: `[Title](/post/slug-here)`
- External links: `[Text](https://url.com)`
- Images: `![Alt](https://url.com/image.jpg)`
- Blockquotes: `> Quote text`
