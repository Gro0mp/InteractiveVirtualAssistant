import React from 'react';
import { Navbar } from '../components/landing-page/Navbar.tsx';
import { HeroSection } from '../components/landing-page/HeroSection.tsx';
import { FeaturesSection } from '../components/landing-page/FeaturesSection.tsx';
import { HowItWorks } from '../components/landing-page/HowItWorks.tsx';
import { Pricing } from '../components/landing-page/Pricing.tsx';
import { CTASection } from '../components/landing-page/CTASection.tsx';
import { Footer } from '../components/landing-page/Footer.tsx';

export function LandingPage() {
    return (
        <div
            className="min-h-screen bg-white text-neutral-900 dark:bg-[#0A0A0A] dark:text-white selection:bg-blue-600/20 selection:text-blue-700 dark:selection:bg-blue-600/30 dark:selection:text-blue-200 transition-colors duration-300"
            style={{ fontFamily: "'DM Sans', 'system-ui', sans-serif" }}
        >
            <Navbar />
            <main id="main-content">
                <HeroSection />
                <FeaturesSection />
                <HowItWorks />
                <Pricing />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
}