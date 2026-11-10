import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './ds/ntv360';
import './styles/dealer-view.css';
import App from './App';

// No <StrictMode>: pages read a one-time navigation hand-off in their constructors,
// and StrictMode's double construction would consume it twice.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>,
);
