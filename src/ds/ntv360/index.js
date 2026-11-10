// NTV360 design-system components (Button, Input, Select, Modal, Navbar, Icon, ...).
// bundle.js is the design system's own build, copied unchanged from the Claude Design file.
// It expects React on window, so react-global.js runs first (ES modules run in import order).
import './react-global.js';
import './bundle.js';
import './tokens.css';
import './bundle.css';

export const NTV = window.NTV360;
