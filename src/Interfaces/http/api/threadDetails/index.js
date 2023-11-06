const ThreadDetailsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threadDetails',
  register: async (server, { container }) => {
    const threadDetailsHandler = new ThreadDetailsHandler(container);
    server.route(routes(threadDetailsHandler));
  },
};
