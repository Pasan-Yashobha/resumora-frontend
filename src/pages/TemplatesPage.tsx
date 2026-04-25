import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowRightLine } from 'react-icons/ri';
import { TemplateCard } from '../components/dashboard/TemplateCard';
import { Button } from '../components/ui/Button';
import { TemplateCardSkeleton } from '../components/ui/Loader';
import { useAuthStore } from '../store/authStore';
import { TEMPLATE_CATALOG } from '../types';
import { Star } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const isPremium = user?.subscriptionPlan === 'premium';

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const availableIds = isPremium
    ? TEMPLATE_CATALOG.map((t) => t.id)
    : TEMPLATE_CATALOG.filter((t) => t.plan === 'basic').map((t) => t.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-gray-900">Templates</h1>
            <p className="text-gray-500 mt-1">
              {isPremium ? 'All 10 templates unlocked.' : `5 free templates. ${TEMPLATE_CATALOG.filter(t => t.plan === 'premium').length} more with Premium.`}
            </p>
          </div>
          {!isPremium && (
            <Link to="/dashboard/billing">
              <Button size="sm" leftIcon={<Star className="w-3.5 h-3.5" />}>Unlock all templates</Button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Upgrade banner */}
      {!isPremium && !loading && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-primary-50 border border-primary-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary-600 flex items-center justify-center shrink-0 text-white text-lg">
              <Star />
            </div>
            <div>
              <p className="font-semibold text-gray-900">5 premium templates locked</p>
              <p className="text-sm text-gray-500">Upgrade to Premium for one-time $9.99 to access Executive, Creative, Elegant, Bold, and Timeline layouts.</p>
            </div>
          </div>
          <Link to="/dashboard/billing">
            <Button size="sm" variant="secondary" rightIcon={<RiArrowRightLine className="w-3.5 h-3.5" />}>Upgrade - $9.99</Button>
          </Link>
        </motion.div>
      )}

      {/* Free templates */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">Free Templates</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => <TemplateCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATE_CATALOG.filter((t) => t.plan === 'basic').map((tmpl, i) => (
              <TemplateCard key={tmpl.id} template={tmpl} isAvailable={availableIds.includes(tmpl.id)} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Premium templates */}
      <div>
        <h2 className="font-display text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Premium Templates
          {!isPremium && <span className="text-sm font-normal text-secondary-600 flex items-center gap-1"><Star className="w-4 h-4" /> Upgrade to unlock</span>}
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => <TemplateCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATE_CATALOG.filter((t) => t.plan === 'premium').map((tmpl, i) => (
              <TemplateCard key={tmpl.id} template={tmpl} isAvailable={availableIds.includes(tmpl.id)} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
