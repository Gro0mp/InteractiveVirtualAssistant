import React from 'react';
import { Github, Linkedin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
];

const socials = [
  { icon: Globe, href: 'https://dwong.net/', label: 'Website' },
  { icon: Github, href: 'https://github.com/Gro0mp', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/denniswong342', label: 'LinkedIn' },
];

export function Footer() {
  return (
      <footer className="bg-neutral-50 dark:bg-[#0A0A0A] border-t border-neutral-200 dark:border-neutral-900 pt-14 pb-8 transition-colors duration-300" role="contentinfo">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 mb-12">

            {/* Brand */}
            <div className="max-w-xs">
              <Link to="/" className="flex items-center gap-2.5 mb-5 group" aria-label="IVA home">
                <div className="w-6 h-6 border border-neutral-300 dark:border-neutral-800 group-hover:border-blue-500 dark:group-hover:border-blue-500/50 flex items-center justify-center transition-colors duration-150">
                  <img src="/logo.png" alt="" className="scale-[1.6]" aria-hidden />
                </div>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-widest">IVA</span>
              </Link>
              <p className="text-xs text-neutral-500 dark:text-neutral-700 leading-relaxed mb-5 font-mono">
                AI-powered interview prep. Practice smarter, apply faster, land the role you want.
              </p>
              <div className="flex items-center gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                    <a
                        key={label}
                        href={href}
                        aria-label={label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 border border-neutral-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-500/50 flex items-center justify-center text-neutral-400 dark:text-neutral-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-150"
                    >
                      <Icon className="w-3 h-3" aria-hidden />
                    </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-3 gap-10">
              {footerLinks.map(({ heading, links }) => (
                  <div key={heading}>
                    <p className="text-[9px] font-semibold text-neutral-500 dark:text-neutral-600 uppercase tracking-widest font-mono mb-4">{heading}</p>
                    <ul className="space-y-2.5" role="list">
                      {links.map(({ label, href }) => (
                          <li key={label}>
                            <a href={href} className="text-xs text-neutral-500 dark:text-neutral-700 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 font-mono">
                              {label}
                            </a>
                          </li>
                      ))}
                    </ul>
                  </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-800">© 2026 IVA. All rights reserved.</p>
            <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-800">Built for job seekers.</p>
          </div>
        </div>
      </footer>
  );
}