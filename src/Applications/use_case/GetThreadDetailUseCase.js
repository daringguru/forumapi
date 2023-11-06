const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { id } = useCasePayload;
    const threadRepo = await this.threadRepository.getThread(id);
    const commentsRepo = await this.commentRepository.getComments(id);
    const newComments = await Promise.all(
      Array.from(commentsRepo).map(async (comment) => {
        const repliesRepo = await this.replyRepository.getReplies(comment.id);
        return { ...comment, replies: repliesRepo };
      }),
    );
    return new ThreadDetail({ ...threadRepo, comments: newComments });
  }
}

module.exports = GetThreadDetailUseCase;
