# Tech Stack Document

This document explains the technology choices for our integrated TON & LINE Mini App Game in simple terms. Whether you’re a tech enthusiast or someone looking for a straightforward explanation, we’ll break down every component and why it matters to the project.

## Frontend Technologies

Our frontend is built to deliver a smooth and intuitive experience on both Telegram (TON) and LINE Mini Apps. Here’s what we use:

*   **Next.js**: A modern framework that helps build reactive and scalable web apps, ensuring that pages load quickly and efficiently with the App Router.
*   **Tailwind CSS**: A styling tool that allows us to quickly create beautiful, responsive layouts without a lot of extra code.
*   **Typescript**: A language that adds extra safety to our code, reducing bugs and enhancing collaboration among developers.
*   **Shadcn UI**: A collection of pre-built UI components that supports a consistent and polished look across all platforms.
*   **Unity WebGL**: Used for embedding our game, ensuring that the interactive gaming experience runs smoothly on mobile devices within the mini apps.

These choices help us deliver a unified look and feel, all while catering to the unique needs of both Telegram and LINE platforms. Users get platform-specific guidance (like Telegram group joins or LINE official account additions) in an environment that feels familiar and intuitive.

## Backend Technologies

The backend ties everything together by handling data, security, and core business logic. Our primary components include:

*   **Next.js API Routes**: We use Next.js not just for the frontend but also to manage API endpoints (like /api/quests and /api/store), ensuring smooth communication between the user interface and the server.

*   **Supabase**: Acting as our central database and authentication system, Supabase handles data storage and user management reliably.

*   **Authentication Tools**:

    *   **Telegram OAuth & LINE Login**: These support secure logins directly from each platform, streamlining the user onboarding process.
    *   **Supabase Auth & JWT**: These ensure that once users log in, their sessions are safe and secure, with extra layers of validation in place.

*   **API Endpoints**: Our common API server supports everything from game functionalities to administrative tasks, making sure that data and user actions are securely processed.

Working together, these technologies ensure that the app not only performs well but also maintains high security and reliability across all functions.

## Infrastructure and Deployment

Here’s how we keep the project running smoothly and reliably:

*   **Vercel for Deployment**: Our Next.js application is deployed on Vercel, a platform known for its ease of use, fast performance, and continuous deployment capabilities.
*   **Supabase for Backend Services**: Hosting our database and authentication logic on Supabase ensures stable performance and scalability as our user base grows.
*   **Mono Repo Structure**: All parts of the project—mini apps for TON, LINE and the admin dashboard—are managed in a single repository. This simplifies updates and keeps everything organized.
*   **CI/CD Pipelines**: We set up continuous integration to catch issues early and continuous deployment to get updates out fast, ensuring that new features and fixes reach users quickly and safely.
*   **Version Control**: Our project uses Git for tracking changes and collaborating effectively, ensuring that every modification is monitorable and reversible if needed.

These decisions ensure the project is not only scalable but also maintainable, with a smooth path from development to deployment.

## Third-Party Integrations

To enhance functionality and user engagement, we integrate several third-party services:

*   **Telegram OAuth and Telegram Bot**: These services ensure that Telegram users can seamlessly log in and engage with community features, like joining channels or using bot commands.
*   **LINE Login and LINE Messaging API**: For LINE users, these tools enable smooth authentication and effective communication with the app, such as managing rich menu interactions and official account settings.
*   **Wallet Integration**: Especially tailored for Telegram users, this feature allows secure wallet connections for an enhanced gameplay experience where rewards are digital and verifiable.
*   **Open AI**: Set up for potential future enhancements, such as AI-powered quest generation or gacha systems, ensuring the design remains flexible and extendable.

These integrations allow us to offer tailored experiences on each platform without losing sight of an overall consistent design and function.

## Security and Performance Considerations

Security and speed are key for a great user experience. Here’s how we address them:

*   **Authentication and Authorization**:

    *   Use of **Telegram OAuth, LINE Login, Supabase Auth, and JWT** ensures that only legitimate users can access our app and its features.

*   **Data Protection**:

    *   **Supabase Row Level Security (RLS)** and other lock mechanisms are employed to safeguard user data and prevent unauthorized access.

*   **Performance Optimization**:

    *   Our architecture is designed to run smoothly even on mid-tier mobile devices. The Unity WebGL game is optimized for 60fps and fast loading (under 5 seconds).
    *   Responsive design is ensured by Tailwind CSS and Next.js, adapting the layout seamlessly for various screen sizes.

These measures guarantee that our app remains both secure and fast—crucial for keeping users happy and engaged during gameplay and interaction.

## Conclusion and Overall Tech Stack Summary

In summary, the following key technology choices have been made for the project:

*   **Frontend**: Next.js, Tailwind CSS, Typescript, Shadcn UI, Unity WebGL
*   **Backend**: Next.js API routes, Supabase, robust authentication (Telegram OAuth, LINE Login, JWT)
*   **Infrastructure & Deployment**: Vercel, Mono Repo for cohesive project management, CI/CD pipelines, and Git for version control
*   **Third-Party Integrations**: Telegram Bot, LINE Messaging API, wallet integrations, and potential Open AI enhancements for future features
*   **Security & Performance**: Comprehensive authentication methods, data security via Supabase RLS, and performance optimizations that ensure a smooth mobile gaming experience

These choices are aligned with our goals to support dual-platform functionality (TON and LINE), simplify administration through a unified /admin dashboard, and provide an engaging user experience that is secure, fast, and ready for future enhancements. By combining modern tools with a careful design strategy, our tech stack is both robust and flexible—able to grow with the project while delivering a top-notch interactive gaming experience.

We hope this document has provided a clear picture of our technology choices and how they work together to make the project a success.
