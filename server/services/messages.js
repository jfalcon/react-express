import resource from 'resource-router-middleware';
import MessageModel from '../models/message';

/* eslint-disable no-unused-vars */

export default ({ config, database }) => resource({
  // property name to store a preloaded entity on request
  id : 'message',

  // requests with an `id` should auto-load the entity, errors will
  // terminate the request while success sets `request[id] = data`
  load(request, id, callback) {
    const model = new MessageModel();
    if (typeof callback === 'function') callback();
  },

  // GET / - list all message entities
  index({ params }, response) {
    const model = new MessageModel();
    let data = model.all();
    console.log(data[0].message);
    response.json(model.all()[0]);
  },

  // POST / - create a new message entity
  create({ body }, response) {
    response.json(body);
  },

  // GET /:id - return a given message entity
  read({ message }, response) {
    response.json(message);
  },

  // PUT /:id - update the message entity
  update({ message, body }, response) {
    response.sendStatus(204);
  },

  // DELETE /:id - delete the message entity
  delete({ message }, response) {
    response.sendStatus(204);
  }
});
