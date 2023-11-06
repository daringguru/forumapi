const AddComment = require('../AddComment');
/* eslint-disable no-undef */
describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      thread: 'thread-123',
      content: 'this is an comment',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      thread: '123',
      content: true,
      owner: 12345,
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    const payload = {
      thread: 'thread-123',
      content: 'This is my first comment in this super duper excellent thread',
      owner: 'user-123',
    };

    const { thread, content, owner } = new AddComment(payload);

    expect(thread).toEqual(payload.thread);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
