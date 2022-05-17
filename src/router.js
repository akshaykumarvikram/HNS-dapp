import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Status404 from './pages/Status404';

const Loader = (Component) => (props) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// const Status404 = Loader(lazy(() => import('src/pages/Status/Status404')));
const routes = [
    {
        path: '/',
        element: <SidebarLayout />,
        children: [
            {
              path: '/abc',
              element: <Status404 />
            },
        ]
    }
]

export default routes;