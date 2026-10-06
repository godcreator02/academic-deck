import { createRoot } from 'react-dom/client';
import { Presentation } from '@godcreator/academic-deck';
import '@godcreator/academic-deck/styles.css';
import './presentation.css';
import { pages } from './slides.jsx';
createRoot(document.getElementById('root')).render(<Presentation pages={pages}/>);
