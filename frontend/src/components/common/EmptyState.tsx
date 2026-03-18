import React from 'react';
import { RefreshCw, SearchX } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = '결과가 없습니다',
  description = '조건을 변경하여 다시 시도해 보세요.',
  actionLabel,
  onAction,
  icon = <SearchX size={48} />
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-600 border border-white/10">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="lg" onClick={onAction} leftIcon={<RefreshCw size={18} />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
