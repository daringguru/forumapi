/* eslint-disable no-undef */
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };
    const deleteComment = new DeleteComment(useCasePayload);

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThread)
      .toBeCalledWith(deleteComment.threadId);
    expect(mockCommentRepository.verifyComment)
      .toBeCalledWith(deleteComment.id);
    expect(mockCommentRepository.verifyOwner)
      .toBeCalledWith(deleteComment);
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(deleteComment.id);
  });
});
