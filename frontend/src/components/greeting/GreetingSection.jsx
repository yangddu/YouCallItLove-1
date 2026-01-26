import { motion } from 'framer-motion';
import '@styles/GreetingSection.css';

const GreetingSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.13 },
    transition: {
      duration: 1.2,
      ease: [0.33, 1, 0.68, 1],
    },
  };

  return (
    <section className="greeting-section">
      <div className="greeting-image"></div>
      <motion.div
        {...fadeInUp}
        transition={{ delay: 0.2 }}
        className="greeting-text"
      >
        2026년 2월 13일
        <br />
        토요일 오후 3:30
      </motion.div>
      <div className="divider" />
      <motion.div
        {...fadeInUp}
        transition={{ delay: 0.6 }}
        className="greeting-text"
      >
        서울특별시 영등포구 국회대로 558
        <br />
        웨스턴 베니비스
      </motion.div>

      <motion.div
        {...fadeInUp}
        transition={{ delay: 0.8 }}
        className="save-the-date-small"
      >
        Save The Date
      </motion.div>
    </section>
  );
};

export default GreetingSection;
