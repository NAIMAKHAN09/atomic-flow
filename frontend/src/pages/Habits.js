import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus } from '@phosphor-icons/react';
import DashboardLayout from '../components/DashboardLayout';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Habits = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

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
      fetchHabits();
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
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    }
  };

  const handleLogHabit = async (habitId) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/habits/${habitId}/log`,
        {},
        { withCredentials: true }
      );
      toast.success('Habit logged!');
      fetchHabits();
    } catch (error) {
      console.error('Error logging habit:', error);
      toast.error('Failed to log habit');
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

  const categories = ['all', 'health', 'productivity', 'mindfulness', 'finance'];
  const filteredHabits = activeTab === 'all' ? habits : habits.filter(h => h.category === activeTab);

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight text-evergreen mb-2">
              All Habits
            </h1>
            <p className="text-lg text-muted-foreground">Manage your atomic habits</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            data-testid="create-habit-button"
            className="bg-evergreen hover:bg-evergreen/90 text-white rounded-full px-6 py-3 font-medium transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <Plus size={20} weight="bold" />
            New Habit
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-border/40 rounded-full p-1">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                data-testid={`tab-${cat}`}
                className="rounded-full px-6 capitalize data-[state=active]:bg-evergreen data-[state=active]:text-white"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-6">
              {filteredHabits.length === 0 ? (
                <div className="bg-white rounded-xl border border-border/40 shadow-sm p-12 text-center">
                  <h3 className="text-xl font-heading font-medium text-evergreen mb-2">
                    No {cat !== 'all' ? cat : ''} habits yet
                  </h3>
                  <p className="text-muted-foreground mb-6">Create your first habit to get started</p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    data-testid="empty-tab-create-button"
                    className="bg-evergreen hover:bg-evergreen/90 text-white rounded-full px-6 py-2 font-medium"
                  >
                    Create Habit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHabits.map((habit, index) => (
                    <HabitCard
                      key={habit.habit_id}
                      habit={habit}
                      index={index}
                      onLog={handleLogHabit}
                      onRefresh={fetchHabits}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
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

export default Habits;