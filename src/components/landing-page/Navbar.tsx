'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    const handleAnchorNav = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Avoid adding an extra history entry for hash navigation.
        // This prevents the "back" button from landing on /#pricing before going back to /login.
        if (!href.startsWith('#')) return;
        e.preventDefault();

        try {
            window.history.replaceState(null, '', href);
        } catch {
            // no-op
        }

        const el = document.querySelector(href);
        if (el instanceof HTMLElement) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav
            role="navigation"
            aria-label="Main navigation"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
                isScrolled || isMobileMenuOpen
                    ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <div className="flex justify-between items-center h-14 md:h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group" aria-label="IVA home">
                        <div className="w-7 h-7 border border-neutral-300 dark:border-neutral-700 group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-colors duration-150 flex items-center justify-center">
                            <img src="/logo.png" alt="" className="scale-[1.8]" aria-hidden />
                        </div>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white tracking-widest uppercase">IVA</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={handleAnchorNav(link.href)}
                                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 tracking-widest uppercase"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop right side: theme toggle + auth */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="w-8 h-8 flex items-center justify-center border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-150"
                        >
                            {mounted ? (
                                <AnimatePresence mode="wait" initial={false}>
                                    {theme === 'dark' ? (
                                        <motion.span
                                            key="sun"
                                            initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                            exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Sun className="w-3.5 h-3.5" />
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="moon"
                                            initial={{ opacity: 0, rotate: 30, scale: 0.8 }}
                                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                            exit={{ opacity: 0, rotate: -30, scale: 0.8 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Moon className="w-3.5 h-3.5" />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            ) : (
                                <div className="w-3.5 h-3.5" /> // Invisible placeholder to keep layout stable
                            )}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                                    <User className="w-3.5 h-3.5" aria-hidden />
                                    <span>{user?.username}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut className="w-3.5 h-3.5" />}>
                                    Sign out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Log in</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="secondary" size="sm">Get started</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile: theme toggle + hamburger */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                            {mounted ? (
                                <AnimatePresence mode="wait" initial={false}>
                                    {theme === 'dark' ? (
                                        <motion.span key="sun" initial={{opacity: 0}} animate={{opacity: 1}}
                                                     exit={{opacity: 0}} transition={{duration: 0.12}}>
                                            <Sun className="w-4 h-4"/>
                                        </motion.span>
                                    ) : (
                                        <motion.span key="moon" initial={{opacity: 0}} animate={{opacity: 1}}
                                                     exit={{opacity: 0}} transition={{duration: 0.12}}>
                                            <Moon className="w-4 h-4"/>
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            ) : (
                                <div className="w-4 h-4"/> // Mobile size placeholder
                            )}
                        </button>
                        <button
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: 'auto'}}
                        exit={{opacity: 0, height: 0}}
                        transition={{duration: 0.18, ease: 'easeOut'}}
                        className="md:hidden bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 overflow-hidden"
                    >
                        <div className="px-5 pt-3 pb-6 space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white tracking-widest uppercase transition-colors"
                                    onClick={(e) => {
                                        handleAnchorNav(link.href)(e);
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="pt-4 mt-1 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <div className="flex items-center gap-2 px-3 py-2 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                                            <User className="w-3.5 h-3.5" />
                                            <span>{user?.username}</span>
                                        </div>
                                        <Button variant="outline" className="w-full justify-center" onClick={handleLogout} leftIcon={<LogOut className="w-3.5 h-3.5" />}>
                                            Sign out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full justify-center">Log in</Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="secondary" className="w-full justify-center">Get started</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}