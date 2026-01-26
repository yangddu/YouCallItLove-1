import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { AlertProvider } from '@hooks/useAlert';
import { useSessionContext } from '@hooks/useSession';
import { SessionContextProvider } from '@contexts/SessionContext.jsx';
import '@styles/App.css';

const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
  },
});

const AppInner = () => {
  const auth = useSessionContext();

  return <RouterProvider router={router} context={{ auth }} />;
};

export default function App() {
  return (
    <SessionContextProvider>
      <AlertProvider>
        <main className="main-container">
          <AppInner />
        </main>
      </AlertProvider>
    </SessionContextProvider>
  );
}
