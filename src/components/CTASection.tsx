import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button.tsx';
import { Link } from 'react-router-dom';
export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-cyan-50 -z-10" />

      {/* Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-10 left-10 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">

          Ready to transform your workflow?
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
          className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">

          Join thousands of professionals who trust IVA to handle their daily
          tasks and reclaim their time.
        </motion.p>

        <motion.div
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
            delay: 0.2
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link to="/signup">
            <Button size="lg" className="px-8 w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="px-8 w-full sm:w-auto bg-white/50 backdrop-blur-sm">

            Talk to Sales
          </Button>
        </motion.div>
      </div>
    </section>);

}