import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function HeroSection() {
  return (
    <section style={{ padding: '96px 0', borderBottom: '1px solid #E5E7EB', background: '#FAF9F7' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col items-center">
          
          <motion.div variants={fadeUp} className="mb-6">
            <span className="section-label">Interactive Exam & Quiz Platform</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.875rem)',
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              color: '#111827',
              marginBottom: '1.5rem',
              maxWidth: '780px'
            }}
          >
            Quizzes that people enjoy answering.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: '1.125rem',
              color: '#4B5563', /* High-contrast text secondary */
              lineHeight: 1.6,
              maxWidth: '560px',
              marginBottom: '2.5rem'
            }}
          >
            Generate, host, and analyze interactive sessions instantly with AI. Designed to feel human, clean, and entirely frictionless.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link
              to="/create"
              className="btn-primary flex items-center justify-center gap-2"
              style={{
                fontSize: '1rem',
                padding: '10px 22px',
                minWidth: '160px'
              }}
            >
              Host a Quiz <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link
              to="/join"
              className="btn-secondary flex items-center justify-center gap-2"
              style={{
                fontSize: '1rem',
                padding: '10px 22px',
                minWidth: '160px'
              }}
            >
              Join a Room
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
