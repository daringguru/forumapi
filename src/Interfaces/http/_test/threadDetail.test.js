const pool = require('../../../Infrastructures/database/postgres/pool');
const container = require('../../../Infrastructures/container');
const createServer = require('../../../Infrastructures/http/createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
/* eslint-disable no-undef */
describe('/threads/threadId endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  it('should response 404 when threadId not found', async () => {
    await ThreadsTableTestHelper.addThread({});
    const server = await createServer(container);
    const response = await server.inject({
      method: 'GET',
      url: '/threads/thread-xxxx',
    });
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(404);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('id thread tidak ditemukan');
  });

  it('should response 200 and return data', async () => {
    await UsersTableTestHelper.addUser({});
    const threadDate = await ThreadsTableTestHelper.addThread({});
    const comment1Date = await CommentsTableTestHelper.addComment({});
    const comment2Date = await CommentsTableTestHelper.addComment({ id: 'comment-456' });
    await CommentsTableTestHelper.deleteComment('comment-456');
    const reply1Date = await RepliesTableTestHelper.addReply({});
    const reply2Date = await RepliesTableTestHelper.addReply({ id: 'reply-456', comment: 'comment-456' });
    await RepliesTableTestHelper.deleteReply('reply-456');

    const server = await createServer(container);
    const response = await server.inject({
      method: 'GET',
      url: '/threads/thread-123',
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
    const { thread } = responseJson.data;
    expect(thread).toBeDefined();
    const threadRes = {
      id: 'thread-123',
      title: 'secret',
      body: 'Dicoding Indonesia',
      date: threadDate.date,
      username: 'username dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'username dicoding',
          date: comment1Date.date,
          content: 'secret Dicoding Indonesia',
          replies: [
            {
              id: 'reply-123',
              username: 'username dicoding',
              content: 'secret Dicoding Indonesia',
              date: reply1Date.date,
            },
          ],
        },
        {
          id: 'comment-456',
          username: 'username dicoding',
          date: comment2Date.date,
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: 'reply-456',
              username: 'username dicoding',
              content: '**balasan telah dihapus**',
              date: reply2Date.date,
            },
          ],
        },
      ],
    };
    expect(thread).toEqual(JSON.parse(JSON.stringify(threadRes)));
  });
});
