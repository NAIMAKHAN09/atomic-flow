import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Plus, ChartLineUp, Fire } from '@phosphor-icons/react';
import DashboardLayout from '../components/DashboardLayout';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(!location.state?.user);
  const [habits, setHabits] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [habitsLoading, setHabitsLoading] = useState(true);

  useEffect(() => {
    if (location.state?.user) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Not authenticated:', error);
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate, location.state]);

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchAnalytics();
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/habits`, {
        withCredentials: true,
      });
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setHabitsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/analytics/overview`, {
        withCredentials: true,
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleLogHabit = async (habitId) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/habits/${habitId}/log`,
        {},
        { withCredentials: true }
      );
      toast.success('Habit logged!', {
        description: 'Keep building that streak!',
      });
      fetchHabits();
      fetchAnalytics();
    } catch (error) {
      console.error('Error logging habit:', error);
      toast.error('Failed to log habit');
    }
  };

  const handleCreateHabit = async (habitData) => {
    try {
      await axios.post(`${BACKEND_URL}/api/habits`, habitData, {
        withCredentials: true,
      });
      toast.success('Habit created!');
      setShowCreateModal(false);
      fetchHabits();
      fetchAnalytics();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-evergreen border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-evergreen font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-mono tracking-widest uppercase text-orange mb-2">{today}</p>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight text-evergreen mb-2">
            Today's Habits
          </h1>
          <p className="text-lg text-muted-foreground">Small changes, remarkable results</p>
        </div>

        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-border/40 shadow-sm p-6"
              data-testid="stat-total-habits"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} weight="bold" className="text-evergreen" />
                <p className="text-sm text-muted-foreground">Total Habits</p>
              </div>
              <p className="text-3xl font-heading font-semibold text-evergreen">{analytics.total_habits}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl border border-border/40 shadow-sm p-6"
              data-testid="stat-completed-today"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} weight="fill" className="text-success" />
                <p className="text-sm text-muted-foreground">Completed Today</p>
              </div>
              <p className="text-3xl font-heading font-semibold text-success">{analytics.completed_today}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl border border-border/40 shadow-sm p-6"
              data-testid="stat-current-streak"
            >
              <div className="flex items-center gap-2 mb-2">
                <Fire size={20} weight="fill" className="text-orange" />
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
              <p className="text-3xl font-heading font-semibold text-orange">{analytics.current_streak}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl border border-border/40 shadow-sm p-6"
              data-testid="stat-total-completions"
            >
              <div className="flex items-center gap-2 mb-2">
                <ChartLineUp size={20} weight="bold" className="text-evergreen" />
                <p className="text-sm text-muted-foreground">Total Completions</p>
              </div>
              <p className="text-3xl font-heading font-semibold text-evergreen">{analytics.total_completions}</p>
            </motion.div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading font-medium text-evergreen">Your Habits</h2>
            <Button
              onClick={() => setShowCreateModal(true)}
              data-testid="create-habit-button"
              className="bg-evergreen hover:bg-evergreen/90 text-white rounded-full px-6 py-2 font-medium transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Plus size={20} weight="bold" />
              Add Habit
            </Button>
          </div>

          {habitsLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-evergreen border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading habits...</p>
            </div>
          ) : habits.length === 0 ? (
            <div className="bg-white rounded-xl border border-border/40 shadow-sm p-12 text-center">
              <CheckCircle size={48} weight="thin" className="text-muted mx-auto mb-4" />
              <h3 className="text-xl font-heading font-medium text-evergreen mb-2">No habits yet</h3>
              <p className="text-muted-foreground mb-6">Start building better habits today!</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                data-testid="empty-state-create-button"
                className="bg-evergreen hover:bg-evergreen/90 text-white rounded-full px-6 py-2 font-medium"
              >
                Create Your First Habit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {habits.map((habit, index) => (
                  <HabitCard
                    key={habit.habit_id}
                    habit={habit}
                    index={index}
                    onLog={handleLogHabit}
                    onRefresh={fetchHabits}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateHabitModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateHabit}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;