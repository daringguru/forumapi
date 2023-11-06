const pool = require('../../../Infrastructures/database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const TokenTestHelper = require('../../../../tests/TokenTestHelper');
const container = require('../../../Infrastructures/container');
const createServer = require('../../../Infrastructures/http/createServer');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
/* eslint-disable no-undef */
describe('replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    it('should response 401 when request without authentication', async () => {
      const requestPayload = {
        content: 'dicoding is the best',
      };
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when payload not contain needed property', async () => {
      const requestPayload = {
        title: 'true',
      };
      const accessToken = await TokenTestHelper.createAccessToken();
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 404 when thread id not found', async () => {
      const requestPayload = {
        content: 'dicoding is the best',
      };
      await ThreadsTableTestHelper.addThread({});
      const accessToken = await TokenTestHelper.createAccessToken();
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-xxxx/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('id thread tidak ditemukan');
    });

    it('should response 404 when comment id not found', async () => {
      const requestPayload = {
        content: 'dicoding is the best',
      };
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const accessToken = await TokenTestHelper.createAccessToken();
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-xxxx/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('id comment tidak ditemukan');
    });

    it('should response 201 and persisted reply', async () => {
      const requestPayload = {
        content: 'dicoding is the best',
      };
      const accessToken = await TokenTestHelper.createAccessToken();
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId} endpoint', () => {
    it('should response 401 when delete without authentication', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when reply id not found', async () => {
      const accessToken = await TokenTestHelper.createAccessToken();
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-xxxx',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('id reply tidak ditemukan');
    });

    it('should response 200 and delete reply', async () => {
      const accessToken = await TokenTestHelper.createAccessToken();
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
