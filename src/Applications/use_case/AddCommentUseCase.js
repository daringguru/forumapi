const AddComment = require('../../Domains/comments/entities/AddComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newComment = new AddComment(useCasePayload);
    await this.threadRepository.verifyThread(newComment.thread);
    const addedComment = await this.commentRepository.addComment(newComment);
    return new AddedComment(addedComment);
  }
}

module.exports = AddCommentUseCase;
