import { AppRoutes } from './router';
import CustomCursor from './components/layout/CustomCursor';

/** Everything inside the router; shared by the browser (main.tsx) and the prerenderer (entry-server.tsx). */
export default function Root() {
  return (
    <>
      <CustomCursor />
      <AppRoutes />
    </>
  );
}
