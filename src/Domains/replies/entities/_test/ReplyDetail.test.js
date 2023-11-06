const ReplyDetail = require('../ReplyDetail');
/* eslint-disable no-undef */
describe('a Reply Detail entities', () => {
  it('should throw error when reply payload did not contain needed property, without date', () => {
    const payload = {
      id: 'reply-123',
      content: 'the content',
      username: 'dicoding',
    };
    expect(() => new ReplyDetail(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when reply payload did not meet data type specification, wrong date format', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      content: 'the content',
      date: 'dicoding',
      is_delete: true,
    };
    expect(() => new ReplyDetail(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply Detail object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      content: 'the content',
      date: '2021-08-08T07:22:33.555Z',
      is_delete: false,
    };
    const {
      id, username, content, date,
    } = new ReplyDetail(payload);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
  });

  it('should create Reply Detail object correctly that have different content', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      content: 'the content',
      date: '2021-08-08T07:22:33.555Z',
      is_delete: true,
    };
    const {
      id, username, content, date,
    } = new ReplyDetail(payload);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(date).toEqual(payload.date);
  });
});
