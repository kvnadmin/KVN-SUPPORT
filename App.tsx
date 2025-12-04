
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import TicketCard from './components/TicketCard';
import TicketDetail from './components/TicketDetail';
import CreateTicket from './components/CreateTicket';
import DashboardStats from './components/DashboardStats';
import AdminPortal from './components/AdminPortal';
import { Ticket, User, TicketStatus, TicketPriority, TicketCategory, Comment, AppSettings } from './types';
import { Search, Filter } from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Alice Agent', role: 'AGENT', avatar: 'https://picsum.photos/200/200?random=1' },
  { id: 'u2', name: 'Bob Manager', role: 'MANAGER', avatar: 'https://picsum.photos/200/200?random=2' },
  { id: 'u3', name: 'Eve Employee', role: 'EMPLOYEE', avatar: 'https://picsum.photos/200/200?random=3' },
  { id: 'u4', name: 'Diana Admin', role: 'ADMIN', avatar: 'https://picsum.photos/200/200?random=4' },
];

const INITIAL_SETTINGS: AppSettings = {
  allowGuestSignup: false,
  enforceMfa: true,
  enableAiTriage: true,
  restrictDeletion: true,
  maintenanceMode: false,
};

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 't-10923',
    title: 'VPN Connection Failure',
    description: 'I cannot connect to the corporate VPN. It says "Gateway timeout". I have tried restarting my machine but it persists. This is blocking my access to the production DB.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    category: TicketCategory.NETWORK,
    createdBy: INITIAL_USERS[2],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    comments: [],
    aiSummary: "VPN Gateway timeout preventing production DB access.",
    aiSuggestedFixes: [
      "Verify internet connection stability.",
      "Check if VPN certificate is expired.",
      "Flush DNS cache."
    ]
  },
  {
    id: 't-10924',
    title: 'Need Adobe License',
    description: 'I need a license for Adobe Photoshop for the new marketing campaign assets.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.LOW,
    category: TicketCategory.ACCESS,
    createdBy: INITIAL_USERS[2],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [
        {
            id: 'c1', userId: 'u1', userName: 'Alice Agent', userRole: 'AGENT', 
            content: 'I have requested approval from your manager.', timestamp: new Date().toISOString()
        }
    ],
    aiSummary: "Request for Adobe Photoshop license.",
    aiSuggestedFixes: [
      "Check available licenses in pool.",
      "Route to Line Manager for budget approval."
    ]
  },
  {
      id: 't-10925',
      title: 'Laptop Screen Flickering',
      description: 'My screen flickers intermittently when I move the hinge. It is a MacBook Pro M1.',
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.MEDIUM,
      category: TicketCategory.HARDWARE,
      createdBy: INITIAL_USERS[2],
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date().toISOString(),
      comments: [],
      aiSummary: "Intermittent screen flickering on MacBook Pro M1 (hardware/hinge).",
      aiSuggestedFixes: ["Reset PRAM/NVRAM.", "Check for loose display cable.", "Schedule hardware repair."]
  }
];

