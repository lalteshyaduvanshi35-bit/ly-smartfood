import React, { useState } from 'react';
import { X, Star, ThumbsUp, CheckCircle, MessageSquarePlus, User } from 'lucide-react';
import { MenuItem, Review, Language } from '../types';
import { translations } from '../i18n/translations';

interface ReviewsModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  currentLang: Language;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  item,
  isOpen,
  onClose,
  reviews,
  onAddReview,
  currentLang,
}) => {
  const t = translations[currentLang] || translations.en;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!isOpen || !item) return null;

  const itemReviews = reviews.filter(r => r.itemId === item.id);
  const availableTags = ["Hot & Fresh ⚡", "Super Tasty 😋", "Great Packaging 📦", "Spicy & Crispy 🌶️", "Value for Money 💰"];

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !userName.trim()) return;

    onAddReview({
      itemId: item.id,
      userName: userName.trim(),
      userAvatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      rating,
      comment: comment.trim(),
      tags: selectedTags,
      verifiedPurchase: true
    });

    setComment('');
    setUserName('');
    setSelectedTags([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{item.rating} / 5.0</span>
                <span className="text-slate-400 font-normal">({itemReviews.length} reviews)</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Write a Review Section */}
        <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquarePlus className="w-4 h-4 text-orange-500" />
            <span>{t.writeReview}</span>
          </h4>

          {/* Star selector */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 cursor-pointer transition-transform hover:scale-110"
              >
                <Star className={`w-6 h-6 ${
                  (hoverRating || rating) >= star 
                    ? 'fill-amber-400 text-amber-500' 
                    : 'text-slate-300'
                }`} />
              </button>
            ))}
          </div>

          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your Name (e.g. Rahul S.)"
            className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:border-orange-500 focus:outline-hidden"
            required
          />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t.reviewPlaceholder}
            rows={2}
            className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:border-orange-500 focus:outline-hidden"
            required
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggleTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  selectedTags.includes(tag)
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            {t.submitReview}
          </button>
        </form>

        {/* Existing Reviews List */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
            {t.reviewsTitle}
          </h4>

          {itemReviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">
              No reviews yet. Be the first customer to review this dish!
            </p>
          ) : (
            <div className="space-y-3">
              {itemReviews.map(rev => (
                <div key={rev.id} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-xs text-slate-800">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[9px] text-emerald-600 font-bold ml-1.5 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rev.tags.map(tg => (
                        <span key={tg} className="bg-slate-100 text-slate-600 text-[9px] font-semibold px-2 py-0.5 rounded-md">
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
