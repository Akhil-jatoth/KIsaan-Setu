import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ThumbsUp, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Send, 
  Image as ImageIcon, 
  CheckCircle2, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { apiService } from '../services/apiService';
import { CommunityNote } from '../types';

export function CommunityPage() {
  const { user, addToast } = useAppStore();
  const [notes, setNotes] = useState<CommunityNote[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Note Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [crop, setCrop] = useState('Tomato');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const data = await apiService.getCommunityNotes();
    setNotes(data);
  };

  const handleUpvote = async (id: string) => {
    await apiService.upvoteCommunityNote(id);
    loadNotes();
    addToast({
      type: 'success',
      title: 'Upvote Logged',
      message: 'Thank you for supporting fellow farmers!'
    });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await apiService.addCommunityNote({
      title,
      content,
      crop,
      image,
      location: 'Block B, Sector 2'
    });

    setTitle('');
    setContent('');
    setShowAddModal(false);
    loadNotes();
    addToast({
      type: 'success',
      title: 'Field Observation Shared',
      message: 'Your field observation is now visible to nearby farmers and agronomists.'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#09220e] to-agri-darkest">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-agri-accent" />
            <h1 className="text-2xl font-extrabold text-white">
              Community Field Notes & Crowd-Solving
            </h1>
          </div>
          <p className="text-xs text-gray-300 font-mono mt-0.5">
            Share field problems, collaborate with certified agronomists, and build collective crop resilience
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-glow-accent transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post Observation</span>
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="glass-panel p-6 border-agri-accent/40 bg-[#081e0e] shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white">Share a Field Observation / Question</h3>
            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white text-xs">✕</button>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Observation Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Unusual target-board spots after morning rain"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agri-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Target Crop</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-agri-accent"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Corn">Corn</option>
                  <option value="Rice">Rice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agri-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Field Symptoms & Notes</label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe what you observed, what remedies you tested, or questions for local experts..."
                className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agri-accent"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-agri-accent text-agri-darkest font-bold px-5 py-2 rounded-xl text-xs shadow-glow-accent"
              >
                Publish to Network
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed List */}
      <div className="space-y-4">
        {notes.map(note => (
          <div key={note.id} className="glass-panel p-5 border-white/10 space-y-4">
            
            {/* Author Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={note.avatar} alt={note.author} className="w-10 h-10 rounded-full object-cover border border-agri-accent" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{note.author}</span>
                    <span className="text-[10px] font-mono bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                      {note.role}
                    </span>
                    {note.solved && (
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Solved</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2 mt-0.5">
                    <span>{note.timeAgo}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{note.location}</span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-mono bg-agri-accent/20 text-agri-accent px-2.5 py-1 rounded-xl border border-agri-accent/30 font-bold">
                {note.crop}
              </span>
            </div>

            {/* Note Content */}
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-white">{note.title}</h3>
              <p className="text-xs text-gray-200 leading-relaxed">{note.content}</p>
            </div>

            {/* Attached Photo */}
            {note.image && (
              <div className="h-56 sm:h-64 rounded-2xl overflow-hidden border border-white/15">
                <img src={note.image} alt={note.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Expert Comments Section */}
            {note.comments && note.comments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-mono text-agri-accent font-bold uppercase block">
                  Agronomist & Expert Solutions:
                </span>
                {note.comments.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-start gap-3 text-xs">
                    <img src={c.avatar} alt={c.author} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{c.author} ({c.role})</span>
                        <span className="text-[10px] text-gray-400 font-mono">{c.timestamp}</span>
                      </div>
                      <p className="text-gray-300 mt-0.5 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upvote & Comment Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
              <button
                onClick={() => handleUpvote(note.id)}
                className="flex items-center gap-1.5 text-gray-300 hover:text-agri-accent bg-black/40 hover:bg-black/80 px-3 py-1.5 rounded-xl border border-white/10 transition-all"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{note.upvotes} Upvotes</span>
              </button>

              <span className="text-gray-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{note.commentsCount || note.comments?.length || 0} Replies</span>
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
