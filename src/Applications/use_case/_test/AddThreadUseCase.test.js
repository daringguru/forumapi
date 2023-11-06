/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'this is title',
      body: 'dicoding is the best',
      owner: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'this is title',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'this is title',
        owner: 'user-123',
      }));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addThreadUseCaseResult = await addThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.addThread)
      .toBeCalledWith(new AddThread(useCasePayload));
    expect(addThreadUseCaseResult).toEqual(mockAddedThread);
  });
});
