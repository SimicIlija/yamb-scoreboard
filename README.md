# Yamb Scoreboard

![Deploy Status](https://github.com/SimicIlija/yamb-scoreboard/actions/workflows/deploy.yml/badge.svg)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions.

### Production URL

The app is deployed at: **https://SimicIlija.github.io/jamb**

### Automatic Deployment Process

When code is merged to the `main` branch:
1. GitHub Actions triggers the build workflow
2. Dependencies are installed and the app is built using `npm run build`
3. The build output is deployed to the `jamb` folder in the [SimicIlija.github.io](https://github.com/SimicIlija/SimicIlija.github.io) repository
4. Changes are automatically committed and pushed

### Required Setup

To enable automatic deployment, you need to configure a Personal Access Token (PAT):

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` scope (full control of private repositories)
3. Copy the token
4. In this repository, go to Settings → Secrets and variables → Actions
5. Create a new repository secret named `GH_PAT` and paste the token

### Manual Deployment

To manually trigger a deployment, push to the `main` branch or re-run the GitHub Actions workflow from the Actions tab.
