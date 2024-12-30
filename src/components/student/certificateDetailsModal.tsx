import { FC } from 'react';
import { Modal } from '../common/modal';

interface CertificateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: any; // Type will be defined based on your NFT metadata
}

export const CertificateDetailsModal: FC<CertificateDetailsModalProps> = ({
  isOpen,
  onClose,
  certificate
}) => {
  if (!certificate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Certificate Details">
      <div className="space-y-6">
        <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden">
          {/* Certificate Image/Preview */}
          <div className="flex items-center justify-center">
            <span className="text-gray-500">Certificate Preview</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white">Details</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Token ID:</span>
                <span className="text-white">{certificate.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Issue Date:</span>
                <span className="text-white">
                  {new Date(certificate.issueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Issuer:</span>
                <span className="text-white">{certificate.issuer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Grade:</span>
                <span className="text-white">{certificate.grade}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white">Actions</h3>
            <div className="mt-2 flex gap-4">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Download
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};