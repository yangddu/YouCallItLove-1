import { createFileRoute } from '@tanstack/react-router';
import { InvitationPage } from '@pages/invitation/InvitationPage';

export const Route = createFileRoute('/$slug')({
  component: InvitationPage,
});
