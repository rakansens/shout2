# Project Requirements Document (PRD)

## 1. Project Overview

This project is about building a game application that works on both the TON (Telegram Mini App) and LINE Mini App platforms. The game is designed to offer engaging, quest-based gameplay where users complete tasks, earn points, and redeem rewards through a unified user interface. The frontend is customized for each platform while using a common backend powered by Next.js, a Supabase database, and integrated authentication methods (Telegram OAuth and LINE Login plus Supabase Auth with JWT). In addition, the application features an embedded Unity WebGL game for in-app gameplay and a single, unified admin panel (/admin) that lets administrators efficiently switch between TON and LINE contexts.

The purpose behind this project is to combine the best of both worlds—leveraging the broad reach of messaging apps like Telegram and LINE while providing a fun, gamified experience enriched with digital rewards and advanced features like wallet connection and real-time analytics. The key objectives include delivering a seamless cross-platform user experience, ensuring secure authentication and data handling, and building a scalable system that accommodates future enhancements like NFT trading and AI-powered gameplay elements.

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**

*   Development of two separate Mini App frontends: one for TON (Telegram) and one for LINE, with optimized UIs for each platform.
*   A unified backend API built on Next.js (App Router) and Supabase for database management and authentication.
*   Support for both Telegram OAuth and LINE Login with Supabase Auth + JWT.
*   Integration of wallet connection functionality, with TON having a more robust feature and LINE offering it optionally.
*   Embedding a Unity WebGL game that runs within the webviews of TON and LINE apps.
*   A unified admin panel (accessible via /admin) that includes tabs to switch between TON and LINE management for quests, user data, store items, and analytics.
*   Core game features such as quest management, daily login bonus, rankings, social actions (Twitter follow, RT, RP), and a point-based store.
*   Repository structure using a Mono Repo approach with separate directories for ton-client, line-client, and admin.
*   Basic security measures including Supabase Row Level Security and API rate control.

**Out-of-Scope:**

*   Implementation of real-money transactions or in-app purchases in v1; the store will solely use point-based transactions.
*   Advanced user roles beyond basic User and Admin (e.g., moderators) in the current version.
*   NFT-based item trading functionality (planned as a future extension for TON only).
*   AI-generated quest content or AI-powered gacha mechanics; the system should be extensible to add these later.
*   Comprehensive offline caching is optional and may not be fully implemented in v1.
*   Multi-language support (beyond the core languages) is considered for future releases.

## 3. User Flow

When a user opens the Mini App, the system immediately identifies whether they are on Telegram (TON) or LINE. The user is then guided through an authentication process where they sign in using either Telegram OAuth or LINE Login, supported by Supabase Auth with JWT. For TON users, the system strongly prompts for wallet connection, while LINE users see an optional wallet prompt depending on quest requirements. After successful login, the user’s session is initialized and they are automatically redirected to the main interface.

On the main interface, the home screen displays available quests paired with daily login bonuses in a clear, dynamic layout. Depending on the platform, users might see a prompt to join a Telegram group or add a LINE official account, ensuring that they interact with the platform-specific features. The navigation menu is always visible, offering easy transitions to sections like Rankings, Play (game launch), Store, and Settings. Administrators can later log in via a dedicated /admin path that uses a simple tab-switch mechanism to manage data for both TON and LINE users.

## 4. Core Features

*   **Authentication & User Onboarding:**\
    • Integration with Telegram OAuth and LINE Login.\
    • Use of Supabase Auth and JWT for secure session management.\
    • Platform-specific wallet connection prompts (mandatory for TON, optional for LINE).
*   **Home Screen & Quest Management:**\
    • Display of a dynamic list of quests with daily login bonuses.\
    • Platform-specific quest actions (e.g., joining a Telegram group for TON, adding LINE official account for LINE).\
    • Management of daily login streaks and rewards.
*   **Game Launch & Embedded Gameplay:**\
    • A dedicated “Play” section that allows users to select musical tracks.\
    • Embedding of a Unity WebGL game designed to run at 60fps on mid-tier mobile devices.\
    • Quick loading times (target under 5 seconds) and responsiveness for full-screen mobile view.
*   **Ranking & Social Integration:**\
    • Display of leaderboards based on quest points.\
    • Show user details such as username (Telegram/LINE name), wallet address, and cumulative points.
*   **Store & Reward Redemption:**\
    • A point-based store where users spend earned points.\
    • Items include quest reward boosters, game score enhancers, and daily bonus items.\
    • Real-time point balance and item purchase updates.
*   **Settings & Profile Customization:**\
    • Options for notification settings, wallet linkage, and account connections.\
    • UI adapts based on platform-specific requirements.
*   **Admin Panel (/admin):**\
    • Unified management dashboard with a tab switch to alternate between TON and LINE data.\
    • Interfaces for managing quests, rankings, store items, user data, and analyzing key metrics (daily active users, quest completion rates, etc.).\
    • Future extensible modules for NFT trading and AI integration hooks.

## 5. Tech Stack & Tools

*   **Frontend Framework & Languages:**\
    • Next.js (using App Router) for building the application structure and handling routing.\
    • Tailwind CSS for styling, ensuring a responsive and modern UI.\
    • Typescript for type-safe coding practices.
*   **Backend & Database:**\
    • Next.js for backend API endpoints.\
    • Supabase for database management, authentication, and security measures.
*   **Authentication & Security:**\
    • Telegram OAuth and LINE Login for platform-specific authentication.\
    • Supabase Auth integrated with JWT for session management and security.
*   **Game Integration:**\
    • Unity WebGL for the embedded game environment, ensuring mobile compatibility and performance optimization.
*   **Design & UI Libraries:**\
    • Shadcn UI components for a consistent design language across platforms. • Common UI components shared between the TON and LINE client, maintained via a central package.
*   **Developer Tools & IDE Integrations:**\
    • Cursor for an advanced IDE experience with real-time AI-powered coding suggestions. • Claude 3.7 Sonnet for hybrid reasoning while integrating or debugging complex functionalities.

## 6. Non-Functional Requirements

*   **Performance:**\
    • The Unity WebGL game must run at 60fps on mid-tier mobile devices.\
    • Page loads and transitions should be under 5 seconds to ensure immediate user engagement.
*   **Security:**\
    • Implement robust authentication using Telegram OAuth and LINE Login alongside Supabase Auth with JWT.\
    • Enforce Supabase Row Level Security (RLS) and proper locking mechanisms to prevent unauthorized data access.
*   **Usability:**\
    • Mobile-first design ensuring full responsiveness on various screen sizes.\
    • Intuitive navigation and clear platform-specific cues to minimize user confusion.
*   **Reliability & Scalability:**\
    • A unified backend design to support simultaneous operations for both platforms.\
    • Modular architecture with hooks for future expansion (e.g., NFT trading and AI-powered features).
*   **Compliance:**\
    • Adherence to the Mini App rules for both Telegram and LINE, including point-based store operations and no real-money transactions in v1.

## 7. Constraints & Assumptions

*   The project assumes availability and stable performance of Telegram OAuth, LINE Login, and Supabase’s services.
*   Wallet integration is a required feature for TON users but remains optional for LINE users, which means UI logic must dynamically detect and adjust per platform.
*   The admin panel will use tab-switching to alternate between TON and LINE contexts; more detailed role-based views are not included in v1.
*   The application must run within the WebView constraints of both messaging platforms, meaning performance optimization is critical.
*   Future features like NFT trading and AI-generated quests will rely on modern modular architecture; hooks and extensible modules must be built into the current system.
*   The current tech stack and design principles must support scalability, expecting increased user loads and potential platform expansions in the future.

## 8. Known Issues & Potential Pitfalls

*   **API Rate Limits & Performance Bottlenecks:**\
    • The backend may face API rate limits under high usage periods, especially since both platforms share the same API endpoints.\
    • Mitigation: Implement efficient caching strategies and load balancing along with rate limit handling at the API level.
*   **Authentication Dependencies:**\
    • Challenges can emerge from any changes in Telegram or LINE’s authentication APIs.\
    • Mitigation: Regularly update the integration modules and maintain fallback mechanisms in case of service disruptions.
*   **Cross-Platform UI Consistency:**\
    • Though the UI is unified across platforms, ensuring platform-specific features do not interfere with user experience may prove challenging.\
    • Mitigation: Thorough testing on both WebViews (Telegram and LINE) and having clear conditional rendering logic based on the detected platform.
*   **Unity WebGL Integration:**\
    • Ensuring consistent performance (60fps) on various mobile devices might be challenging.\
    • Mitigation: Optimize the Unity game build and perform stringent testing for load time and responsiveness on a range of devices.
*   **Extensibility for Future Modules:**\
    • Future features like NFT trading and AI-powered functionalities need to be integrated without major restructuring.\
    • Mitigation: Build modular, well-documented hooks and maintain clean separation of concerns within business logic and data models.

This PRD serves as the foundational document for understanding the scope, design, and architecture of the TON & LINE Mini App game. It provides comprehensive details to ensure subsequent technical documents can be generated without ambiguity, paving the way for a smooth development and deployment process.
