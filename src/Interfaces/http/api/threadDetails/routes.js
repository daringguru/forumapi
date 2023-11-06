const routes = (handler) => ([
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadDetailHandler,
  },
]);

module.exports = routes;
