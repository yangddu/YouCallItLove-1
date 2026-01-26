import { fetchApi } from '@/feature/api/fetchApi';

export const fetchInvitationBySlug = async (slug) => {
  const res = await fetchApi(`/api/public/invitations/${slug}`, 'GET');
  return res.data;
};
