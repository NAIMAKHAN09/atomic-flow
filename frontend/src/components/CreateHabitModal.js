import React, { useState } from 'react';
import { X } from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  {
    value: 'health',
    label: 'Health',
    image: 'https://images.unsplash.com/photo-1645106281638-79585657aa4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHw0fHxtaW5pbWFsaXN0JTIwcnVubmluZyUyMHNob2VzJTIwYWVzdGhldGljfGVufDB8fHx8MTc3MTk0NTI5MXww&ixlib=rb-4.1.0&q=85',
    color: '#4F772D',
  },
  {
    value: 'productivity',
    label: 'Productivity',
    image: 'https://images.unsplash.com/photo-1674083324759-bdeade274ed3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzN8MHwxfHNlYXJjaHwzfHxtaW5pbWFsaXN0JTIwZGVzayUyMHNldHVwJTIwcHJvZHVjdGl2aXR5fGVufDB8fHx8MTc3MTk0NTI5M3ww&ixlib=rb-4.1.0&q=85',
    color: '#2E4033',
  },
  {
    value: 'mindfulness',
    label: 'Mindfulness',
    image: 'https://images.unsplash.com/photo-1646909106850-8c426285ed2a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwzfHxtZWRpdGF0aW9uJTIwY3VzaGlvbiUyMHplbiUyMGFlc3RoZXRpY3xlbnwwfHx8fDE3NzE5NDUyOTR8MA&ixlib=rb-4.1.0&q=85',
    color: '#E35205',
  },
  {
    value: 'finance',
    label: 'Finance',
    image: 'https://images.unsplash.com/photo-1622210445956-ca3320a5e7c5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBncm93dGglMjBwbGFudCUyMGNvaW4lMjBtaW5pbWFsaXN0fGVufDB8fHx8MTc3MTk0NTI5Nnww&ixlib=rb-4.1.0&q=85',
    color: '#CD3F31',
  },
];

const CreateHabitModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    cue: '',
    craving: '',
    response: '',
    reward: '',
    goal_frequency: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      return;
    }
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
          data-testid="create-habit-modal"
        >
          <div className="sticky top-0 bg-white border-b border-border/40 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-evergreen">Create New Habit</h2>
              <p className="text-sm text-muted-foreground">Build better habits, 1% at a time</p>
            </div>
            <button
              onClick={onClose}
              data-testid="close-modal"
              className="w-10 h-10 rounded-full hover:bg-secondary/50 flex items-center justify-center transition-colors"
            >
              <X size={24} className="text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <Label htmlFor="name" className="text-evergreen font-medium mb-2 block">
                Habit Name *
              </Label>
              <Input
                id="name"
                data-testid="habit-name-input"
                placeholder="e.g., Morning run, Read 10 pages"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-evergreen font-medium mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                data-testid="habit-description-input"
                placeholder="Why is this habit important to you?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label className="text-evergreen font-medium mb-3 block">Category *</Label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    data-testid={`category-${cat.value}`}
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      formData.category === cat.value
                        ? 'border-evergreen scale-[1.02]'
                        : 'border-border/40 hover:border-evergreen/50'
                    }`}
                  >
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <p className="text-white font-medium">{cat.label}</p>
                    </div>
                    {formData.category === cat.value && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-evergreen rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border/40 pt-6">
              <h3 className="text-lg font-heading font-medium text-evergreen mb-3">
                Atomic Habits Framework
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Fill in these fields to apply the four laws of behavior change
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cue" className="text-sm font-medium mb-2 block">
                    Cue (Make it Obvious)
                  </Label>
                  <Input
                    id="cue"
                    data-testid="habit-cue-input"
                    placeholder="When/Where will you do it?"
                    value={formData.cue}
                    onChange={(e) => setFormData({ ...formData, cue: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="craving" className="text-sm font-medium mb-2 block">
                    Craving (Make it Attractive)
                  </Label>
                  <Input
                    id="craving"
                    data-testid="habit-craving-input"
                    placeholder="What makes it appealing?"
                    value={formData.craving}
                    onChange={(e) => setFormData({ ...formData, craving: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="response" className="text-sm font-medium mb-2 block">
                    Response (Make it Easy)
                  </Label>
                  <Input
                    id="response"
                    data-testid="habit-response-input"
                    placeholder="Simplify the action"
                    value={formData.response}
                    onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="reward" className="text-sm font-medium mb-2 block">
                    Reward (Make it Satisfying)
                  </Label>
                  <Input
                    id="reward"
                    data-testid="habit-reward-input"
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
                data-testid="cancel-button"
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="submit-habit-button"
                className="flex-1 bg-evergreen hover:bg-evergreen/90 text-white rounded-full"
                disabled={!formData.name || !formData.category}
              >
                Create Habit
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateHabitModal;