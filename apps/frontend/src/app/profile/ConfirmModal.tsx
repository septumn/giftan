'use client'

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmBtn: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, title, message, confirmBtn, onConfirm, onCancel }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center mt-[-550px] justify-center bg-black/50 backdrop-blur-sm p-4 select-none animate-fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl animate-in fade-in zoom-in duration-200 animate-slide-up">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors hover:cursor-pointer"
          >
            Отмена
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-100 hover:cursor-pointer"
          >
            {confirmBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal