import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, TrendingUp } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const pillars = [
  {
    icon: Lightbulb,
    title: 'Make Learning Active',
    desc: 'Passive reading fades. Interactive quizzes force active recall, deepen understanding, and make key concepts stick.',
  },
  {
    icon: Users,
    title: 'Connect Teams & Students',
    desc: 'A shared, live experience where everyone is in the room together — even when they are miles apart.',
  },
  {
    icon: TrendingUp,
    title: 'Turn Data Into Insight',
    desc: 'Every answer tells a story. Instant breakdowns show exactly where students excel and where they need support.',
  },
  {
    icon: Target,
    title: 'Remove the Friction',
    desc: 'No installs, no complicated setup. A quiz is live in minutes so educators can focus on teaching, not technology.',
  },
];

export default function MissionSection() {
  return (
    <section id="vision" style={{ padding: '96px 0', borderBottom: '1px solid #E5E7EB', background: '#FAF9F7' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.span variants={fadeUp} className="section-label inline-block mb-3">
            Our Vision
          </motion.span>
          <motion.h2
            variants={fadeUp}
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.375rem)', fontWeight: 500, color: '#111827', marginBottom: '1rem', letterSpacing: '-0.5px' }}
          >
            Learning Should Be Engaging, Not Exhausting
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color: '#4B5563', lineHeight: 1.6, fontSize: '0.9375rem' }}>
            Traditional assessments are slow, impersonal, and tell you almost nothing until it's too late.
            Quizix is built to change that — one clean, live session at a time.
          </motion.p>
        </motion.div>

        {/* Pillars grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {pillars.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="card flex flex-col justify-between"
              style={{ padding: '24px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}
            >
              <div>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#E6FAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <item.icon style={{ width: 20, height: 20, color: '#0D9488' }} />
                </div>
                <h3 style={{ fontWeight: 500, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: '#4B5563', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
