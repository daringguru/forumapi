const AddedReply = require('../AddedReply');
/* eslint-disable no-undef */
describe('a Added Reply entities', () => {
  it('should throw error when payload did not contain needed property, without owner', () => {
    const payload = {
      id: 'reply-123',
      content: 'dicoding',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification, wrong id', () => {
    const payload = {
      id: 123,
      content: 'dicoding',
      owner: 'user-123',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Added Reply object correctly', () => {
    const payload = {
      id: 'user-123',
      content: 'dicoding',
      owner: 'owner-123',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
