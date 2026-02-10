import React from 'react';
import { Sparkles, Chromium, Github, Linkedin } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">IVA</span>
            </div>
            <p className="text-slate-600 mb-6 max-w-sm">
              Your intelligent virtual assistant. Automate tasks, manage
              schedules, and streamline your workflow with AI-powered
              intelligence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://dwong.net/"
                className="text-slate-400 hover:text-violet-600 transition-colors">

                <Chromium className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/Gro0mp"
                className="text-slate-400 hover:text-violet-600 transition-colors">

                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/denniswong342"
                className="text-slate-400 hover:text-violet-600 transition-colors">

                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Integrations
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-violet-600 transition-colors">

                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © 2026 IVA. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-violet-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-violet-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-violet-600 transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>);

}