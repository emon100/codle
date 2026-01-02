# Github Pages Deployment Workflow (deployment.md)

To deploy **Codle** to GitHub Pages using the **native GitHub Actions** approach (without a separate branch), follow these steps:

## 1. GitHub Actions Workflow
Ensure your file at `.github/workflows/deploy.yml` contains the following. This uses official actions to build and deploy directly.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install and Build
        run: |
          npm install
          npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 2. GitHub Repository Settings
1. Go to your GitHub repository -> **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**. 
   > [!IMPORTANT]
   > This is the critical step to tell GitHub to use the workflow instead of a branch.

## 3. Vite Configuration
Ensure `vite.config.js` has the correct `base` path if your app is hosted at a subfolder (e.g., `/codle/`). For the root of a domain, use `'/'`.

```javascript
export default defineConfig({
  plugins: [react()],
  base: './', // Using relative paths is often the safest for Pages
})
```
