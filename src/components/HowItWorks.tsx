import React from 'react';
import { motion } from 'framer-motion';
const steps = [
{
  number: '1',
  title: 'Sign Up',
  description:
  'Create your free account in under 30 seconds. No credit card required.'
},
{
  number: '2',
  title: 'Connect',
  description:
  'Link your favorite tools and set your personal preferences for IVA.'
},
{
  number: '3',
  title: 'Automate',
  description:
  'Sit back as IVA handles your schedule, emails, and routine tasks.'
}];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
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
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">

            How IVA Works
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
              delay: 0.1
            }}
            className="text-lg text-slate-600">

            Get started in three simple steps
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-slate-200 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) =>
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
                delay: index * 0.2
              }}
              className="flex flex-col items-center text-center relative">

                {/* Connecting Line (Mobile) */}
                {index !== steps.length - 1 &&
              <div className="md:hidden absolute top-16 bottom-[-48px] left-1/2 w-0.5 border-l-2 border-dashed border-slate-200 -z-10" />
              }

                <div className="w-16 h-16 rounded-full bg-white border-4 border-violet-100 flex items-center justify-center mb-6 shadow-sm relative z-10">
                  <span className="text-2xl font-bold text-violet-600">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

}