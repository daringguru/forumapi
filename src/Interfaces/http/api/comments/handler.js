const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this.container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this.container.getInstance(AddCommentUseCase.name);
    const { id } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId } = request.params;
    const addedComment = await addCommentUseCase.execute({ thread: threadId, content, owner: id });
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this.container.getInstance(DeleteCommentUseCase.name);
    const { id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await deleteCommentUseCase.execute({ id: commentId, threadId, owner: id });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
