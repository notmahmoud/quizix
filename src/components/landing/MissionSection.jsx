import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, TrendingUp } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const pillars = [
  {
    icon: Lightbulb,
    title: 'Make Learning Active',
    desc: 'Passive reading fades. Interactive quizzes force recall, deepen understanding, and make concepts stick.',
  },
  {
    icon: Users,
    title: 'Connect Educators & Students',
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
    <section id="vision" className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-start/10 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-dark-border text-xs font-medium text-slate-300 mb-4"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            Our Vision
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5"
          >
            Learning Should Be{' '}
            <span className="text-gradient">Engaging, Not Exhausting</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed">
            Traditional assessments are slow, impersonal, and tell you almost nothing until it's too late.
            Quizix exists to change that — one live quiz at a time.
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
          {pillars.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="interactive-card p-6 rounded-2xl border border-dark-border group hover:border-accent/40 transition-colors duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-shadow">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
