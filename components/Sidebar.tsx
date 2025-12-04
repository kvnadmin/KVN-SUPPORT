
import React from 'react';
import { LayoutDashboard, Ticket, PlusCircle, ShieldCheck, User as UserIcon, Shield } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User;
  currentView: string;
  onChangeView: (view: string) => void;
  onSwitchUser: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, currentView, onChangeView, onSwitchUser }) => {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['AGENT', 'MANAGER', 'ADMIN'] },
    { id: 'my-tickets', label: 'My Tickets', icon: Ticket, roles: ['EMPLOYEE', 'AGENT', 'MANAGER', 'ADMIN'] },
    { id: 'create-ticket', label: 'New Ticket', icon: PlusCircle, roles: ['EMPLOYEE', 'AGENT', 'MANAGER', 'ADMIN'] },
    { id: 'admin-portal', label: 'Admin Portal', icon: Shield, roles: ['ADMIN'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 border-b border-slate-700 flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">SmartHelp IT</h1>
          <p className="text-xs text-slate-400">AI Studio Edition</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-600">
             <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 capitalize">{currentUser.role.toLowerCase()}</p>
          </div>
        </div>
        <button 
          onClick={onSwitchUser}
          className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 py-2 rounded transition-colors"
        >
          <UserIcon size={16} />
          <span>Switch Role (Demo)</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
