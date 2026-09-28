"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare, Trash2, Reply } from "lucide-react";
import { getSubTaskCommentsAction, postSubTaskCommentAction, deleteSubTaskCommentAction } from "../actions/matrixIt";
import { getCurrentUser, CurrentUser } from "../lib/auth";
import Swal from "sweetalert2";

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subTaskId: number;
  section: string; // "GOALS", "ACTION_PLAN", "PROGRESS_ADMIN"
  sectionTitle: string;
}

export default function CommentDrawer({ isOpen, onClose, subTaskId, section, sectionTitle }: CommentDrawerProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [highlightedCommentId, setHighlightedCommentId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, subTaskId, section]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const fetchComments = async () => {
    setLoading(true);
    const res = await getSubTaskCommentsAction(subTaskId, section);
    if (res.success && res.data) {
      setComments(res.data);
    }
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const res = await postSubTaskCommentAction(subTaskId, section, inputText, user.id, replyingTo?.id);
    if (res.success) {
      setInputText("");
      setReplyingTo(null);
      fetchComments();
    } else {
      Swal.fire("Error", "Gagal mengirim komentar: " + res.error, "error");
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Hapus komentar?",
      text: "Komentar ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (confirm.isConfirmed) {
      const res = await deleteSubTaskCommentAction(id);
      if (res.success) {
        fetchComments();
      }
    }
  };

  const scrollToComment = (id: number) => {
    const el = document.getElementById(`comment-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedCommentId(id);
      setTimeout(() => {
        setHighlightedCommentId(null);
      }, 2000);
    }
  };

  const renderComments = () => {
    if (comments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <MessageSquare size={48} className="mb-4 opacity-20" />
          <p>Belum ada komentar.</p>
          <p className="text-sm">Jadilah yang pertama memulai diskusi!</p>
        </div>
      );
    }

    return comments.map(comment => {
      const parent = comment.parentId ? comments.find(c => c.id === comment.parentId) : null;
      return (
        <div key={comment.id} className="mb-4">
          <CommentBubble 
            comment={comment} 
            currentUser={user} 
            onReply={() => setReplyingTo(comment)} 
            onDelete={() => handleDelete(comment.id)} 
            parentComment={parent}
            isHighlighted={highlightedCommentId === comment.id}
            onQuoteClick={scrollToComment}
          />
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-gray-50 shadow-2xl z-[110] flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-600" />
              Diskusi: {sectionTitle}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderComments()
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 shrink-0">
          {!user ? (
            <div className="text-sm text-center text-red-500 p-2 bg-red-50 rounded-lg">
              Anda harus login untuk berkomentar.
            </div>
          ) : user.role === "GUEST" ? (
            <div className="text-sm text-center text-gray-500 p-2 bg-gray-100 rounded-lg">
              Anda memiliki akses tamu (hanya lihat).
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex flex-col gap-2">
              {replyingTo && (
                <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 text-sm">
                  <div className="text-gray-600 truncate flex items-center gap-1.5">
                    <Reply size={14} className="text-blue-500" />
                    Membalas <b>{replyingTo.user?.name}</b>: "{replyingTo.content}"
                  </div>
                  <button type="button" onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="p-3 bg-[#1A237E] hover:bg-blue-900 disabled:bg-gray-300 text-white rounded-xl transition-colors shadow-md shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function CommentBubble({ 
  comment, 
  currentUser, 
  onReply, 
  onDelete, 
  parentComment,
  onQuoteClick,
  isHighlighted
}: { 
  comment: any;
  currentUser: CurrentUser | null;
  onReply: () => void;
  onDelete: () => void;
  parentComment?: any;
  onQuoteClick?: (id: number) => void;
  isHighlighted?: boolean;
}) {
  const isMine = currentUser?.id === comment.userId;
  
  return (
    <div id={`comment-${comment.id}`} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group transition-all duration-500 ${isHighlighted ? 'scale-[1.02]' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold text-gray-700">{comment.user?.name}</span>
        {comment.user?.role === 'SUPER_ADMIN' && (
          <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md border border-red-200 uppercase tracking-wider">Super Admin</span>
        )}
        {comment.user?.role === 'PIC' && (
          <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md border border-blue-200 uppercase tracking-wider">PIC</span>
        )}
        <span className="text-[10px] text-gray-400">
          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      <div className="flex items-start gap-2 max-w-[85%]">
        {isMine && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
            <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-colors" title="Hapus"><Trash2 size={12}/></button>
          </div>
        )}
        
        <div className={`flex flex-col gap-1.5 px-4 py-2.5 rounded-2xl text-sm shadow-sm border transition-colors duration-500 ${
          isMine 
            ? 'bg-blue-600 text-white border-blue-700 rounded-tr-sm' 
            : 'bg-white text-gray-800 border-gray-100 rounded-tl-sm'
        } ${isHighlighted ? (isMine ? 'ring-4 ring-blue-400/50' : 'ring-4 ring-yellow-400/50 bg-yellow-50') : ''}`}>
          {parentComment && (
            <div 
              onClick={() => onQuoteClick?.(parentComment.id)}
              className={`p-2 rounded-lg text-xs border-l-2 cursor-pointer transition-opacity hover:opacity-80 ${
                isMine ? 'bg-blue-700/50 border-blue-300 text-blue-100' : 'bg-gray-50 border-blue-400 text-gray-500'
              }`}
            >
              <div className="font-bold mb-0.5 opacity-80">{parentComment.user?.name}</div>
              <div className="line-clamp-2">{parentComment.content}</div>
            </div>
          )}
          <span className="whitespace-pre-wrap">{comment.content}</span>
        </div>
        
        {!isMine && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
            <button onClick={onReply} className="p-1 text-gray-400 hover:text-blue-500 hover:bg-white rounded-full transition-colors" title="Balas"><Reply size={12}/></button>
          </div>
        )}
      </div>
    </div>
  );
}
