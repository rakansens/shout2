# Implementation plan

## Phase 1: Environment Setup

1.  Create the monorepo directory structure with the following folders: `/apps/ton-client`, `/apps/line-client`, `/apps/admin`, `/packages/ui`, `/packages/api`, and `/config`. (**Tech Stack: Repository**)
2.  Install Node.js v20.2.1. **Validation**: Run `node -v` to ensure the version is correct. (**Tech Stack: Core Tools**)
3.  In each app directory (`/apps/ton-client`, `/apps/line-client`, `/apps/admin`), initialize a Next.js project using Next.js 14 (explicitly install Next.js 14 since it works best with current LLM tools). **Validation**: Check `package.json` for Next.js version 14. (**Tech Stack: Frontend**)
4.  Configure TypeScript in each Next.js project (by renaming files to `.tsx` and adding a `tsconfig.json`). **Validation**: Run `npm run build` to verify TypeScript compilation. (**Tech Stack: Frontend**)
5.  Install and configure Tailwind CSS in each project. Create a `tailwind.config.js` in each app and add the required presets. **Validation**: Confirm Tailwind classes render correctly in the browser. (**Tech Stack: Frontend**)
6.  Install Shadcn UI in the projects and set up the common UI theme. **Validation**: Render a Shadcn UI component on a test page. (**Tech Stack: Frontend**)
7.  Set up environment variable configuration by creating a `.env.local` template in the `/config` folder with placeholders for Supabase keys, OAuth credentials, and JWT secrets. **Validation**: Ensure apps read from `/config/.env.local` at runtime. (**Tech Stack: Config & Security**)

## Phase 2: Frontend Development

1.  In `/apps/ton-client`, build the home page at `/apps/ton-client/src/app/page.tsx` that performs platform detection and displays a login/authentication prompt (Telegram OAuth for TON). **Validation**: Run the app locally and simulate platform detection. (**Project Overview: User Flow Highlights**)
2.  In `/apps/line-client`, similarly build a home page at `/apps/line-client/src/app/page.tsx` optimized for LINE Mini App with LINE Login prompt. **Validation**: Test the authentication interface locally. (**Project Overview: User Flow Highlights**)
3.  In both client apps, implement a global navigation menu (Home, Ranking, Play, Store, Settings) in the layout file at `src/app/layout.tsx`. **Validation**: Ensure routing between pages works seamlessly. (**Project Overview: User Flow Highlights**)
4.  In `/packages/ui`, create common UI components like `Navigation.tsx`, `Button.tsx`, `QuestCard.tsx`, etc. **Validation**: Import and render these components in the client apps to confirm style and behavior. (**Tech Stack: UI Library**)
5.  Develop the Play page in both `/apps/ton-client/src/app/play/page.tsx` and `/apps/line-client/src/app/play/page.tsx` to embed the Unity WebGL game via an `<iframe>` or similar integration. **Validation**: Verify the game loads under 5 seconds and is capable of 60fps on mid-tier mobile devices using browser performance tools. (**Project Overview: Key Features, Game Performance Requirements**)
6.  Create pages for Ranking, Store, and Settings in both client apps with basic UI placeholders. **Validation**: Navigate to each page ensuring routing works. (**Project Overview: User Flow Highlights**)

## Phase 3: Backend Development

1.  In `/packages/api`, set up Next.js API routes for authentication. Create `auth.ts` to handle Telegram OAuth and LINE Login integration via Supabase Auth. **Validation**: Test the API endpoint using Postman to verify correct OAuth callback responses. (**Core Requirements: Authentication**)
2.  Implement JWT issuance in the authentication API after successful OAuth and Supabase Auth verification. **Validation**: Verify the JWT is correctly generated and returned. (**Core Requirements: Authentication**)
3.  Create API endpoints for quest management (create, read, update, delete) in `/packages/api/quests.ts`. **Validation**: Use curl or Postman to test CRUD operations. (**Admin Panel Functionality: Quest Management**)
4.  Create API endpoints for ranking management in `/packages/api/ranking.ts`. **Validation**: Simulate updates and retrievals from the endpoint. (**Admin Panel Functionality: Ranking Management**)
5.  Develop API endpoints for store and user management in `/packages/api/store.ts` and `/packages/api/users.ts`. **Validation**: Test endpoints to ensure items and user data are correctly handled. (**Admin Panel Functionality: Store & User Management**)
6.  Integrate Supabase by configuring a connection file in `/config/supabase.ts` that loads environment variables and connects to Supabase (for database and authentication). **Validation**: Test the connection by querying a simple table in Supabase. (**Tech Stack: Backend, Config**)
7.  Add a wallet integration endpoint for TON in `/packages/api/wallet.ts` to support wallet actions (for TON only, as it is encouraged on the platform). **Validation**: Ensure endpoint responds and conditionally enable for TON clients. (**Core Requirements: Wallet Integration**)
8.  Secure all backend API endpoints with Supabase Row Level Security (RLS) and lock mechanisms. **Validation**: Attempt unauthorized requests to ensure access is blocked. (**Core Requirements: Security**)

## Phase 4: Integration

1.  In both client apps, integrate API calls using `fetch` or `axios` to connect to the backend endpoints set up in `/packages/api`. **Validation**: Simulate login and quest retrieval to confirm API communication. (**User Flow Highlights: Authentication and Quest Data**)
2.  Implement error handling and JWT storage in client-side code. For example, store JWT in secure cookies and use middleware for route protection. **Validation**: Confirm JWT presence and authenticated routing. (**Core Requirements: Authentication**)
3.  In the admin panel (`/apps/admin`), develop a tab-switch component to toggle between TON and LINE data views. Place the toggle logic in `/apps/admin/src/components/PlatformTabs.tsx`. **Validation**: Switch tabs and verify that the correct platform-specific data is loaded via API calls. (**Admin Panel Functionality: Data Management**)
4.  Ensure common UI components from `/packages/ui` are fully integrated into each client app and the admin panel. **Validation**: Confirm consistent design across platforms by reviewing rendered pages. (**Project Overview: UI Consistency**)

## Phase 5: Deployment

1.  Configure the Vercel deployment for the monorepo. In the Vercel project settings, specify each app’s root directory (e.g., `/apps/ton-client`, `/apps/line-client`, `/apps/admin`). **Validation**: Verify Vercel detects and builds each app correctly. (**Tech Stack: Deployment**)

2.  Add necessary environment variables to Vercel using the configuration defined in the `/config` folder. **Validation**: Check that the deployed apps can access Supabase and OAuth credentials correctly. (**Tech Stack: Config**)

3.  Deploy the application to Vercel and run end-to-end tests to verify that:

    *   Telegram Mini App (TON) and LINE Mini App (LINE) load correctly.
    *   API endpoints for authentication, quests, ranking, and wallet operate as expected.
    *   The Unity WebGL game performs under 5 seconds load while maintaining 60fps on mobile. **Validation**: Use browser testing and performance monitoring on the deployed URLs. (**Project Overview: Deployment & Performance**)

4.  Post-deployment, test the Security configuration (Supabase RLS and API access) by attempting unauthorized actions. **Validation**: Confirm that access controls are enforced in production. (**Core Requirements: Security**)

This step-by-step plan establishes the development, integration, and deployment of the TON & LINE Mini App game with unified authentication, admin management, and embedded Unity WebGL gameplay while ensuring extensibility and security compliance.
