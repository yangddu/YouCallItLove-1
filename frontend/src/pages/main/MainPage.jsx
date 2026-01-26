import { useEffect, useRef, useState } from 'react';
import { useSessionContext } from '@/hooks/useSession';
import MapSection from '@components/map/MapSection';
import VisualSection from '@components/invitation/VisualSection';
import GreetingSection from '@components/greeting/GreetingSection';
import AccountSection from '@components/account/AccountSection';
import GuestbookSection from '@components/guest/GuestbookSection';
import StorySection from '@components/invitation/StorySection';
import WeddingCalendar from '@components/calendar/Calendar';
import AiDressCodeBtn from '@/components/ai/AiDressCodeBtn';
import ClosingSection from '@/components/closing/ClosingSection';
import SliderContainer from '@/components/gallery/SliderContainer';
import Footer from '@/components/footer/Footer';
import { AnimatePresence } from 'framer-motion';
import '@styles/index.css';

export default function MainPage({ inv, guestbooks }) {
  const [showAiBtn, setShowAiBtn] = useState(false);
  const storyRef = useRef(null);
  const JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

  const { data, status } = useSessionContext();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowAiBtn(true);
        } else {
          setShowAiBtn(false);
        }
      },
      {
        threshold: 0.1,
      },
    );

    if (storyRef.current) {
      observer.observe(storyRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="classic-theme-wrapper">
      <div style={{ color: 'red' }}>
        {status}
        {status === 'authenticated' ? '로그인됨' : '로그인 안됨'}
      </div>
      <VisualSection img={inv.coverUrl} />
      <GreetingSection content={guestbooks.text} />
      <div ref={storyRef} className="layer">
        <StorySection />
        <MapSection venue={guestbooks.address} /> {/* 지도 */}
        <WeddingCalendar /> {/* 캘린더 */}
        <SliderContainer /> {/* 갤러리 */}
        <GuestbookSection /> {/* 방명록 */}
        <AccountSection /> {/* 계좌번호 */}
        <ClosingSection />
        <Footer />
      </div>
      <AnimatePresence>{showAiBtn && <AiDressCodeBtn />}</AnimatePresence>
    </div>
  );
}
