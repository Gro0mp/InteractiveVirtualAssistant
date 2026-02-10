import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Mail,
  Zap,
  MessageSquare,
  BarChart3,
  Blocks } from
'lucide-react';
const features = [
{
  icon: <Calendar className="w-6 h-6 text-violet-600" />,
  title: 'Smart Scheduling',
  description:
  'Automatically manage your calendar, set reminders, and never miss a meeting again.'
},
{
  icon: <Mail className="w-6 h-6 text-violet-600" />,
  title: 'Email Management',
  description:
  'Draft, sort, and prioritize emails with intelligent categorization and quick replies.'
},
{
  icon: <Zap className="w-6 h-6 text-violet-600" />,
  title: 'Task Automation',
  description:
  'Create automated workflows that handle repetitive tasks effortlessly and reliably.'
},
{
  icon: <MessageSquare className="w-6 h-6 text-violet-600" />,
  title: 'Natural Language',
  description:
  'Communicate naturally. IVA understands context, intent, and nuance in every request.'
},
{
  icon: <BarChart3 className="w-6 h-6 text-violet-600" />,
  title: 'Data Insights',
  description:
  'Get actionable insights from your data with smart analytics and visualization tools.'
},
{
  icon: <Blocks className="w-6 h-6 text-violet-600" />,
  title: 'Integrations',
  description:
  'Connect with 200+ tools you already use every day like Slack, Notion, and Gmail.'
}];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 bg-slate-50 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5
            }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">

            Everything you need
          </motion.h2>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: 0.1
            }}
            className="text-lg text-slate-600">

            Powerful features to supercharge your productivity and reclaim your
            time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) =>
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.1
            }}
            className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 group">

              <div className="w-12 h-12 rounded-lg bg-violet-50 flex items-center justify-center mb-6 group-hover:bg-violet-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}