import { FC } from 'react';

interface Certificate {
  id: string;
  title: string;
  issueDate: string;
  issuer: string;
  grade: string;
}

interface CertificateCardProps {
  certificate: Certificate;
  onClick: () => void;
}

export const CertificateCard: FC<CertificateCardProps> = ({ certificate, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {certificate.title}
        </h3>
        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm">
          Grade: {certificate.grade}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">
          Issued by: {certificate.issuer}
        </p>
        <p className="text-gray-400 text-sm">
          Date: {new Date(certificate.issueDate).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="text-blue-400 text-sm group-hover:text-blue-300 transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
};