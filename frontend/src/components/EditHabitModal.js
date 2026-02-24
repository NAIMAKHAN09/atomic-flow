import React, { useState } from 'react';
import { X } from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

const EditHabitModal = ({ habit, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: habit.name,
    description: habit.description || '',
    cue: habit.cue || '',
    craving: habit.craving || '',
    response: habit.response || '',
    reward: habit.reward || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          data-testid="edit-habit-modal"
        >
          <div className="sticky top-0 bg-white border-b border-border/40 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-evergreen">Edit Habit</h2>
              <p className="text-sm text-muted-foreground">Update your habit details</p>
            </div>
            <button
              onClick={onClose}
              data-testid="close-edit-modal"
              className="w-10 h-10 rounded-full hover:bg-secondary/50 flex items-center justify-center transition-colors"
            >
              <X size={24} className="text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <Label htmlFor="edit-name" className="text-evergreen font-medium mb-2 block">
                Habit Name *
              </Label>
              <Input
                id="edit-name"
                data-testid="edit-habit-name-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-evergreen font-medium mb-2 block">
                Description
              </Label>
              <Textarea
                id="edit-description"
                data-testid="edit-habit-description-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="border-t border-border/40 pt-6">
              <h3 className="text-lg font-heading font-medium text-evergreen mb-4">
                Atomic Habits Framework
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-cue" className="text-sm font-medium mb-2 block">
                    Cue (Make it Obvious)
                  </Label>
                  <Input
                    id="edit-cue"
                    data-testid="edit-habit-cue-input"
                    placeholder="When/Where will you do it?"
                    value={formData.cue}
                    onChange={(e) => setFormData({ ...formData, cue: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-craving" className="text-sm font-medium mb-2 block">
                    Craving (Make it Attractive)
                  </Label>
                  <Input
                    id="edit-craving"
                    data-testid="edit-habit-craving-input"
                    placeholder="What makes it appealing?"
                    value={formData.craving}
                    onChange={(e) => setFormData({ ...formData, craving: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-response" className="text-sm font-medium mb-2 block">
                    Response (Make it Easy)
                  </Label>
                  <Input
                    id="edit-response"
                    data-testid="edit-habit-response-input"
                    placeholder="Simplify the action"
                    value={formData.response}
                    onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-reward" className="text-sm font-medium mb-2 block">
                    Reward (Make it Satisfying)
                  </Label>
                  <Input
                    id="edit-reward"
                    data-testid="edit-habit-reward-input"
                    placeholder="Immediate satisfaction"
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="cancel-edit-button"
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="submit-edit-button"
                className="flex-1 bg-evergreen hover:bg-evergreen/90 text-white rounded-full"
                disabled={!formData.name}
              >
                Update Habit
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditHabitModal;