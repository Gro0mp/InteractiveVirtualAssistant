import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.tsx';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled || isMobileMenuOpen
                    ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm'
                    : 'bg-transparent'
            }` }
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="relative flex items-center justify-center w-8 h-8">
                            <img src={"/logo.png"} className={"scale-250"}/>
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">
              IVA
            </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a
                            href="#features"
                            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
                        >
                            How it works
                        </a>
                        <a
                            href="#pricing"
                            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
                        >
                            Pricing
                        </a>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-cyan-50 border border-gray-100">
                                    <div className="w-7 h-7 rounded-full bg-cyan-200 flex items-center justify-center">
                                        <User className="w-4 h-4 text-black-700" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-900">
                    {user?.username}
                  </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    leftIcon={<LogOut className="w-4 h-4" />}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="secondary" size="sm">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-600 hover:text-slate-900 p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-4">
                            <a
                                href="#features"
                                className="block py-2 text-base font-medium text-slate-600 hover:text-violet-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className="block py-2 text-base font-medium text-slate-600 hover:text-violet-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                How it works
                            </a>
                            <a
                                href="#"
                                className="block py-2 text-base font-medium text-slate-600 hover:text-violet-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Pricing
                            </a>
                            <a
                                href="#"
                                className="block py-2 text-base font-medium text-slate-600 hover:text-violet-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Blog
                            </a>

                            <div className="pt-4 border-t border-slate-200">
                                {isAuthenticated ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-violet-50 border border-violet-100">
                                            <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center">
                                                <User className="w-5 h-5 text-violet-700" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {user?.username}
                                                </p>
                                                <p className="text-xs text-slate-500">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center"
                                            onClick={handleLogout}
                                            leftIcon={<LogOut className="w-4 h-4" />}
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-3">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Button variant="outline" className="w-full justify-center">
                                                Log In
                                            </Button>
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Button variant="primary" className="w-full justify-center">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}