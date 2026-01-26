import { motion, AnimatePresence } from 'framer-motion';
import '@styles/CustomAlert.css';

const CustomAlert = ({
  isOpen,
  message,
  content,
  type = 'default',
  onClose,
  onConfirm,
  buttonText,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="alert-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="alert-backdrop"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`alert-container alert-type-${type}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="alert-content">
            <div className="alert-icon">{content}</div>
            <p className="alert-message">{message}</p>
          </div>

          <div className="alert-footer">
            <button onClick={handleConfirm} className="alert-button">
              {buttonText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomAlert;
