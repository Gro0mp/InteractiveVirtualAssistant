import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorks } from '../components/HowItWorks';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';

export function LandingPage() {

    return (
        <div
            className="min-h-screen bg-white font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
            <Navbar/>
            <main>
                <HeroSection/>
                <FeaturesSection/>
                <HowItWorks/>
                <CTASection/>
            </main>
            <Footer/>
        </div>);
}