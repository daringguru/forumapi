const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

/* eslint-disable no-undef */
describe('Get Thread Detail Use Case', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const useCasePayload = {
      id: 'thread-123',
    };
    const mockThreadDetail = new ThreadDetail({
      id: 'thread-123',
      title: 'thread dicoding',
      body: 'Dicoding is the best',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          content: 'the content',
          date: '2021-08-08T07:22:33.556Z',
          is_delete: false,
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              content: 'the content reply',
              date: '2021-08-08T07:22:33.557Z',
              is_delete: false,
            },
            {
              id: 'reply-124',
              username: 'dicoding',
              content: 'the content2244 reply',
              date: '2021-08-08T07:22:33.558Z',
              is_delete: true,
            },
          ],
        },
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(
        {
          id: 'thread-123',
          title: 'thread dicoding',
          body: 'Dicoding is the best',
          date: '2021-08-08T07:22:33.555Z',
          username: 'dicoding',
        },
      ));

    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          {
            id: 'comment-123',
            username: 'dicoding',
            content: 'the content',
            date: '2021-08-08T07:22:33.556Z',
            is_delete: false,
          },
        ],
      ));

    mockReplyRepository.getReplies = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          {
            id: 'reply-123',
            username: 'dicoding',
            content: 'the content reply',
            date: '2021-08-08T07:22:33.557Z',
            is_delete: false,
          },
          {
            id: 'reply-124',
            username: 'dicoding',
            content: 'the content2244 reply',
            date: '2021-08-08T07:22:33.558Z',
            is_delete: true,
          },
        ],
      ));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const getThreadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThread)
      .toBeCalledWith('thread-123');
    expect(mockCommentRepository.getComments)
      .toBeCalledWith('thread-123');
    expect(mockReplyRepository.getReplies)
      .toBeCalledWith('comment-123');
    expect(getThreadDetail)
      .toEqual(mockThreadDetail);
  });
});
