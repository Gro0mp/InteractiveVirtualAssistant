import React from 'react';
import { Navbar } from '../components/landing-page/Navbar.tsx';
import { HeroSection } from '../components/landing-page/HeroSection.tsx';
import { FeaturesSection } from '../components/landing-page/FeaturesSection.tsx';
import { HowItWorks } from '../components/landing-page/HowItWorks.tsx';
import { CTASection } from '../components/landing-page/CTASection.tsx';
import { Footer } from '../components/landing-page/Footer.tsx';
import {Pricing} from "../components/landing-page/Pricing.tsx";

export function LandingPage() {

    return (
        <div
            className="min-h-screen bg-white text-slate-900 selection:bg-violet-100 selection:text-violet-900 font-[Manrope]">
            <Navbar/>
            <main>
                <HeroSection/>
                <FeaturesSection/>
                <HowItWorks/>
                <Pricing/>
                <CTASection/>
            </main>
            <Footer/>
        </div>);
}