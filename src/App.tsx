import { BrowserRouter } from 'react-router-dom';
import Root from './Root';

function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <Root />
    </BrowserRouter>
  );
}

export default App;
