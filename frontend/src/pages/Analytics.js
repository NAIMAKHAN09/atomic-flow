import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Fire, TrendUp } from '@phosphor-icons/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streaks, setStreaks] = useState([]);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
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
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const [streaksRes, overviewRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/analytics/streaks`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/analytics/overview`, { withCredentials: true }),
      ]);
      setStreaks(streaksRes.data);
      setOverview(overviewRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
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

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight text-evergreen mb-2">
            Analytics
          </h1>
          <p className="text-lg text-muted-foreground">Track your progress and streaks</p>
        </div>

        {overview && (
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-border/40 shadow-sm p-8"
              data-testid="overall-progress-card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
                  <Fire size={24} weight="fill" className="text-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-medium text-evergreen">Current Streak</h3>
                  <p className="text-sm text-muted-foreground">Days in a row</p>
                </div>
              </div>
              <p className="text-6xl font-heading font-bold text-orange mb-2">{overview.current_streak}</p>
              <p className="text-sm text-muted-foreground">Keep the momentum going!</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-border/40 shadow-sm p-8"
              data-testid="completion-rate-card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendUp size={24} weight="bold" className="text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-medium text-evergreen">Total Completions</h3>
                  <p className="text-sm text-muted-foreground">All time</p>
                </div>
              </div>
              <p className="text-6xl font-heading font-bold text-success mb-2">{overview.total_completions}</p>
              <p className="text-sm text-muted-foreground">
                {overview.total_habits} active habits
              </p>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-border/40 shadow-sm p-8"
        >
          <h3 className="text-2xl font-heading font-medium text-evergreen mb-6">Habit Streaks</h3>
          {streaks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No habits tracked yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {streaks.map((streak) => (
                <div
                  key={streak.habit_id}
                  data-testid={`streak-${streak.habit_id}`}
                  className="flex items-center justify-between p-4 bg-bone/30 rounded-lg hover:bg-bone/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-evergreen mb-1">{streak.habit_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {streak.total_completions} total completions
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Fire
                        size={24}
                        weight="fill"
                        className={streak.current_streak > 0 ? 'text-orange' : 'text-muted'}
                      />
                      <span className="text-3xl font-heading font-bold text-evergreen">
                        {streak.current_streak}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">day streak</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {streaks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-border/40 shadow-sm p-8"
          >
            <h3 className="text-2xl font-heading font-medium text-evergreen mb-6">Completion Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={streaks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E0D6" />
                <XAxis dataKey="habit_name" stroke="#6B706B" />
                <YAxis stroke="#6B706B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DQD9D0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="total_completions" fill="#2E4033" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        <div className="bg-evergreen/5 rounded-xl p-8 border border-evergreen/10">
          <h3 className="text-xl font-heading font-medium text-evergreen mb-3">
            The 1% Better Philosophy
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            If you get 1% better each day for one year, you'll end up 37 times better by the time you're done.
            Focus on small, consistent improvements rather than dramatic transformations.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;