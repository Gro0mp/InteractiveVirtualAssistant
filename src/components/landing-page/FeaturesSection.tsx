import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Briefcase, FileText, MessageSquare, BarChart3, Mail } from 'lucide-react';

const features = [
  { icon: Mic, title: 'Mock Interviews', description: 'Practice with an AI that simulates real-world scenarios. Get precise feedback on clarity, pacing, and technical depth after every session.', tag: '01' },
  { icon: Briefcase, title: 'Smart Job Matching', description: 'Surface openings tailored to your skills and target role. Updated daily from thousands of verified listings.', tag: '02' },
  { icon: FileText, title: 'Resume Tailoring', description: 'Paste any job description and IVA rewrites your bullets to match — optimised for both ATS scanners and human readers.', tag: '03' },
  { icon: MessageSquare, title: 'Natural Conversation', description: 'Ask anything — salary negotiation tactics, role-specific prep, industry insights — and get concise, expert answers.', tag: '04' },
  { icon: BarChart3, title: 'Progress Analytics', description: 'Track interview scores and skill gaps over time. Clear dashboards show exactly where to focus each session.', tag: '05' },
  { icon: Mail, title: 'Email Drafting', description: 'Generate follow-ups, cover letters, and thank-you notes in seconds — personalised to each role and recruiter.', tag: '06' },
];

export function FeaturesSection() {
  return (
      <section
          id="features"
          aria-labelledby="features-heading"
          className="py-24 bg-neutral-50 dark:bg-[#0A0A0A] relative transition-colors duration-300"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-900" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                  className="text-[10px] font-medium text-blue-600 dark:text-blue-500 uppercase tracking-widest font-mono mb-3"
              >
                Capabilities
              </motion.p>
              <motion.h2
                  id="features-heading"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-white tracking-tight"
                  style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Everything you need to get hired
              </motion.h2>
            </div>
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-sm text-neutral-500 max-w-xs md:text-right leading-relaxed"
            >
              One platform from first application to final round.
            </motion.p>
          </div>

          {/* Grid — border color adapts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-neutral-200 dark:border-neutral-900">
            {features.map((f, index) => {
              const Icon = f.icon;
              return (
                  <motion.article
                      key={f.title}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.06 }}
                      className="group p-7 border-b border-r border-neutral-200 dark:border-neutral-900 bg-transparent hover:bg-white dark:hover:bg-neutral-900/50 transition-colors duration-200 cursor-default"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-9 h-9 border border-neutral-200 dark:border-neutral-800 group-hover:border-blue-400 dark:group-hover:border-blue-500/40 flex items-center justify-center transition-colors duration-200">
                        <Icon className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" aria-hidden />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-300 dark:text-neutral-800 group-hover:text-neutral-400 dark:group-hover:text-neutral-600 transition-colors">{f.tag}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 tracking-tight">{f.title}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-600 leading-relaxed">{f.description}</p>
                  </motion.article>
              );
            })}
          </div>
        </div>
      </section>
  );
}