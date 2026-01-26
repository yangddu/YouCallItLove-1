import { useState, useEffect, useCallback } from 'react';
import { fetchInvitationBySlug } from '@api/invitation';
import { fetchApi } from '@/feature/api/fetchApi';
import MainPage from '@pages/main/MainPage';
import { useParams } from '@tanstack/react-router';

const InvitationPage = () => {
  const { slug: urlSlug } = useParams({ from: '/$slug' });
  const slug = urlSlug;
  const [data, setData] = useState({
    loading: true,
    inv: null,
    guestbooks: [],
    error: null,
  });

  const loadData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    try {
      const [invData, guestbookRes] = await Promise.all([
        fetchInvitationBySlug(slug),
        fetchApi(`/api/guestbook?slug=${slug}&limit=3`, 'GET'),
      ]);

      setData({
        inv: invData,
        guestbooks: guestbookRes.ok ? guestbookRes.data.guestbooks : [],
        loading: false,
        error: null,
      });
    } catch (e) {
      console.error('데이터 로딩 실패:', e);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: '초대장을 불러오는 중 오류가 발생했습니다.',
      }));
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (data.loading)
    return <p className="loading">마음을 담아 준비 중이에요…💌</p>;

  return <MainPage inv={data.inv} guestbooks={data.guestbooks} />;
};

export default InvitationPage;
