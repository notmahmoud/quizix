import { motion } from 'framer-motion';
import { Zap, BarChart2, Globe, Brain } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const highlights = [
  {
    icon: Brain,
    label: 'AI Question Generation',
    desc: 'Generate a full quiz from any topic in seconds — no writing required.',
  },
  {
    icon: Zap,
    label: 'Real-Time Sessions',
    desc: 'Students and hosts are always in sync. Every answer, every status, live.',
  },
  {
    icon: BarChart2,
    label: 'Instant Analytics',
    desc: 'Scores, topic breakdowns, and per-student reviews the moment a quiz ends.',
  },
  {
    icon: Globe,
    label: 'Explore & Practice',
    desc: 'Public quizzes are open to anyone for solo practice — no host needed.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-28 overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute -top-20 -right-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[130px] -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-start/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-dark-border text-xs font-medium text-slate-300 mb-4"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              About Quizix
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight"
            >
              A Smarter Way to{' '}
              <span className="text-gradient">Run Quizzes</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-4">
              Quizix is a real-time interactive quiz platform built for educators and students.
              Hosts create and launch quizzes in minutes; students join with a simple room code
              and see their results the instant they submit.
            </motion.p>

            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-8">
              Built as a graduation project with a focus on real-world usability — not just a demo.
              Every feature, from AI generation to live leaderboards, was designed to work in an
              actual classroom setting.
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['A', 'B', 'C'].map((l) => (
                  <div
                    key={l}
                    className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold border-2 border-dark-bg"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {highlights.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                className="interactive-card p-5 rounded-2xl border border-dark-border group hover:border-accent/40 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-center mb-4 group-hover:border-accent/40 group-hover:bg-accent/10 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{item.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
