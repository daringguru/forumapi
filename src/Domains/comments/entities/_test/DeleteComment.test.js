const DeleteComment = require('../DeleteComment');
/* eslint-disable no-undef */
describe('a Delete Comment entities', () => {
  it('should throw error when payload did not contain needed property, without owner', () => {
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
    };

    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification, wrong owner', () => {
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 12345,
    };

    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const { id, threadId, owner } = new DeleteComment(payload);

    expect(id).toEqual(payload.id);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
