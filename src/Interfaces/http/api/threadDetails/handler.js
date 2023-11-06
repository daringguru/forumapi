const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadDetailsHandler {
  constructor(container) {
    this.container = container;
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async getThreadDetailHandler(request, h) {
    const getThreadDetailUseCase = this.container.getInstance(GetThreadDetailUseCase.name);
    const { threadId } = request.params;
    const thread = await getThreadDetailUseCase.execute({ id: threadId });
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadDetailsHandler;
