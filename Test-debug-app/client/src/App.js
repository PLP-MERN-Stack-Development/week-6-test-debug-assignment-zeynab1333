import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import BugList from './components/BugList';
import BugForm from './components/BugForm';
import BugDetail from './components/BugDetail';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    console.log('🚀 App component rendered'); // Debug log

    return (
        <ErrorBoundary>
            <Router>
                <div className="min-h-screen bg-background">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/bugs" element={<BugList />} />
                            <Route path="/bugs/new" element={<BugForm />} />
                            <Route path="/bugs/:id" element={<BugDetail />} />
                            <Route path="/bugs/:id/edit" element={<BugForm />} />
                        </Routes>
                    </main>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App; 