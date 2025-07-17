import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="bg-slate-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-white text-xl font-bold hover:text-slate-200 transition-colors">
                        🐛 Bug Tracker
                    </Link>

                    <div className="flex space-x-4">
                        <Link to="/">
                            <Button
                                variant={location.pathname === '/' ? 'default' : 'ghost'}
                                className="text-white hover:text-white"
                            >
                                Dashboard
                            </Button>
                        </Link>
                        <Link to="/bugs">
                            <Button
                                variant={location.pathname === '/bugs' ? 'default' : 'ghost'}
                                className="text-white hover:text-white"
                            >
                                All Bugs
                            </Button>
                        </Link>
                        <Link to="/bugs/new">
                            <Button
                                variant={location.pathname === '/bugs/new' ? 'default' : 'ghost'}
                                className="text-white hover:text-white"
                            >
                                Report Bug
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 