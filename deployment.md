# Github Pages Deployment Workflow (deployment.md)

To deploy **BitBite** to GitHub Pages, follow these steps:

## 1. Automated Deployment (GitHub Actions)
Create a file at `.github/workflows/deploy.yml` with the following content. This will automatically deploy your app whenever you push to the `main` branch.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
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

      - name: Deploy
        uses: jamesives/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

## 2. Vite Configuration
Ensure your `vite.config.js` includes the `base` property if you are deploying to a sub-path (e.g., `https://username.github.io/repo-name/`).

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/programming-quiz/', // Change this to your repo name!
})
```

## 3. GitHub Repository Settings
1. Go to your GitHub repository -> **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
3. Select `gh-pages` and folder `/ (root)`.
