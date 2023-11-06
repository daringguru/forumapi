const CommentDetail = require('../CommentDetail');
/* eslint-disable no-undef */
describe('a Comment Detail entities', () => {
  it('should throw error when comment  payload did not contain needed property, without replies', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'the content',
      date: '2021-08-08T07:22:33.555Z',
      is_delete: true,
    };
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when comment array  payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'the content',
      date: 'dicoding', // string, but wrong date format
      is_delete: true,
      replies: [],
    };
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment Detail object correctly that have deleted content', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'the content',
      date: '2021-08-08T07:22:33.555Z',
      is_delete: true,
      replies: [
        {
          id: 'reply-123',
          username: 'dicoding',
          content: 'the content',
          date: '2021-08-08T07:22:33.555Z',
          is_delete: true,
        },
      ],
    };
    const {
      id, username, content, date, replies,
    } = new CommentDetail(payload);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(date).toEqual(payload.date);
    expect(replies).toHaveLength(1);
    expect(replies[0].content).toEqual('**balasan telah dihapus**');
  });

  it('should create Comment Detail object correctly with replies', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'the content',
      date: '2021-08-08T07:22:33.555Z',
      is_delete: false,
      replies: [
        {
          id: 'reply-123',
          username: 'dicoding',
          content: 'the content',
          date: '2021-08-08T07:22:33.555Z',
          is_delete: false,
        },
        {
          id: 'reply-124',
          username: 'dicoding',
          content: 'the content',
          date: '2021-08-08T07:22:33.555Z',
          is_delete: true,
        },
      ],
    };
    const {
      id, username, content, date, replies,
    } = new CommentDetail(payload);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(replies).toHaveLength(2);
    expect(replies[0].content).toEqual('the content');
    expect(replies[1].content).toEqual('**balasan telah dihapus**');
  });
});
