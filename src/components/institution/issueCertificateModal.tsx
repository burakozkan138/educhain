"use client";
import { useState } from 'react';
import { useAndromeda } from '@/hooks/useAndromeda';
import { Modal } from '../common/modal';

interface IssueCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IssueCertificateModal = ({ isOpen, onClose }: IssueCertificateModalProps) => {
  const { mintCertificate, isLoading, error } = useAndromeda();
  const [formData, setFormData] = useState({
    studentAddress: '',
    title: '',
    description: '',
    imageUrl: '',
    metadata: {
      issueDate: new Date().toISOString().split('T')[0],
      courseId: '',
      grade: ''
    }
  });
  const [formError, setFormError] = useState<string | null>(null);

  const validateForm = () => {
    if (!formData.studentAddress.trim()) return 'Student address is required';
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.metadata.courseId.trim()) return 'Course ID is required';
    if (!formData.metadata.grade.trim()) return 'Grade is required';
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
      await mintCertificate({
        title: formData.title,
        description: formData.description,
        image: formData.imageUrl || undefined,
        attributes: [
          { trait_type: "Issue Date", value: formData.metadata.issueDate },
          { trait_type: "Course ID", value: formData.metadata.courseId },
          { trait_type: "Grade", value: formData.metadata.grade },
          { trait_type: "Student", value: formData.studentAddress }
        ]
      });
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to mint certificate');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue New Certificate">
      <form onSubmit={handleSubmit} className="space-y-4">
        {(formError || error) && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{formError || error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Student Wallet Address
          </label>
          <input
            type="text"
            value={formData.studentAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, studentAddress: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="andr..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Certificate Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Course ID
            </label>
            <input
              type="text"
              value={formData.metadata.courseId}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, courseId: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Grade
            </label>
            <input
              type="text"
              value={formData.metadata.grade}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, grade: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Minting...
              </>
            ) : (
              'Issue Certificate'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};