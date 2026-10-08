import React, { useState } from 'react';
import { Store, Filter, Search, Phone, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PharmacyPostCard } from '../components/pharmacy/PharmacyPostCard';
import { PharmacyPost } from '../types';

export const DoctorPharmacyNetworkPage: React.FC = () => {
  const { pharmacyPosts } = useAuth();
  const { t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = pharmacyPosts.filter((post) => {
    const matchesFilter = activeFilter === 'all' || post.postType === activeFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(term) ||
      post.pharmacyName.toLowerCase().includes(term) ||
      (post.medicineName && post.medicineName.toLowerCase().includes(term)) ||
      post.location.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.nav.pharmacyNetwork}</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Browse real-time medicine stock availability, urgent shortages, and clinic announcements from registered local pharmacies.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by medicine name, pharmacy, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Postings' },
              { id: 'stock_available', label: t.pharmacy.postTypeStockAvailable },
              { id: 'stock_required', label: t.pharmacy.postTypeStockRequired },
              { id: 'job_vacancy', label: t.pharmacy.postTypeJobVacancy },
              { id: 'announcement', label: t.pharmacy.postTypeAnnouncement },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeFilter === f.id
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-2">
          <Store className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">{t.pharmacy.noPosts}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => (
            <PharmacyPostCard key={post.postId} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
