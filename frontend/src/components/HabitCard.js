import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, Trash, Fire, Pencil } from '@phosphor-icons/react';
import { Button } from './ui/button';
import EditHabitModal from './EditHabitModal';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HabitCard = ({ habit, index, onLog, onRefresh }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;
    
    setDeleting(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/habits/${habit.habit_id}`, {
        withCredentials: true,
      });
      toast.success('Habit deleted');
      onRefresh();
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async (updateData) => {
    try {
      await axios.put(`${BACKEND_URL}/api/habits/${habit.habit_id}`, updateData, {
        withCredentials: true,
      });
      toast.success('Habit updated!');
      setShowEdit(false);
      onRefresh();
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const categoryColors = {
    health: '#4F772D',
    productivity: '#2E4033',
    mindfulness: '#E35205',
    finance: '#CD3F31',
  };

  const borderColor = categoryColors[habit.category] || '#2E4033';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        data-testid={`habit-card-${habit.habit_id}`}
        className="flex items-center justify-between p-6 bg-white rounded-xl border-l-4 shadow-sm hover:translate-x-1 transition-all duration-200 group"
        style={{ borderLeftColor: borderColor }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-heading font-medium text-evergreen">{habit.name}</h3>
            <span className="text-xs font-mono tracking-widest uppercase px-2 py-1 rounded-full bg-bone text-muted-foreground">
              {habit.category}
            </span>
          </div>
          
          {habit.description && (
            <p className="text-sm text-muted-foreground mb-3">{habit.description}</p>
          )}

          {(habit.cue || habit.craving || habit.response || habit.reward) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {habit.cue && (
                <div className="bg-bone/50 rounded-lg p-2">
                  <p className="font-mono uppercase tracking-wide text-muted-foreground mb-1">Cue</p>
                  <p className="text-evergreen">{habit.cue}</p>
                </div>
              )}
              {habit.craving && (
                <div className="bg-bone/50 rounded-lg p-2">
                  <p className="font-mono uppercase tracking-wide text-muted-foreground mb-1">Craving</p>
                  <p className="text-evergreen">{habit.craving}</p>
                </div>
              )}
              {habit.response && (
                <div className="bg-bone/50 rounded-lg p-2">
                  <p className="font-mono uppercase tracking-wide text-muted-foreground mb-1">Response</p>
                  <p className="text-evergreen">{habit.response}</p>
                </div>
              )}
              {habit.reward && (
                <div className="bg-bone/50 rounded-lg p-2">
                  <p className="font-mono uppercase tracking-wide text-muted-foreground mb-1">Reward</p>
                  <p className="text-evergreen">{habit.reward}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-6">
          <Button
            onClick={() => setShowEdit(true)}
            data-testid={`edit-habit-${habit.habit_id}`}
            size="icon"
            variant="ghost"
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil size={18} weight="bold" className="text-muted-foreground" />
          </Button>
          <Button
            onClick={handleDelete}
            data-testid={`delete-habit-${habit.habit_id}`}
            size="icon"
            variant="ghost"
            disabled={deleting}
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
          >
            <Trash size={18} weight="bold" className="text-destructive" />
          </Button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onLog(habit.habit_id)}
            data-testid={`log-habit-${habit.habit_id}`}
            className="w-12 h-12 rounded-full bg-evergreen hover:bg-evergreen/90 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ml-2"
          >
            <CheckCircle size={24} weight="bold" className="text-white" />
          </motion.button>
        </div>
      </motion.div>

      {showEdit && (
        <EditHabitModal
          habit={habit}
          onClose={() => setShowEdit(false)}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
};

export default HabitCard;