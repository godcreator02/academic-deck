import { createRoot } from 'react-dom/client';
import '@godcreator/academic-deck/styles.css';
import './presentation.css';
import { Presentation } from '@godcreator/academic-deck';
import { pages } from './slides';

createRoot(document.getElementById('root')).render(
  <Presentation pages={pages} />,
);
