import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AiModal from '@components/ai/AiModal';
import '@/styles/FloatingBtn.css';

const AiDressCodeBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="fab">
      <div className="fab-container">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5 }}
            className="fab-label"
          >
            ✨ AI 옷차림 추천
          </motion.div>
        </AnimatePresence>

        <motion.button
          className="fab-main"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          🌤️
        </motion.button>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <>
            <AiModal onClose={() => setIsModalOpen(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiDressCodeBtn;
