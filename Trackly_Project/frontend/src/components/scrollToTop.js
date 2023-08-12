import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component will scroll the page to the top when a user navigates to a new page
const ScrollToTop = () => {
  const { pathname } = useLocation();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

export default ScrollToTop;