# New Site TF

## Project Overview

A modern web application built with **Vite** + **React** and deployed on **Vercel**.

## Project Structure

```
├── src/
│   ├── main.tsx          - React entry point
│   ├── App.tsx           - Main component
│   ├── types/            - TypeScript type definitions
│   └── utils/            - Utility functions
├── api/                  - Vercel serverless functions
├── db/                   - Database schema & config
├── index.html            - HTML entry point
├── vite.config.ts        - Vite configuration
├── tsconfig.json         - TypeScript configuration
└── package.json          - Project dependencies
```

## Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

This creates optimized production files in the `dist/` folder.

## Deployment on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"New Project"**
4. Select your GitHub repository
5. Click **"Deploy"**

Vercel will automatically:
- Build your project
- Deploy to production
- Set up a custom domain (if needed)

## API Routes

Serverless functions in the `api/` folder are automatically deployed as API routes:

- `GET /api/hello?name=User` - Example endpoint

## Database

Schema definitions are in the `db/` folder. Configure your database:

1. Add `DATABASE_URL` to `.env`
2. Update schema in `db/schema.ts`
3. Create migrations as needed

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```
VITE_API_URL=http://localhost:3000/api
DATABASE_URL=your_database_url
```

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Hosting**: Vercel
- **Styling**: CSS

## Learn More

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Vercel Documentation](https://vercel.com/docs)

## License

MIT
