# dev-track

An Electron application with React and TypeScript for project and task management.

## Project Structure

```text
src/
├── renderer/src/
│   ├── api/                  # API configuration and routes
│   ├── constants/            # Application constants
│   └── features/
│       └── full-screen/      # Main application features
│           ├── components/   # UI components
│           │   └── project/  # Project-related components
│           └── services/     # API services
│               ├── projects/ # Project-related services
│               └── tasks/    # Task-related services
```

## Features

- **Project Management**: Create, view, and manage projects
- **Task Management**: Create tasks associated with projects
- **React Query Integration**: Efficient data fetching and caching
- **TypeScript**: Type-safe code throughout the application

## Recent Changes

- Fixed TypeScript error in ProjectLists component
- Refactored project card rendering into ProjectListItem component
- Added TaskModel component for creating tasks
- Implemented task service with API integration
- Added ability to create tasks directly from project cards

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
# For windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```
