import App from './route-components/App';
import Index from './route-components/Index';
import Room from './route-components/Room';

export default [{
  path: '/',
  component: App,
  indexRoute: {component: Index},
  childRoutes: [
    {
      path: 'r/:room',
      component: Room
    }
  ]
}];
