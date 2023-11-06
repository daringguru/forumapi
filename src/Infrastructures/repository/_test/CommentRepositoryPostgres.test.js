const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
/* eslint-disable no-undef */
describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add Comment and should return added Comment correctly', async () => {
      const addComment = {
        thread: 'thread-123',
        content: 'This is my first comment in this super duper excellent thread',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const addedComment = await commentRepositoryPostgres.addComment(addComment);
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments.id).toEqual('comment-123');
      expect(addedComment).toStrictEqual({
        id: 'comment-123',
        content: 'This is my first comment in this super duper excellent thread',
        owner: 'user-123',
      });
    });
  });

  describe('verify Comment id function', () => {
    it('should throw NotFoundError when Comment not found', async () => {
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyComment('comment-456y6hg'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when Comment found', async () => {
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyComment('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verify Owner function', () => {
    it('should not throw AuthorizationError when owner', async () => {
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyOwner({ id: 'comment-123', owner: 'user-123' }))
        .resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw AuthorizationError when not owner', async () => {
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyOwner({ id: 'comment-123', owner: 'user-123gf' }))
        .rejects.toThrowError(AuthorizationError);
    });
  });

  describe('Delete Comment function', () => {
    it('should update comment.is_delete to true', async () => {
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteComment('comment-123');
      const deletedComment = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(deletedComment.is_delete).toEqual(true);
    });
  });

  describe('Get Comments function', () => {
    it('GetComments should return 2 comments ordered ascending correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      const dateRes1 = await CommentsTableTestHelper.addComment({});
      const dateRes2 = await CommentsTableTestHelper.addComment({ id: 'comment-234' });
      const comments = await commentRepositoryPostgres.getComments('thread-123');
      expect(comments).toHaveLength(2);
      expect(comments).toEqual(
        [
          {
            id: 'comment-123',
            username: 'username dicoding',
            date: dateRes1.date,
            content: 'secret Dicoding Indonesia',
            is_delete: false,
          },
          {
            id: 'comment-234',
            username: 'username dicoding',
            date: dateRes2.date,
            content: 'secret Dicoding Indonesia',
            is_delete: false,
          },
        ],
      );
    });
  });
});
