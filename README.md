# We Are All One — Minimal Vercel Demo

Drop the files into a repository root. Vercel requires the `api/` folder for the serverless endpoint; everything else lives at root to avoid subfolders.

Deploy steps:
1. Create a new Git repo and add these files.
2. Push to GitHub/GitLab and connect the repo to Vercel OR use `vercel` CLI.
3. Vercel will detect `vercel.json` and deploy the static `index.html` and `api/summary.js` as a serverless function.

Notes: This is a minimal, static-first demo. You can replace the endpoint with more data or add translations, authentication, or other serverless endpoints in `api/`.
