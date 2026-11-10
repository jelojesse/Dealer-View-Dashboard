import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_BY_FILE } from './routes';

/**
 * Pages link to each other by their design file names ("DealerHosts.dc.html"),
 * exactly as in Claude Design. This intercepts those clicks (including the
 * programmatic ones the navbar makes) and turns them into router navigation.
 */
function useDesignLinks() {
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!a) return;
      const m = /([A-Za-z0-9]+\.dc\.html)(\?[^#]*)?/.exec(a.getAttribute('href') || '');
      if (!m) return;
      const path = ROUTE_BY_FILE[m[1]];
      if (!path) return;
      e.preventDefault();
      navigate(path + (m[2] || ''));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
}

function TitleSync() {
  const { pathname } = useLocation();
  useEffect(() => {
    const r = ROUTES.find((x) => x.path === pathname);
    document.title = r ? `${r.title} · NTV360 Dealer` : 'NTV360 Dealer';
  }, [pathname]);
  return null;
}

export default function App() {
  useDesignLinks();
  return (
    <>
      <TitleSync />
      <Routes>
        {ROUTES.map(({ path, component: Page }) => (
          <Route key={path} path={path} element={<Page />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
