import React, { useState } from 'react';
import { X, PlusCircle, Store, Package, Users, Megaphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { PharmacyPost } from '../../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, pharmacyProfile, createPharmacyPost } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [postType, setPostType] = useState<PharmacyPost['postType']>('stock_available');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quality, setQuality] = useState('Standard WHO-GMP');
  const [expiryDate, setExpiryDate] = useState('');
  const [location, setLocation] = useState(pharmacyProfile?.address || 'Chennai, Tamil Nadu');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 94440 99887');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || 'contact@pharmacy.com');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in title and description', 'error');
      return;
    }

    const newPost: PharmacyPost = {
      postId: 'post_' + Date.now(),
      pharmacyId: currentUser?.uid || 'pharmacy_id',
      pharmacyName: pharmacyProfile?.pharmacyName || currentUser?.name || 'Thulir Meds',
      postType,
      title: title.trim(),
      description: description.trim(),
      medicineName: medicineName.trim() || undefined,
      quantity: quantity.trim() || undefined,
      quality: quality.trim() || undefined,
      expiryDate: expiryDate || undefined,
      location: location.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      createdAt: new Date().toISOString(),
    };

    await createPharmacyPost(newPost);
    showToast('Post published successfully to healthcare network', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-auto">
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">{t.pharmacy.createNewPost}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {/* Post Type Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Post Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'stock_available', label: t.pharmacy.postTypeStockAvailable, icon: Package },
                { id: 'stock_required', label: t.pharmacy.postTypeStockRequired, icon: Store },
                { id: 'job_vacancy', label: t.pharmacy.postTypeJobVacancy, icon: Users },
                { id: 'announcement', label: t.pharmacy.postTypeAnnouncement, icon: Megaphone },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPostType(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 text-left transition-all ${
                      postType === item.id
                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-teal-600" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Post Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Paracetamol 650mg fresh stock available"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide batch details, minimum order or urgency details..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {(postType === 'stock_available' || postType === 'stock_required') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.pharmacy.medicineName}
                </label>
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="e.g. Insulin Glargine"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.pharmacy.quantity}
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 100 Vials"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.pharmacy.expiryDate}
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.pharmacy.quality}
                </label>
                <input
                  type="text"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.pharmacy.phone}
              </label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.pharmacy.location}
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
            >
              {t.pharmacy.publish}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
