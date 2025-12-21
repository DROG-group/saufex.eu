# SAUFEX.eu

SAUFEX (Secure Automated Unified Framework for Exchange) is an EU-funded collaborative initiative designed to combat foreign information manipulation and interference (FIMI).

## Live Site

**https://drog-group.github.io/saufex.eu/**

## Project Structure

```
saufex/
├── blog/                    # Blog build system
│   ├── posts/               # Markdown source files
│   │   ├── _template.md     # Template for new posts
│   │   └── *.md             # Blog posts
│   ├── build.js             # Build script
│   ├── template.html        # Post page template
│   └── list-template.html   # Blog listing template
├── site/                    # Static site (generated + assets)
│   ├── blog.html            # Blog listing page
│   ├── post/                # Generated blog posts
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript
│   ├── images/              # Images
│   └── *.html               # Other pages
└── .github/workflows/       # GitHub Actions
    └── pages.yml            # Auto-deploy to GitHub Pages
```

## Adding a New Blog Post

1. Copy the template:
   ```bash
   cp blog/posts/_template.md blog/posts/90-Your-Title.md
   ```

2. Edit the frontmatter:
   ```yaml
   ---
   title: "(90) Your Title"
   slug: "90-Your-Title"
   author: "Your Name"
   date: "2025-12-22"
   updated: "2025-12-22"
   description: "Brief description for listing."
   ---
   ```

3. Write your content in Markdown

4. Commit and push:
   ```bash
   git add blog/posts/
   git commit -m "Add new blog post"
   git push
   ```

The site will automatically rebuild and deploy via GitHub Actions.

## Local Development

```bash
# Install dependencies
cd blog
npm install

# Build the blog
npm run build

# View the site
open ../site/index.html
```

## Deployment

The site automatically deploys to GitHub Pages when you push to `main`. The workflow:

1. Installs Node.js dependencies
2. Builds blog posts from Markdown to HTML
3. Deploys the `site/` folder to GitHub Pages

## License

Content is licensed under [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/).

---

Funded by the European Union.
