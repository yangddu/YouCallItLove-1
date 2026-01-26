import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { AlertProvider } from '@hooks/useAlert';
import { SessionContextProvider } from '@contexts/SessionContext.jsx';
import '@styles/App.css';

const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
  },
});

export default function App() {
  return (
    <SessionContextProvider>
      <AlertProvider>
        <main className="main-container">
          <RouterProvider router={router} />
        </main>
      </AlertProvider>
    </SessionContextProvider>
  );
}
