import React, { useState, useRef, useEffect } from 'react';
import { Ticket, TicketStatus, User, Comment } from '../types';
import { generateDraftReply } from '../services/geminiService';
import { 
  Send, User as UserIcon, Bot, BrainCircuit, Check, 
  Lightbulb, ShieldAlert, Sparkles, X, CornerUpLeft, Clock
} from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  currentUser: User;
  assignableUsers: User[];
  onUpdateStatus: (id: string, status: TicketStatus) => void;
  onAssignTicket: (id: string, userId: string) => void;
  onAddComment: (id: string, content: string, isAi?: boolean) => void;
  onBack: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ 
  ticket, 
  currentUser, 
  assignableUsers,
  onUpdateStatus, 
  onAssignTicket,
  onAddComment, 
  onBack 
}) => {
  const [replyText, setReplyText] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.comments]);

  const handleSend = () => {
    if (!replyText.trim()) return;
    onAddComment(ticket.id, replyText);
    setReplyText('');
  };

  const handleGenerateDraft = async () => {
    setIsGeneratingReply(true);
    const draft = await generateDraftReply(ticket);
    setReplyText(draft);
    setIsGeneratingReply(false);
  };

  const isAgent = currentUser.role !== 'EMPLOYEE';

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      
      {/* Main Content: Chat & Details */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-6rem)]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors">
                <CornerUpLeft size={20} />
              </button>
              <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{ticket.title}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide
                ${ticket.status === TicketStatus.OPEN ? 'bg-green-100 text-green-700' : 
                  ticket.status === TicketStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-slate-500 text-sm pl-8">
              Reported by <span className="font-medium text-slate-700">{ticket.createdBy.name}</span>
              {ticket.assignedTo && (
                <> • Assigned to <span className="font-medium text-slate-700">{ticket.assignedTo.name}</span></>
              )}
              • {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
          
          {isAgent && (
             <div className="flex gap-2">
               <select
                  value={ticket.assignedTo?.id || ''}
                  onChange={(e) => onAssignTicket(ticket.id, e.target.value)}
                  className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer max-w-[150px]"
                  title="Assign Ticket"
               >
                 <option value="">Unassigned</option>
                 {assignableUsers.map(u => (
                   <option key={u.id} value={u.id}>{u.name}</option>
                 ))}
               </select>

               <select 
                 value={ticket.status}
                 onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                 className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
               >
                 {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
           {/* Original Issue */}
           <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative ml-0 mr-12">
             <div className="absolute -left-3 top-4 w-6 h-6 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center">
               <UserIcon size={12} className="text-blue-600" />
             </div>
             <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
           </div>

           {/* Comments */}
           {ticket.comments.map((comment) => (
             <div 
               key={comment.id} 
               className={`flex ${comment.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}
             >
               <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm relative ${
                 comment.userId === currentUser.id 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
               }`}>
                  <div className="flex items-center gap-2 mb-1 opacity-80 text-xs">
                     <span className="font-bold">{comment.userName}</span>
                     <span>•</span>
                     <span>{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     {comment.isAiGenerated && (
                       <span className="flex items-center gap-1 bg-white/20 px-1.5 rounded text-[10px]">
                         <Sparkles size={10} /> AI Drafted
                       </span>
                     )}
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{comment.content}</p>
               </div>
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
           <div className="relative">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none min-h-[60px] max-h-[150px]"
                onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
              />
              <button 
                onClick={handleSend}
                disabled={!replyText.trim()}
                className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <Send size={18} />
              </button>
           </div>
           
           {isAgent && (
             <div className="mt-2 flex items-center justify-between">
                <button
                  onClick={handleGenerateDraft}
                  disabled={isGeneratingReply}
                  className="flex items-center gap-2 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 transition-colors"
                >
                  {isGeneratingReply ? <BrainCircuit size={14} className="animate-pulse" /> : <Sparkles size={14} />}
                  {isGeneratingReply ? 'Generating Draft...' : 'Generate AI Reply'}
                </button>
                <span className="text-xs text-slate-400">Press Enter to send</span>
             </div>
           )}
        </div>
      </div>

      {/* Right Sidebar: AI Insights */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        
        {/* AI Summary Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
             <Bot size={18} className="text-blue-500" />
             AI Analysis
           </h3>
           
           <div className="space-y-4">
             <div>
               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Issue Summary</p>
               <p className="text-sm text-slate-700 leading-snug">{ticket.aiSummary || "Processing..."}</p>
             </div>
             
             <div className="flex gap-2">
                <div className="flex-1">
                   <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                   <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700">
                     {ticket.category}
                   </span>
                </div>
                <div className="flex-1">
                   <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Priority</p>
                   <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                     ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                     ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                     ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                     'bg-green-100 text-green-700'
                   }`}>
                     {ticket.priority}
                   </span>
                </div>
             </div>
           </div>
        </div>

        {/* Suggested Fixes Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex-1">
           <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
             <Lightbulb size={18} className="text-yellow-500" />
             Smart Solutions
           </h3>

           <div className="space-y-3">
             {ticket.aiSuggestedFixes && ticket.aiSuggestedFixes.length > 0 ? (
               ticket.aiSuggestedFixes.map((fix, idx) => (
                 <div key={idx} className="flex gap-3 items-start p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                   <div className="mt-0.5 min-w-[20px] h-5 rounded-full bg-white border border-slate-300 text-slate-500 text-xs flex items-center justify-center font-medium group-hover:border-blue-400 group-hover:text-blue-500">
                     {idx + 1}
                   </div>
                   <p className="text-sm text-slate-600 group-hover:text-slate-800">{fix}</p>
                 </div>
               ))
             ) : (
               <div className="text-center py-8 text-slate-400 text-sm">
                 <BrainCircuit size={24} className="mx-auto mb-2 opacity-50" />
                 Analyzing solution paths...
               </div>
             )}
           </div>

           {isAgent && (
             <div className="mt-4 pt-4 border-t border-slate-100">
               <button className="w-full py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                 <ShieldAlert size={14} />
                 Search Knowledge Base
               </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default TicketDetail;