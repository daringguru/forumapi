const DeleteReply = require('../DeleteReply');
/* eslint-disable no-undef */
describe('a Delete Reply entities', () => {
  it('should throw error when payload did not contain needed property, without owner', () => {
    const payload = {
      id: 'reply-123',
    };

    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification, owner not a string', () => {
    const payload = {
      id: 'reply-123',
      owner: 12345,
    };

    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Delete Reply object correctly', () => {
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
    };

    const { id, owner } = new DeleteReply(payload);

    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
  });
});
