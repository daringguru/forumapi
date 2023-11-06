const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this.replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this.replyRepository.verifyReply(deleteReply.id);
    await this.replyRepository.verifyOwner(deleteReply);
    await this.replyRepository.deleteReply(deleteReply.id);
  }
}

module.exports = DeleteReplyUseCase;
