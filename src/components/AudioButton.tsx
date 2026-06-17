import { speak } from '../utils/audio';

interface AudioButtonProps {
  text: string;
  lang?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AudioButton({ text, lang = 'sr-RS', size = 'md', className = '' }: AudioButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(text, lang).catch(() => {});
  };

  return (
    <button
      onClick={handleSpeak}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 active:bg-primary-200 transition-colors ${className}`}
      title="Прослушать"
    >
      🔊
    </button>
  );
}
