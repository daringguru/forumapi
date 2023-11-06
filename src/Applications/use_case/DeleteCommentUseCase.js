const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this.threadRepository.verifyThread(deleteComment.threadId);
    await this.commentRepository.verifyComment(deleteComment.id);
    await this.commentRepository.verifyOwner(deleteComment);
    await this.commentRepository.deleteComment(deleteComment.id);
  }
}

module.exports = DeleteCommentUseCase;
