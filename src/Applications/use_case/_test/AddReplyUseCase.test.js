/* eslint-disable no-undef */
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add Reply action correctly', async () => {
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      content: 'This is my first Reply in this super duper excellent comment',
      owner: 'user-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'This is my first Reply in this super duper excellent comment',
      owner: 'user-123',
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'reply-123',
        content: 'This is my first Reply in this super duper excellent comment',
        owner: 'user-123',
      }));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addReplyUseCaseResult = await addReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.verifyComment).toBeCalledWith(useCasePayload.comment);
    expect(mockReplyRepository.addReply).toBeCalledWith(useCasePayload);
    expect(addReplyUseCaseResult).toEqual(mockAddedReply);
  });
});
