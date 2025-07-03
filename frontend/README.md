# NLP Text Summarizer Frontend

This is the frontend for the NLP Text Summarizer application, built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Input Methods**:
  - Direct text input
  - URL content extraction
  - Sample text for testing

- **Customizable Settings**:
  - Algorithm selection
  - Compression ratio
  - Summary length

- **Summary History**:
  - View and manage previously generated summaries

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Integration with Backend

Ensure the FastAPI backend is running at [http://localhost:8000](http://localhost:8000). The frontend communicates with the backend via API endpoints.

### Styling and Components

This project uses Tailwind CSS for styling and shadcn/ui components for building the UI. Refer to the respective documentation for customization:
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.dev)

### Deployment

To deploy the application, follow the Next.js deployment documentation:
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
