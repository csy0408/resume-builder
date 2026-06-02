import { useRef } from 'react';

interface PhotoUploadProps {
  photo?: string;
  onChange: (base64: string) => void;
}

export default function PhotoUpload({ photo, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[var(--color-primary)] transition-colors bg-white"
      >
        {photo ? (
          <img src={photo} alt="头像" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-3xl">+</span>
        )}
      </div>
      {photo && (
        <button
          onClick={(e) => { e.stopPropagation(); onChange(''); }}
          className="text-xs text-gray-400 hover:text-red-500"
        >
          移除照片
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
