import { Outlet } from 'react-router-dom';
import ScrollToTopOnRouteChange from './ScrollToTopOnRouteChange';

export default function RouterScrollLayout() {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <Outlet />
    </>
  );
}
