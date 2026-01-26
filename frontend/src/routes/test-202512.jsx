import { createFileRoute } from '@tanstack/react-router';
import InvitationPage from '@/pages/invitation/InvitationPage';

export const Route = createFileRoute('/test-202512')({
  component: InvitationPage,
});
