import React from 'react';
import {
  Package,
  Store,
  Users,
  Megaphone,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Trash2,
} from 'lucide-react';
import { PharmacyPost } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface PharmacyPostCardProps {
  post: PharmacyPost;
}

export const PharmacyPostCard: React.FC<PharmacyPostCardProps> = ({ post }) => {
  const { currentUser, deletePharmacyPost } = useAuth();
  const { showToast } = useToast();

  const isOwner = currentUser?.uid === post.pharmacyId;

  const typeConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
    stock_available: {
      label: 'Stock Available',
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      icon: Package,
    },
    stock_required: {
      label: 'Stock Required',
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      icon: Store,
    },
    job_vacancy: {
      label: 'Job Vacancy',
      bg: 'bg-purple-50 border-purple-200',
      text: 'text-purple-800',
      icon: Users,
    },
    announcement: {
      label: 'Announcement',
      bg: 'bg-sky-50 border-sky-200',
      text: 'text-sky-800',
      icon: Megaphone,
    },
  };

  const badge = typeConfig[post.postType] || typeConfig.announcement;
  const Icon = badge.icon;

  const handleDelete = async () => {
    await deletePharmacyPost(post.postId);
    showToast('Pharmacy post removed', 'info');
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3 hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${badge.bg} ${badge.text}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900">{post.title}</h4>
          <p className="text-xs font-medium text-teal-800">{post.pharmacyName}</p>
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
            title="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
        {post.description}
      </p>

      {/* Meta tags */}
      {(post.medicineName || post.quantity || post.expiryDate) && (
        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          {post.medicineName && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-800">
              Med: {post.medicineName}
            </span>
          )}
          {post.quantity && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold">
              Qty: {post.quantity}
            </span>
          )}
          {post.expiryDate && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              Exp: {post.expiryDate}
            </span>
          )}
        </div>
      )}

      {/* Contact info bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.location}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-teal-700">
            <Phone className="w-3.5 h-3.5" />
            <span>{post.contactPhone}</span>
          </div>
        </div>

        {post.contactEmail && (
          <div className="flex items-center gap-1 text-slate-500">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{post.contactEmail}</span>
          </div>
        )}
      </div>
    </div>
  );
};
