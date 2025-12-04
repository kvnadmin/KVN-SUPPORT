import React from 'react';
import { Ticket, TicketPriority, TicketStatus } from '../types';
import { Clock, AlertCircle, CheckCircle2, Circle } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const getPriorityColor = (p: TicketPriority) => {
    switch (p) {
      case TicketPriority.CRITICAL: return 'bg-red-100 text-red-700 border-red-200';
      case TicketPriority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
      case TicketPriority.MEDIUM: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case TicketPriority.LOW: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusIcon = (s: TicketStatus) => {
    switch(s) {
      case TicketStatus.RESOLVED: return <CheckCircle2 size={16} className="text-green-500" />;
      case TicketStatus.CLOSED: return <CheckCircle2 size={16} className="text-slate-400" />;
      case TicketStatus.IN_PROGRESS: return <Clock size={16} className="text-blue-500" />;
      default: return <AlertCircle size={16} className="text-slate-500" />;
    }
  };

  return (
    <div 
      onClick={() => onClick(ticket)}
      className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">#{ticket.id.slice(0, 8)}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
        </div>
        <span className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
      
      <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
        {ticket.title}
      </h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-3 h-10">
        {ticket.aiSummary || ticket.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-600">
           {getStatusIcon(ticket.status)}
           <span className="text-xs font-medium">{ticket.status}</span>
        </div>
        <div className="flex items-center gap-2">
            {ticket.assignedTo && (
                <img 
                  src={ticket.assignedTo.avatar} 
                  alt={ticket.assignedTo.name} 
                  title={`Assigned to ${ticket.assignedTo.name}`}
                  className="w-6 h-6 rounded-full border border-white shadow-sm"
                />
            )}
            {ticket.category && (
                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {ticket.category}
                 </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;