import { createLazyFileRoute, redirect } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/$slug',
      replace: true,
    });
  },
});
