const AddReply = require('../../Domains/replies/entities/AddReply');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this.replyRepository = replyRepository;
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newReply = new AddReply(useCasePayload);
    await this.threadRepository.verifyThread(newReply.thread);
    await this.commentRepository.verifyComment(newReply.comment);
    const addedReply = await this.replyRepository.addReply(newReply);
    return new AddedReply(addedReply);
  }
}

module.exports = AddReplyUseCase;
