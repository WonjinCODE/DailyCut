import React from 'react';
import { Timer } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = '최적의 콘텐츠를 찾는 중...', 
  fullScreen = false 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-6 p-12">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-accent-red/20 border-t-accent-red animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-accent-red">
          <Timer size={32} className="animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-bold text-white animate-pulse">{message}</p>
        <p className="text-sm text-slate-500">잠시만 기다려 주세요</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[200] bg-dark/90 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
