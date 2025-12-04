import React, { useState } from 'react';
import { TicketPriority, TicketCategory } from '../types';
import { analyzeTicket } from '../services/geminiService';
import { Sparkles, Loader2, Send } from 'lucide-react';

interface CreateTicketProps {
  onSubmit: (data: { title: string; description: string; category: TicketCategory; priority: TicketPriority; summary: string; suggestedFixes: string[] }) => void;
  onCancel: () => void;
}

const CreateTicket: React.FC<CreateTicketProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsAnalyzing(true);
    
    // AI Magic happens here
    try {
      const analysis = await analyzeTicket(title, description);
      
      onSubmit({
        title,
        description,
        category: analysis.category,
        priority: analysis.priority,
        summary: analysis.summary,
        suggestedFixes: analysis.suggestedFixes
      });
    } catch (err) {
      // Fallback if AI fails
      onSubmit({
        title,
        description,
        category: TicketCategory.OTHER,
        priority: TicketPriority.MEDIUM,
        summary: title,
        suggestedFixes: []
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-300" />
          Create New Ticket
        </h2>
        <p className="text-blue-100 opacity-90 mt-1">
          Describe your issue. Our AI will automatically categorize and prioritize it for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Summary</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g., Laptop won't connect to office WiFi"
            required
            disabled={isAnalyzing}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Detailed Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[150px]"
            placeholder="Please provide details about what happened, error messages, and what you were doing when the issue occurred..."
            required
            disabled={isAnalyzing}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
          <p className="font-medium flex items-center gap-2">
            <Sparkles size={14} className="text-blue-600" />
            AI Assistant Active
          </p>
          <p className="mt-1 text-blue-600 opacity-80">
            Upon submission, your ticket will be instantly analyzed to suggest quick fixes and route to the right expert.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors"
            disabled={isAnalyzing}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isAnalyzing}
            className={`px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Issue...
              </>
            ) : (
              <>
                Submit Ticket
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
