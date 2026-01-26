import { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import { fetchInvitationBySlug } from '@api/invitation';
import { fetchApi } from '@/feature/api/fetchApi';
import MainPage from '@pages/main/MainPage';

const InvitationPage = () => {
  const { slug } = useParams({ strict: false });
  const [inv, setInv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestbooks, setGuestbooks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchInvitationBySlug('test-202512');
        setInv(data);
        console.log('data', data);
        await fetchGuestbooks();
      } catch (e) {
        console.error(e);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const fetchGuestbooks = async () => {
    const slug = 'test-202512';
    const res = await fetchApi(`/api/guestbook?slug=${slug}&limit=3`, 'GET');

    if (res.ok) {
      setGuestbooks(res.data.guestbooks);
    }
  };

  if (loading) return <p className="loading">마음을 담아 준비 중이에요…💌</p>;

  return <MainPage inv={inv} guestbooks={guestbooks} />;
};

export default InvitationPage;
