import React, { useState } from 'react';
import {
  Store,
  PlusCircle,
  Package,
  FileText,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CreatePostModal } from '../components/pharmacy/CreatePostModal';
import { PharmacyPostCard } from '../components/pharmacy/PharmacyPostCard';

export const PharmacyDashboard: React.FC = () => {
  const { currentUser, pharmacyProfile, pharmacyPosts } = useAuth();
  const { t } = useLanguage();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_posts' | 'network'>('my_posts');

  const myPosts = pharmacyPosts.filter((p) => p.pharmacyId === currentUser?.uid);
  const networkPosts = pharmacyPosts.filter((p) => p.pharmacyId !== currentUser?.uid);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold">
                Pharmacy Enterprise
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 font-mono text-emerald-200 text-xs font-bold border border-emerald-400/30">
                License: {pharmacyProfile?.licenseNumber || 'TN-CH-2024-DRG-8821'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {pharmacyProfile?.pharmacyName || currentUser?.name || 'Thulir Meds'}
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
              Owner: {pharmacyProfile?.ownerName || 'Licensed Pharmacist'} • {pharmacyProfile?.address}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>{t.pharmacy.createNewPost}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('my_posts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my_posts'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.pharmacy.myPostsTitle} ({myPosts.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('network')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'network'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.pharmacy.networkPostsTitle} ({networkPosts.length})
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post Update</span>
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(activeTab === 'my_posts' ? myPosts : networkPosts).map((post) => (
          <PharmacyPostCard key={post.postId} post={post} />
        ))}
      </div>

      {/* Create Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
