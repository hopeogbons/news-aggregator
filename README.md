# 📰 News Aggregator

A modern, fast, and responsive news aggregation app built with React, Redux, and Material UI. It fetches and displays news content from various sources, extracts keywords, and presents them in a clean and intuitive interface.

---

## 🚀 Features

- 🔍 Keyword extraction using `keyword-extractor`
- 📅 Date-based filtering with `@mui/x-date-pickers`
- ⚛️ State management via Redux Toolkit
- 💅 Styled with Material UI and Emotion
- 📡 Fetches data using Axios
- 🌐 Routing with React Router
- ⚙️ Built with Vite for lightning-fast performance

---

## 🛠️ Tech Stack

| Category         | Library/Tool                            |
| ---------------- | --------------------------------------- |
| Frontend         | React 19, React DOM                     |
| Styling          | Material UI, Emotion, styled-components |
| State Management | Redux Toolkit, React Redux              |
| HTTP Requests    | Axios                                   |
| Routing          | React Router DOM                        |
| Date Handling    | Day.js, MUI Date Pickers                |
| Keyword Parsing  | keyword-extractor                       |
| Dev Tools        | TypeScript, ESLint, Vite                |

---

## 📦 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Development Setup

```bash
# Clone the repo
git clone https://github.com/hopeogbons/news-aggregator.git
cd news-aggregator

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint the Code

```bash
npm run lint
```

---

## 🐳 Docker Support

A production-ready Docker image is available via Docker Hub.

### Pull the Image

```bash
docker pull hopeogbons/news-aggregator
```

### Run the Container

```bash
docker run -p 5173:80 hopeogbons/news-aggregator
```

> **_Make sure port 5173 is available or update it as needed_**

---

## 📁 Project Structure (Overview)

```
news-aggregator/
├── public/
├── src/
│ ├── assests/
│ ├── components/
│ │ ├── decorators/
│ │ ├── form
│ │ ├── hooks
│ │ ├── layouts
│ │ └── pages
│ ├── redux/
│ ├── styles/
│ ├── thirdPartyAPI/news/
│ ├── utils/
│ ├── App.tsx
│ └── main.tsx
├── .dockerignore
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── index.html
├── nginx.conf
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## ✅ Production Ready

- 🔐 Uses modular architecture and modern best practices
- 🧪 ESLint integration for consistent code quality
- 📦 Lightweight, fast, and scalable
- 🐳 Dockerized for easy deployment

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 🙌 Contributing

Pull requests are welcome! If you find any bugs or have feature suggestions, feel free to open an issue or contribute directly.
