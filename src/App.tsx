import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import CustomCursor from './components/layout/CustomCursor';

function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <CustomCursor />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
