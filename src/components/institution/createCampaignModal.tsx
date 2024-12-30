import { useState, useEffect } from 'react';
import { useAndromeda } from '@/hooks/useAndromeda';
import { Modal } from '../common/modal';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  userWalletAddress: string;  // Cüzdan adresini buradan alıyoruz
}

export const CreateCampaignModal = ({ isOpen, onClose, userWalletAddress }: CreateCampaignModalProps) => {
  const { createCampaign, isLoading, error } = useAndromeda();
  const [formData, setFormData] = useState({
    price: '',
    min_tokens_sold: '',
    max_amount_per_wallet: '',
    end_time: '',
    recipient: userWalletAddress // Cüzdan adresi buraya otomatik olarak geliyor
  });
  const [formError, setFormError] = useState<string | null>(null);

  const validateForm = () => {
    if (!formData.price || parseFloat(formData.price) <= 0)
      return 'Valid price is required';
    if (!formData.min_tokens_sold || parseInt(formData.min_tokens_sold) <= 0)
      return 'Minimum tokens sold is required';
    if (!formData.max_amount_per_wallet || parseInt(formData.max_amount_per_wallet) <= 0)
      return 'Maximum amount per wallet is required';
    if (!formData.end_time)
      return 'End date is required';
    if (new Date(formData.end_time).getTime() <= Date.now())
      return 'End date must be in the future';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await createCampaign({
        start_time: Math.floor(Date.now() / 1000),
        end_time: Math.floor(new Date(formData.end_time).getTime() / 1000),
        price: formData.price,
        min_tokens_sold: formData.min_tokens_sold,
        max_amount_per_wallet: formData.max_amount_per_wallet,
        recipient: formData.recipient  // Alıcı adresi otomatik alınıyor
      });
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create campaign');
    }
  };

  useEffect(() => {
    // Eğer cüzdan adresi değişirse, formu güncelle
    setFormData(prev => ({ ...prev, recipient: userWalletAddress }));
  }, [userWalletAddress]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Campaign">
      <form onSubmit={handleSubmit} className="space-y-4">
        {(formError || error) && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{formError || error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300">Token Price (uandr)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="mt-1 block w-full rounded-lg px-3 py-2 bg-gray-700 border border-gray-600 text-white"
            min="0"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Min Tokens Sold</label>
            <input
              type="number"
              value={formData.min_tokens_sold}
              onChange={(e) => setFormData(prev => ({ ...prev, min_tokens_sold: e.target.value }))}
              className="mt-1 block w-full rounded-lg px-3 py-2 bg-gray-700 border border-gray-600 text-white"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Max Per Wallet</label>
            <input
              type="number"
              value={formData.max_amount_per_wallet}
              onChange={(e) => setFormData(prev => ({ ...prev, max_amount_per_wallet: e.target.value }))}
              className="mt-1 block w-full rounded-lg px-3 py-2 bg-gray-700 border border-gray-600 text-white"
              min="1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">End Date</label>
          <input
            type="datetime-local"
            value={formData.end_time}
            onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
            className="mt-1 block w-full rounded-lg px-3 py-2 bg-gray-700 border border-gray-600 text-white"
            min={new Date().toISOString().slice(0, 16)}
            required
          />
        </div>

        {/* Recipient adresi artık formda görünmüyor çünkü otomatik alınıyor */}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Create Campaign'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
