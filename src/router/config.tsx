import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Projects from "../pages/projects/page";
import Media from "../pages/media/page";
import News from "../pages/news/page";
import Impact from "../pages/impact/page";
import Careers from "../pages/careers/page";
import About from "../pages/about/page";
import Contact from "../pages/contact/page";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/projects", element: <Projects /> },
  { path: "/media", element: <Media /> },
  { path: "/news", element: <News /> },
  { path: "/impact", element: <Impact /> },
  { path: "/careers", element: <Careers /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
