import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ChartLineUp, Target, Lightning } from '@phosphor-icons/react';
import { Button } from '../components/ui/button';

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-bone grain-texture">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-evergreen flex items-center justify-center">
            <CheckCircle size={24} weight="bold" className="text-white" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-evergreen">Atomic Flow</h1>
        </div>
        <Button
          onClick={handleLogin}
          data-testid="nav-login-button"
          className="bg-evergreen hover:bg-evergreen/90 text-white rounded-full px-6 py-2 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign In
        </Button>
      </nav>

      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <p className="text-sm font-mono tracking-widest uppercase text-orange mb-6">Workshop Edition</p>
          <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight leading-[0.95] text-evergreen mb-6">
            Build Better Habits,
            <br />
            <span className="text-orange">1% at a Time</span>
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-12">
            Master the atomic habits framework with a scientific approach to habit formation. Track, analyze, and transform your daily routines into lasting change.
          </p>
          <Button
            onClick={handleLogin}
            data-testid="hero-get-started-button"
            size="lg"
            className="bg-evergreen hover:bg-evergreen/90 text-white rounded-full px-12 py-6 text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started Free
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-xl overflow-hidden shadow-2xl max-w-5xl mx-auto"
        >
          <img
            src="https://images.unsplash.com/photo-1771242905810-82d5f104cf4c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxhcmNoaXRlY3R1cmFsJTIwbW9kZWwlMjBidWlsZGluZ3xlbnwwfHx8fDE3NzE5NDUyODJ8MA&ixlib=rb-4.1.0&q=85"
            alt="Building Habits"
            className="w-full h-[400px] object-cover"
          />
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-16">
          <p className="text-sm font-mono tracking-widest uppercase text-orange mb-4">The Framework</p>
          <h2 className="text-3xl md:text-5xl font-heading font-medium tracking-tight text-evergreen mb-4">
            Four Laws of Behavior Change
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl border border-border/40 shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-evergreen/10 flex items-center justify-center mb-6">
              <Target size={28} weight="bold" className="text-evergreen" />
            </div>
            <h3 className="text-2xl font-heading font-medium text-evergreen mb-3">1. Cue - Make it Obvious</h3>
            <p className="text-muted-foreground leading-relaxed">
              Design your environment to make good habits more visible and bad habits invisible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl border border-border/40 shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center mb-6">
              <Lightning size={28} weight="bold" className="text-orange" />
            </div>
            <h3 className="text-2xl font-heading font-medium text-evergreen mb-3">2. Craving - Make it Attractive</h3>
            <p className="text-muted-foreground leading-relaxed">
              Bundle habits you need with habits you want to create irresistible motivation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl border border-border/40 shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle size={28} weight="bold" className="text-success" />
            </div>
            <h3 className="text-2xl font-heading font-medium text-evergreen mb-3">3. Response - Make it Easy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Reduce friction for good habits and increase friction for bad ones. Start small.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl border border-border/40 shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center mb-6">
              <ChartLineUp size={28} weight="bold" className="text-chart-2" />
            </div>
            <h3 className="text-2xl font-heading font-medium text-evergreen mb-3">4. Reward - Make it Satisfying</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track your progress and celebrate small wins to reinforce positive behaviors.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="bg-evergreen rounded-2xl p-12 md:p-20 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold text-white mb-6">
            Start Your Transformation Today
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join the workshop and discover how small changes lead to remarkable results.
          </p>
          <Button
            onClick={handleLogin}
            data-testid="cta-get-started-button"
            size="lg"
            className="bg-orange hover:bg-orange/90 text-white rounded-full px-12 py-6 text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Begin Your Journey
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Atomic Flow. Built with the Atomic Habits framework.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;