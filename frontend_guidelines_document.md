# Frontend Guideline Document

Welcome to the Frontend Guideline Document for our game application built for both Telegram Mini App (TON) and LINE Mini App. This document explains the architecture, design principles, and key technologies used. It is written in easy-to-understand language, making it simple for anyone to get a grasp of our setup.

## Frontend Architecture

Our application uses a modern, modular structure to support growth and new features. Here are the key points:

*   **Framework:** We are using Next.js with its new App Router feature, which enables faster page transitions and better code organization.

*   **Languages & Technologies:**

    *   **Typescript:** To ensure strong typing and fewer bugs.
    *   **Tailwind CSS:** For fast, utility-first styling.
    *   **Shadcn UI:** Provides pre-built UI components that can be reused and adapted.
    *   **Unity WebGL:** Integrates an embedded game experience directly into our web app.

*   **Structure:** The repository follows a clear folder structure:

    *   `/apps/ton-client` for the Telegram Mini App.
    *   `/apps/line-client` for the LINE Mini App.
    *   `/apps/admin` for the unified admin panel.
    *   `/packages/ui` and `/packages/api` contain shared components and business logic.

*   **Scalability and Maintainability:**

    *   Using Next.js makes it easy to manage routes and add new pages.
    *   A clear separation between platform-specific apps and shared components ensures that work on one part doesn’t disturb the others.
    *   The architecture is ready for future additions like NFT trading and AI-powered features.

## Design Principles

We believe that great design comes from following simple principles that anyone can appreciate:

*   **Usability:** Our interfaces are designed to be intuitive, so users can easily engage with quests, game features, and social actions.
*   **Accessibility:** We ensure that our app meets basic accessibility standards, making it easier for everyone to use the game without barriers.
*   **Responsiveness:** Every screen—from mobile phones to desktops—adapts seamlessly. Custom layouts and dynamic sizing keep our app looking good on mid-tier mobile devices and larger screens alike.
*   **Consistency:** All core features (quests, rankings, store, etc.) maintain a consistent experience across TON and LINE, with necessary tweaks for platform-specific needs (like wallet integrations and social features).

These principles are applied from the overall layout right down to interactive elements like buttons and forms.

## Styling and Theming

Visual appearance is a key part of a great user experience. Here’s how we approach styling:

*   **Methodology:**

    *   We use Tailwind CSS for fast, utility-based styling. This makes our styles consistent and simplified across the codebase.
    *   Our components, styled with Tailwind CSS, follow a modern flat design aesthetic mixed with subtle shading effects, blending glassmorphism touches where needed—ideal for game interfaces and vibrant themes.

*   **Theming:**

    *   We handle theming with a centralized Tailwind config, making it simple to apply changes in colors, fonts, and spacing.

    *   **Color Palette:**

        *   Primary: #1E40AF (deep blue) and #3B82F6 (vivid blue).
        *   Secondary: #10B981 (fresh green) and #F59E0B (warm amber).
        *   Background: #F3F4F6 (very light gray) with accents of white (#FFFFFF) and dark mode options (#1F2937).

    *   **Font:**

        *   We use a modern sans-serif font such as Inter for clear readability and a contemporary look.

## Component Structure

Our frontend is built with a component-based architecture, which means:

*   **Organization:**

    *   Components are grouped by functionality and placed in a shared `/packages/ui` directory where they can be reused in the TON, LINE, and admin panels.
    *   Each component is designed to be self-contained, making it easier to maintain and update independently.

*   **Reusability:**

    *   Common user interface elements (like buttons, forms, cards) are created once and shared, reducing duplication and ensuring consistency across the project.
    *   Platform-specific components are kept separate within each client directory to allow for tailored user experiences without impacting shared components.

## State Management

To deliver a smooth and responsive experience for our users, state management is crucial:

*   **Approach:**

    *   We use React’s Context API to manage global state across the app. For more complex interactions, patterns inspired by Redux are employed.
    *   This approach allows seamless sharing of data such as user authentication status, quest progress, and other interactive states between components.

*   **Benefits:** This method enhances performance and ensures that state changes in one part of the app animate smoothly on the interface.

## Routing and Navigation

Navigating through our app is simple thanks to the built-in features in Next.js:

*   **Routing:**

    *   We leverage Next.js’s file-based routing system, which automatically maps files to routes. This makes the navigation structure clear and easy to maintain.

*   **Navigation Structure:**

    *   The navigation bar (or mobile menu) presents clear options based on user roles—whether they are accessing a mini app or the admin panel.
    *   Special routing considerations ensure that platform-specific actions (like Telegram bot commands or LINE official account links) are integrated smoothly.

## Performance Optimization

We understand that performance is key, especially with a game component embedded via Unity WebGL. Here’s what we do to keep things snappy:

*   **Lazy Loading and Code Splitting:**

    *   Components not immediately needed are loaded on-demand to speed up initial load times.
    *   Next.js automatically handles code splitting, ensuring that users only download what they need.

*   **Asset Optimization:**

    *   All assets (images, fonts, scripts) are optimized to reduce load times and improve the overall speed.

*   **Game Optimization:**

    *   The Unity WebGL game is optimized to run at 60fps on mid-tier mobile devices and loads in under 5 seconds using refined asset management and performance monitoring tools.

## Testing and Quality Assurance

To ensure reliability and a bug-free experience, we maintain high standards for testing:

*   **Unit Tests:**

    *   Small, self-contained tests verify individual components or functions work correctly.

*   **Integration Tests:**

    *   These tests ensure that multiple components interact properly.

*   **End-to-End Tests:**

    *   We simulate real user interactions to catch issues that unit tests might miss. Tools like Jest and React Testing Library help automate these tests.

*   **Continuous Integration:**

    *   Our workflow integrates these tests to catch issues early and maintain a stable build.

## Conclusion and Overall Frontend Summary

By following these guidelines, our development team can build a consistent, high-performing, and scalable frontend experience that meets both current and future requirements. Here's what makes our setup unique:

*   A unified architecture that supports two major platforms (Telegram and LINE) while sharing common core features.
*   A clear component-based structure ensuring reusability and ease of maintenance.
*   A design rooted in usability, accessibility, and responsiveness, with modern styling using Tailwind CSS and Shadcn UI.
*   Performance optimizations to support game-level interactions and a smooth user experience even on mobile devices.
*   Robust testing strategies that guarantee the reliability and quality of our user interfaces.

These components work together to create a cohesive frontend environment that not only meets user expectations but also provides a strong foundation for future expansions such as NFT trading and AI-driven features. We are committed to ensuring that every part of the interface is aligned with our overall goal—delivering a fun, engaging, and seamless game experience across multiple platforms.

Thank you for taking the time to read through our Frontend Guideline Document. If you have any questions or need further clarification, please feel free to reach out!
