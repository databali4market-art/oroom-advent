import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import './styles.css';
import App from './App';
import { Admin } from './components/Admin';
import { initAnalytics } from './lib/analytics';

initAnalytics();
const page = new URLSearchParams(location.search).has('admin') ? <Admin /> : <App />;
createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>);
