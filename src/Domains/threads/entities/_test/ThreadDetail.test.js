const ThreadDetail = require('../ThreadDetail');
/* eslint-disable no-undef */
describe('a Thread Detail entities', () => {
  it('should throw error when payload did not contain needed property, without comments', () => {
    const payload = {
      id: 'thread-123',
      title: 'thread dicoding',
      body: 'Dicoding is the best',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
    };
    expect(() => new ThreadDetail(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when thread payload did not meet data type specification, comment', () => {
    const payload = {
      id: 'thread-123',
      title: 'thread dicoding',
      body: 'Dicoding is the best',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
      comments: 'ini komentar salah tipe data',
    };
    expect(() => new ThreadDetail(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread detail object', () => {
    const payload = {
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
        },
        {
          id: 'comment-124',
          username: 'dicoding',
          content: 'the content',
          date: '2021-08-08T07:22:33.555Z',
          is_delete: true,
          replies: [
            {
              id: 'reply-125',
              username: 'dicoding',
              content: 'the content',
              date: '2021-08-08T07:22:33.555Z',
              is_delete: true,
            },
            {
              id: 'reply-126',
              username: 'dicoding',
              content: 'the content',
              date: '2021-08-08T07:22:33.555Z',
              is_delete: false,
            },
          ],
        },
      ],
    };
    const {
      id, title, body, date, username, comments,
    } = new ThreadDetail(payload);
    expect(id).toEqual('thread-123');
    expect(title).toEqual('thread dicoding');
    expect(body).toEqual('Dicoding is the best');
    expect(date).toEqual('2021-08-08T07:22:33.555Z');
    expect(username).toEqual('dicoding');
    expect(comments).toHaveLength(2);
    expect(comments[0].id).toEqual('comment-123');
    expect(comments[1].id).toEqual('comment-124');
    expect(comments[0].content).toEqual('the content');
    expect(comments[1].content).toEqual('**komentar telah dihapus**');
    expect(comments[0].replies[0].id).toEqual('reply-123');
    expect(comments[1].replies[0].id).toEqual('reply-125');
    expect(comments[0].replies[1].content).toEqual('**balasan telah dihapus**');
    expect(comments[1].replies[1].content).toEqual('the content');
  });
});
