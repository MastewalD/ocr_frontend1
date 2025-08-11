#  Receipt Scanner

A **Next.js (App Router)** + **TypeScript** application for scanning receipts, extracting text, and displaying the details using a **GraphQL OCR API**.  

 
##  Features

-   **Instant Text Extraction:** Upload a receipt image and get structured data in seconds.
-   **User Authentication:** Secure login and registration system to protect user data.
-   **Receipt Management:** View a paginated list of all your past receipts.
-   **Detailed View:** Click on any receipt to see a detailed breakdown of items.
-   **Responsive Design:** A clean, modern UI that works beautifully on desktop and mobile devices.
-   **Category Filtering:** Easily filter and sort receipts by category.

##  Tech Stack

This project is built with a modern, type-safe, and efficient technology stack:

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **GraphQL Client:** [Apollo Client](https://www.apollographql.com/docs/react/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Linting/Formatting:** ESLint & Prettier

##  Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
-   `npm` or your preferred package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MastewalD/ocr_frontend1.git
    cd receipt-scanner
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##  Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Creates a production-ready build of the application.
-   `npm run start`: Starts the production server (requires a build first).
-   `npm run lint`: Runs ESLint to check for code quality issues.
