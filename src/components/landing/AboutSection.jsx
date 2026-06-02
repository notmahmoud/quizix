import { motion } from 'framer-motion';
import { Zap, BarChart2, Globe, Brain } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const highlights = [
  {
    icon: Brain,
    label: 'AI Question Generation',
    desc: 'Generate a full quiz from any topic in seconds — no manual writing required.',
  },
  {
    icon: Zap,
    label: 'Real-Time Sessions',
    desc: 'Students and hosts are always in sync. Every answer, every status, live.',
  },
  {
    icon: BarChart2,
    label: 'Instant Analytics',
    desc: 'Scores, topic breakdowns, and student reviews the moment a quiz ends.',
  },
  {
    icon: Globe,
    label: 'Explore & Practice',
    desc: 'Public quizzes are open to anyone for solo practice — no host needed.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" style={{ padding: '96px 0', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="section-label inline-block mb-3">
              About Quizix
            </motion.span>

            <motion.h2
              variants={fadeUp}
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.375rem)', fontWeight: 500, color: '#111827', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.5px' }}
            >
              A Smarter Way to Run Quizzes
            </motion.h2>

            <motion.p variants={fadeUp} style={{ color: '#4B5563', lineHeight: 1.6, marginBottom: '1rem', fontSize: '0.9375rem' }}>
              Quizix is a real-time interactive quiz platform built for educators and students.
              Hosts create and launch quizzes in minutes; students join with a simple room code
              and see their results the instant they submit.
            </motion.p>

            <motion.p variants={fadeUp} style={{ color: '#4B5563', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.9375rem' }}>
              Built as a graduation project with a focus on real-world usability — not just a demo.
              Every feature, from AI generation to live leaderboards, was designed to work in an
              actual classroom setting.
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['A', 'B', 'C'].map((l) => (
                  <div
                    key={l}
                    style={{ width: 34, height: 34, borderRadius: '50%', background: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 500, border: '2px solid #FFFFFF' }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                Built for real classrooms, real educators, real students.
              </p>
            </motion.div>
          </motion.div>

          {/* Right — highlights grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {highlights.map((item) => (
              <motion.div key={item.label} variants={fadeUp} className="card" style={{ padding: '24px' }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: '#E6FAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <item.icon style={{ width: 18, height: 18, color: '#0D9488' }} />
                </div>
                <h3 style={{ fontWeight: 500, fontSize: '1rem', color: '#111827', marginBottom: '0.5rem' }}>{item.label}</h3>
                <p style={{ color: '#4B5563', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
