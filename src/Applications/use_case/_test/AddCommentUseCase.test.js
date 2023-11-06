/* eslint-disable no-undef */
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      thread: 'thread-123',
      content: 'This is my first comment in this super duper excellent thread',
      owner: 'user-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'user-123',
      content: 'This is my first comment in this super duper excellent thread',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'user-123',
        content: 'This is my first comment in this super duper excellent thread',
        owner: 'user-123',
      }));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addCommentUseCaseResult = await addCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.addComment).toBeCalledWith(useCasePayload);
    expect(addCommentUseCaseResult).toEqual(mockAddedComment);
  });
});
