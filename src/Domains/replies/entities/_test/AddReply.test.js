const AddReply = require('../AddReply');
/* eslint-disable no-undef */
describe('a Add Reply entities', () => {
  it('should throw error when payload did not contain needed property, without owner', () => {
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      content: 'this is an comments reply',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      thread: 'thread-123',
      comment: '123',
      content: true,
      owner: 12345,
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create add Reply object correctly', () => {
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      content: 'This is my first reply in this super duper excellent comment',
      owner: 'owner-123',
    };

    // Action
    const {
      thread, comment, content, owner,
    } = new AddReply(payload);

    // Assert
    expect(thread).toEqual(payload.thread);
    expect(comment).toEqual(payload.comment);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