const App: React.FC = () => {
  // State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [appSettings, setAppSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  // Computed
  const stats = useMemo(() => {
    return {
      openCount: tickets.filter(t => t.status === TicketStatus.OPEN).length,
      criticalCount: tickets.filter(t => t.priority === TicketPriority.CRITICAL || t.priority === TicketPriority.HIGH).length,
      avgResolutionTimeHours: 4.2, // Mocked for now
      slaBreachRisk: 12
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    let result = tickets;
    
    // Role filter
    if (currentUser.role === 'EMPLOYEE') {
      result = result.filter(t => t.createdBy.id === currentUser.id);
    }

    // Status filter
    if (filter !== 'All') {
      result = result.filter(t => t.status === filter || t.priority === filter);
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, currentUser, filter]);

  const assignableUsers = useMemo(() => {
    return users.filter(u => u.role === 'AGENT' || u.role === 'MANAGER' || u.role === 'ADMIN');
  }, [users]);

  // Handlers
  const handleSwitchUser = () => {
    const currentIndex = users.findIndex(u => u.id === currentUser.id);
    const nextIndex = (currentIndex + 1) % users.length;
    setCurrentUser(users[nextIndex]);
    setCurrentView('dashboard'); // Reset view on switch
    setSelectedTicketId(null);
  };

  const handleCreateTicket = (data: { title: string; description: string; category: TicketCategory; priority: TicketPriority; summary: string; suggestedFixes: string[] }) => {
    const newTicket: Ticket = {
      id: `t-${Math.floor(Math.random() * 10000)}`,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: TicketStatus.OPEN,
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      aiSummary: data.summary,
      aiSuggestedFixes: data.suggestedFixes
    };

    setTickets([newTicket, ...tickets]);
    setCurrentView('dashboard');
    if (currentUser.role === 'EMPLOYEE') {
        setCurrentView('my-tickets');
    }
  };

  const handleUpdateStatus = (id: string, status: TicketStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
  };

  const handleAssignTicket = (id: string, userId: string) => {
    const assignee = users.find(u => u.id === userId);
    setTickets(tickets.map(t => t.id === id ? { ...t, assignedTo: assignee, updatedAt: new Date().toISOString() } : t));
  };

  const handleAddComment = (id: string, content: string, isAi = false) => {
    setTickets(tickets.map(t => {
      if (t.id === id) {
        const newComment: Comment = {
          id: `c-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          content,
          timestamp: new Date().toISOString(),
          isAiGenerated: isAi
        };
        return { ...t, comments: [...t.comments, newComment], updatedAt: new Date().toISOString() };
      }
      return t;
    }));
  };

  const handleAddUser = (userData: Omit<User, 'id' | 'avatar'>) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name,
      role: userData.role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
    };
    setUsers([...users, newUser]);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
  };

  // Render Helpers
  const renderContent = () => {
    if (currentView === 'create-ticket') {
      return (
        <CreateTicket 
          onSubmit={handleCreateTicket} 
          onCancel={() => setCurrentView('dashboard')} 
        />
      );
    }

    if (currentView === 'admin-portal' && currentUser.role === 'ADMIN') {
      return (
        <AdminPortal 
          users={users} 
          settings={appSettings} 
          onAddUser={handleAddUser}
          onUpdateSettings={handleUpdateSettings}
        />
      );
    }

    if (selectedTicketId) {
      const ticket = tickets.find(t => t.id === selectedTicketId);
      if (ticket) {
        return (
          <TicketDetail
            ticket={ticket}
            currentUser={currentUser}
            assignableUsers={assignableUsers}
            onUpdateStatus={handleUpdateStatus}
            onAssignTicket={handleAssignTicket}
            onAddComment={handleAddComment}
            onBack={() => setSelectedTicketId(null)}
          />
        );
      }
    }

    // Dashboard / My Tickets List View
    return (
      <div className="space-y-6">
        {currentView === 'dashboard' && currentUser.role !== 'EMPLOYEE' && (
          <DashboardStats stats={stats} />
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
           <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-slate-50">
             <div className="flex items-center gap-2 text-slate-500">
               <Filter size={20} />
               <span className="text-sm font-semibold">Filter:</span>
               <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-sm outline-none focus:border-blue-500"
               >
                 <option value="All">All Tickets</option>
                 <option value={TicketStatus.OPEN}>Open</option>
                 <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                 <option value={TicketPriority.CRITICAL}>Critical Priority</option>
               </select>
             </div>
             
             <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  className="pl-9 pr-4 py-1.5 rounded-full border border-slate-300 text-sm focus:outline-none focus:border-blue-500 w-64"
                />
             </div>
           </div>

           <div className="p-4 grid gap-3 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredTickets.map(ticket => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onClick={() => setSelectedTicketId(ticket.id)} 
                />
              ))}
              
              {filteredTickets.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400">
                  <p>No tickets found matching criteria.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar 
        currentUser={currentUser} 
        currentView={currentView}
        onChangeView={(view) => {
            setCurrentView(view);
            setSelectedTicketId(null);
        }}
        onSwitchUser={handleSwitchUser}
      />
      
      <main className="flex-1 ml-64 p-8 h-screen overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {selectedTicketId ? 'Ticket Details' : (currentView === 'dashboard' ? 'IT Operations Center' : currentView === 'create-ticket' ? 'Support Portal' : currentView === 'admin-portal' ? 'System Administration' : 'My Tickets')}
            </h1>
            <p className="text-slate-500 mt-1">
               {currentView === 'admin-portal' ? 'Manage users, roles, and global system security.' : (currentUser.role === 'EMPLOYEE' ? 'Report and track your IT requests' : 'Manage support tickets with AI-driven insights')}
            </p>
          </div>
          <div className="flex gap-3">
             {/* Header Actions if needed */}
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;
