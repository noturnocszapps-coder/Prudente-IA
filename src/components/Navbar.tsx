import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, ShoppingBag, Star, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { isAdmin } = useAuth();

  const navItems = [
    { to: '/', icon: Home, label: 'Hoje' },
    { to: '/chat', icon: MessageSquare, label: 'IA' },
    { to: '/economize', icon: ShoppingBag, label: 'Poupar' },
    { to: '/vip', icon: Star, label: 'VIP' },
    { to: '/profile', icon: User, label: 'Perfil' },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', icon: Settings, label: 'Painel' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-lg border-t border-white/5 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full transition-all duration-200",
                isActive ? "text-blue-400" : "text-neutral-500 hover:text-neutral-300"
              )
            }
          >
            <item.icon size={20} className="mb-1" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
