const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this.container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this.container.getInstance(AddReplyUseCase.name);
    const { id } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId, commentId } = request.params;
    const addedReply = await addReplyUseCase.execute({
      thread: threadId, comment: commentId, content, owner: id,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this.container.getInstance(DeleteReplyUseCase.name);
    const { id } = request.auth.credentials;
    const { replyId } = request.params;
    await deleteReplyUseCase.execute({ id: replyId, owner: id });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
