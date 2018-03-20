import { Router } from 'express';

import messages from './services/messages';

export default ({ config, database }) => {
  const webRouter = Router();

  // in the interest of speed, statically create routes
  webRouter.use('/messages', messages({ config, database }));

  // this must come after the static routes above
  // it's a catch all for everything else
  webRouter.get('*', function(request, response) {
    response.sendStatus(404);
  });

  return webRouter;
};
