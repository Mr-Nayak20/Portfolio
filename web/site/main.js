import {boot} from './shell.js';
import {home} from './home.js';
import {about, archive, article, blog, clients, contact, jobsPage, serviceDetail, servicesIndex, study, works} from './pages.js';

const pages = {
  home, about, services: servicesIndex, service: serviceDetail, works, study,
  clients, blog, article, jobs: jobsPage, archive, contact
};

boot(() => pages[document.body.dataset.page]?.());
