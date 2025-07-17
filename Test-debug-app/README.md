# MERN Bug Tracker Application

A comprehensive bug tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring comprehensive testing and debugging capabilities. The frontend uses **Tailwind CSS** and **shadcn/ui** for a modern, accessible, and beautiful user interface.

## 🚀 Features

- **Bug Management**: Create, read, update, and delete bugs
- **Advanced Filtering**: Filter bugs by status, priority, severity, and search terms
- **Real-time Statistics**: Dashboard with bug statistics and metrics
- **Comments System**: Add comments to bugs for collaboration
- **Status Tracking**: Track bug status through the development lifecycle
- **Modern UI**: Beautiful, responsive design with Tailwind CSS and shadcn/ui
- **Accessibility**: WCAG compliant components with proper ARIA labels
- **Comprehensive Testing**: Unit, integration, and component tests
- **Error Handling**: Robust error boundaries and validation
- **Debugging Tools**: Extensive logging and debugging features

## 🎨 Design System

This application uses:
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Beautiful, accessible, and customizable React components
- **Lucide React**: Beautiful & consistent icon toolkit
- **Radix UI**: Unstyled, accessible UI primitives

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or pnpm package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-bug-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bug-tracker
   ```

4. **Start the application**
   ```bash
   # From the root directory
   npm run dev
   ```
   
   This will start both the backend server (port 5000) and frontend client (port 3000).

## 🧪 Testing

### Backend Testing

The backend includes comprehensive unit and integration tests:

```bash
# Run all server tests
cd server
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Debug tests
npm run test:debug
```

**Test Coverage Requirements:**
- Minimum 70% coverage for all metrics
- Unit tests for models, controllers, and utilities
- Integration tests for API endpoints
- MongoDB Memory Server for isolated testing

### Frontend Testing

The frontend includes React component tests:

```bash
# Run all client tests
cd client
npm test

# Run tests with coverage
npm run test:coverage

# Debug tests
npm run test:debug
```

**Testing Tools Used:**
- Jest for test framework
- React Testing Library for component testing
- Supertest for API testing
- MongoDB Memory Server for database testing
- MSW (Mock Service Worker) for API mocking

## 🐛 Debugging Techniques

### Backend Debugging

1. **Console Logging**
   - Extensive debug logs throughout the application
   - Structured logging with emojis for easy identification
   - Request/response logging for API debugging

2. **Node.js Inspector**
   ```bash
   # Debug server with inspector
   cd server
   npm run test:debug
   ```

3. **Error Handling**
   - Comprehensive error middleware
   - Validation error handling
   - Database connection error handling
   - Graceful shutdown procedures

### Frontend Debugging

1. **Error Boundaries**
   - React Error Boundary component
   - Development mode debug information
   - Graceful error recovery

2. **Chrome DevTools**
   - Network tab for API debugging
   - React DevTools for component inspection
   - Console logging for state changes

3. **React Testing Library**
   - Component behavior testing
   - User interaction simulation
   - Accessibility testing

## 📁 Project Structure

```
mern-bug-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── badge.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   ├── textarea.jsx
│   │   │   │   ├── select.jsx
│   │   │   │   └── alert.jsx
│   │   │   ├── BugList.js
│   │   │   ├── BugForm.js
│   │   │   ├── BugDetail.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Navbar.js
│   │   │   └── ErrorBoundary.js
│   │   ├── lib/            # Utility functions
│   │   │   └── utils.js
│   │   ├── tests/          # Client-side tests
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css       # Tailwind CSS imports
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── postcss.config.js   # PostCSS configuration
│   └── package.json
├── server/                 # Express.js backend
│   ├── config/            # Configuration files
│   │   └── db.js
│   ├── controllers/       # Route controllers
│   │   └── bugController.js
│   ├── middlewares/       # Custom middleware
│   │   └── errorHandler.js
│   ├── models/           # Mongoose models
│   │   └── Bug.js
│   ├── routes/           # API routes
│   │   └── bugRoutes.js
│   ├── tests/            # Server-side tests
│   │   ├── unit/         # Unit tests
│   │   ├── integration/  # Integration tests
│   │   └── setup.js      # Test setup
│   ├── app.js
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Bugs
- `GET /api/bugs` - Get all bugs with filtering and pagination
- `GET /api/bugs/:id` - Get a specific bug
- `POST /api/bugs` - Create a new bug
- `PUT /api/bugs/:id` - Update a bug
- `DELETE /api/bugs/:id` - Delete a bug
- `PATCH /api/bugs/:id/status` - Update bug status
- `POST /api/bugs/:id/comments` - Add comment to bug
- `GET /api/bugs/status/:status` - Get bugs by status
- `GET /api/bugs/stats` - Get bug statistics

### Query Parameters
- `status` - Filter by status (open, in-progress, resolved, closed)
- `priority` - Filter by priority (low, medium, high, critical)
- `severity` - Filter by severity (low, medium, high, critical)
- `search` - Search in title and description
- `sort` - Sort by field (e.g., -createdAt, title, priority)
- `page` - Page number for pagination
- `limit` - Number of items per page

## 🎯 Testing Strategy

### Backend Testing Approach

1. **Unit Tests**
   - Model validation and methods
   - Controller logic
   - Utility functions
   - Middleware functions

2. **Integration Tests**
   - API endpoint testing
   - Database operations
   - Error handling scenarios
   - Authentication flows

3. **Test Coverage Goals**
   - 70% minimum coverage
   - All critical paths tested
   - Error scenarios covered
   - Edge cases handled

### Frontend Testing Approach

1. **Component Tests**
   - Component rendering
   - User interactions
   - State changes
   - Props validation

2. **Integration Tests**
   - API integration
   - Routing
   - Form submissions
   - Error handling

3. **Accessibility Tests**
   - Screen reader compatibility
   - Keyboard navigation
   - Color contrast
   - ARIA labels

## 🚨 Error Handling

### Backend Error Handling
- Express error middleware
- Mongoose validation errors
- Database connection errors
- API validation errors
- Graceful shutdown handling

### Frontend Error Handling
- React Error Boundaries
- API error handling
- Form validation errors
- Network error handling
- User-friendly error messages

## 🔍 Debugging Features

### Backend Debugging
- Structured console logging
- Request/response logging
- Database query logging
- Error stack traces
- Performance monitoring

### Frontend Debugging
- Component state logging
- API call logging
- Error boundary information
- Development mode debugging
- React DevTools integration

## 📊 Performance Considerations

- Database indexing for better query performance
- Pagination for large datasets
- Efficient React rendering with proper keys
- Optimized API responses
- Caching strategies
- Tailwind CSS purging for production builds

## 🔒 Security Features

- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- Express-validator for request validation
- MongoDB injection prevention

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG 2.1 AA compliant components
- **Dark Mode Ready**: CSS variables for easy theme switching
- **Consistent Design**: shadcn/ui component system
- **Smooth Animations**: Tailwind CSS animations and transitions
- **Loading States**: Skeleton loaders and spinners
- **Error States**: Clear error messages and recovery options

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Configure MongoDB connection
3. Set NODE_ENV to production
4. Use PM2 or similar process manager

### Frontend Deployment
1. Build the React application
2. Serve static files
3. Configure API proxy
4. Set up HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the debugging section above
- Review the test files for examples
- Check the console logs for error information
- Use Chrome DevTools for frontend debugging
- Refer to Tailwind CSS and shadcn/ui documentation 