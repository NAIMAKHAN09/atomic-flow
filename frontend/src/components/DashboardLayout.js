import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, SquaresFour, ChartLineUp, ListChecks, SignOut } from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DashboardLayout = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    { path: '/dashboard', icon: SquaresFour, label: 'Dashboard' },
    { path: '/habits', icon: ListChecks, label: 'Habits' },
    { path: '/analytics', icon: ChartLineUp, label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-bone grain-texture">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border/40 p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-full bg-evergreen flex items-center justify-center">
            <CheckCircle size={24} weight="bold" className="text-white" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-evergreen">Atomic Flow</h1>
        </div>

        <nav className="space-y-2 mb-12">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-evergreen text-white'
                    : 'text-muted-foreground hover:bg-secondary/50'
                }`}
              >
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {user && (
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-4 p-3 bg-bone rounded-lg">
              <Avatar>
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback className="bg-evergreen text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-evergreen truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              data-testid="logout-button"
              variant="outline"
              className="w-full flex items-center gap-2 rounded-full"
            >
              <SignOut size={18} weight="bold" />
              Logout
            </Button>
          </div>
        )}
      </aside>

      <div className="lg:ml-64">
        <header className="bg-white/80 backdrop-blur-md border-b border-border/40 p-4 lg:hidden sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-evergreen flex items-center justify-center">
                <CheckCircle size={18} weight="bold" className="text-white" />
              </div>
              <h1 className="text-xl font-heading font-semibold text-evergreen">Atomic Flow</h1>
            </div>
            {user && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback className="bg-evergreen text-white text-xs">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <nav className="flex gap-2 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-evergreen text-white'
                      : 'text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  <Icon size={16} weight={isActive ? 'fill' : 'regular'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8" data-testid="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;