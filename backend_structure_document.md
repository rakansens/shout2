# Backend Structure Document

This document describes the backend setup for our game application that caters to both Telegram Mini App (TON) and LINE Mini App. The document is written with everyday language so that everyone, even those without technical backgrounds, can understand how the backend works.

## 1. Backend Architecture

Our backend has been designed with a clear focus on simplicity, scalability, and maintainability. Here’s an overview:

*   **Mono Repo Structure**: We use a mono repository which houses all parts of the application, including:

    *   *TON Client App*
    *   *LINE Client App*
    *   *Admin Panel*
    *   *Common UI Components*
    *   *API Routes & Business Logic*
    *   *Configuration files for Supabase and environment variables*

*   **Design Patterns and Frameworks**:

    *   *Next.js API routes* are used to build the backend, providing a clean separation between the frontend and backend code.
    *   Business logic is centralized in shared packages, making it easier to maintain and extend.
    *   A unified admin panel allows for simple management of quests, ranking, store items, user data, and analytics.

*   **Scalability & Performance**:

    *   The separation into multiple directories allows scaled development and easier team collaboration.
    *   Using modern frameworks like Next.js and Supabase ensures that our app can handle growth in both user numbers and features.
    *   The architecture supports adding more future integrations like NFT trading or AI-powered gacha systems with minimal rework.

## 2. Database Management

Our database infrastructure centers on Supabase, which provides a managed PostgreSQL database along with authentication features. Key points include:

*   **Technologies Used**:

    *   **Supabase Database (PostgreSQL)**: This is our primary database for storing user data, game progress, quests, leaderboards, and store items.
    *   **Supabase Auth**: Handles user authentication with built-in solutions like support for Telegram OAuth, LINE Login, and JWT session management.

*   **Data Organization and Access**:

    *   Data is organized in relational tables, with relationships defined between users, quests, game sessions, and store items.
    *   Row Level Security (RLS) is enforced to ensure that data is only accessible to authorized users.
    *   Regular backups and performance optimizations ensure the database remains reliable and efficient.

## 3. Database Schema

### Human Readable Explanation

The database comprises several tables which include, but are not limited to:

*   **Users**: Stores user information including authentication details, wallet connections, and profile data.
*   **Quests**: Contains data on daily and periodic quests, including descriptions, points awarded, and platform-specific actions.
*   **GameSessions**: Tracks game play session data including embedded Unity WebGL game performance, track selection, and session durations.
*   **Leaderboards**: Aggregates points from quests and gameplay to display top user rankings.
*   **StoreItems**: Lists items available in the point-based store, such as quest boosters and score enhancers.
*   **AdminLogs**: For maintaining records of administrative actions and changes in the system.

### Example SQL Schema (PostgreSQL)

Below is a simple example in SQL format which outlines the major tables:

## -- TABLE: Users

CREATE TABLE Users ( id SERIAL PRIMARY KEY, telegram_id VARCHAR(50), line_id VARCHAR(50), email VARCHAR(100) UNIQUE, wallet_address VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

## -- TABLE: Quests

CREATE TABLE Quests ( id SERIAL PRIMARY KEY, title VARCHAR(255), description TEXT, platform VARCHAR(50), -- E.g., 'Telegram', 'LINE' points INT, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

## -- TABLE: GameSessions

CREATE TABLE GameSessions ( id SERIAL PRIMARY KEY, user_id INT REFERENCES Users(id), track_selected VARCHAR(255), duration INT, -- in seconds score INT, session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

## -- TABLE: Leaderboards

CREATE TABLE Leaderboards ( id SERIAL PRIMARY KEY, user_id INT REFERENCES Users(id), total_points INT, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

## -- TABLE: StoreItems

CREATE TABLE StoreItems ( id SERIAL PRIMARY KEY, item_name VARCHAR(255), description TEXT, cost INT, available BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

## -- TABLE: AdminLogs

CREATE TABLE AdminLogs ( id SERIAL PRIMARY KEY, admin_id INT, action TEXT, performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

## 4. API Design and Endpoints

Our backend APIs are designed to facilitate smooth communication between the frontend and backend. They make use of RESTful routes defined within Next.js API routes. Key aspects include:

*   **API Design**:

    *   RESTful design for clear and predictable endpoints.
    *   Centralized endpoints under a shared codebase in the `/packages/api` directory.
    *   Middleware ensures authentication (using Supabase Auth and JWT) and rate limiting.

*   **Key Endpoints**:

    *   **Authentication Endpoints**:

        *   Initiate login for Telegram and LINE using OAuth flows.
        *   Validate JWT tokens and establish sessions.

    *   **User Management Endpoints**:

        *   User registration, profile updates, and wallet linkages.

    *   **Quest Management Endpoints**:

        *   Fetch daily quests and quest details based on the platform (Telegram/LINE).
        *   Record quest completions to credit points.

    *   **Game Session Endpoints**:

        *   Start and record gameplay sessions.
        *   Send data to update leaderboards.

    *   **Store & Purchase Endpoints**:

        *   Retrieve store items.
        *   Process point-based purchases for boosters and score enhancers.

    *   **Admin Panel Endpoints**:

        *   Manage quests, user data, leaderboards, store items, and view analytics via simple tab-switching for TON/LINE.

## 5. Hosting Solutions

Our hosting approach is designed to ensure the backend is reliable, scalable, and cost-effective.

*   **Hosting Environment**:

    *   **Vercel** is used for deploying our Next.js applications including the API routes. Benefits include:

        *   **Reliability**: Vercel’s global CDN ensures fast response times around the world.
        *   **Scalability**: Automatically scales with traffic demands.
        *   **Cost-Effectiveness**: Efficient deployment with built-in monitoring and performance optimizations.

    *   **Supabase** handles hosting for the database and authentication services, providing a robust and secure solution.

## 6. Infrastructure Components

The backend infrastructure is made up of several key components that work together to improve performance and user experience:

*   **Load Balancers**: Integrated with Vercel to distribute incoming traffic and ensure the application remains responsive under high load.

*   **Caching Mechanisms**: Used in API routes to store frequently accessed data, reducing response times for repeat requests.

*   **Content Delivery Networks (CDNs)**: Vercel’s built-in CDN caches static assets and content to ensure quick load times worldwide.

*   **Supabase Components**:

    *   Provides managed backups, real-time subscriptions, and serverless functions when needed.
    *   Ensures secure and optimized data access.

## 7. Security Measures

Our security setup is comprehensive, leveraging both Supabase and built-in Next.js features:

*   **Authentication & Authorization**:

    *   **Supabase Row Level Security (RLS)**: Enforces strict access controls directly at the database level.
    *   **JWT**: Utilized for maintaining secure user sessions.
    *   **Third-Party OAuth**: Integration with Telegram OAuth and LINE Login ensures secure and streamlined authentication.

*   **Additional Security Practices**:

    *   **API Rate Limiting**: Prevents abuse and ensures fair usage of resources.
    *   **Encryption**: Data transmitted between the client and backend is encrypted using HTTPS.
    *   **Regular Security Audits**: Periodic checks and updates to libraries and dependencies to maintain security best practices.

## 8. Monitoring and Maintenance

To ensure the backend remains healthy and performs optimally, the following tools and practices are in place:

*   **Monitoring Tools**:

    *   *Vercel Analytics*: Monitors performance, response times, and error logs for all API routes.
    *   *Supabase Dashboard*: Provides insights into database performance and query load.
    *   Additional third-party monitoring services may also be integrated as needed.

*   **Maintenance Strategies**:

    *   **Regular Updates**: Updating dependencies, frameworks, and database designs to stay current with evolving needs.
    *   **Performance Reviews**: Scheduled reviews to analyze and address any performance bottlenecks.
    *   **Backups and Recovery Plans**: Automated backups via Supabase ensure data safety and quick recovery in case of failures.

## 9. Conclusion and Overall Backend Summary

To sum up, the backend of our game application is built with clarity and efficiency in mind. Here are the key takeaways:

*   A **Mono Repo architecture** using Next.js API routes ensures maintainability and scalability.
*   **Supabase** provides our managed PostgreSQL database along with robust authentication (with **Telegram OAuth**, **LINE Login**, and **JWT**), secured by features like **Row Level Security (RLS)**.
*   APIs are built on a RESTful architecture that handles all major functions from user management to gameplay sessions, ensuring smooth frontend-backend communication.
*   **Vercel** and **Supabase** work together to provide a hosting environment that is both scalable and reliable.
*   Additional infrastructure components such as load balancers, caching, and CDNs enhance performance and user experience.
*   Comprehensive security measures and proactive monitoring ensure that the backend remains secure and reliable.

This backend setup meets the project’s goals of supporting quest-based gameplay, a point-based reward system, and a seamless user experience across multiple platforms. The approach is designed not only to address current requirements but also to allow for future enhancements like NFT trading and AI-powered game features.

By following this structure, the project is set up for stable, secure, and efficient operations, and will spark trust among users while being flexible enough to evolve with new requirements.
