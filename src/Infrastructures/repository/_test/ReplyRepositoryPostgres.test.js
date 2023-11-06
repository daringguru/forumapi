const pool = require('../../database/postgres/pool');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
/* eslint-disable no-undef */
describe('Reply Repository Postgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('add reply function', () => {
    it('should persist add reply and should return added reply correctly', async () => {
      const addReply = {
        comment: 'comment-123',
        content: 'This is my first reply in this super duper excellent comment',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const addedReply = await replyRepositoryPostgres.addReply(addReply);
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies.id).toEqual('reply-123');
      expect(addedReply).toStrictEqual({
        id: 'reply-123',
        content: 'This is my first reply in this super duper excellent comment',
        owner: 'user-123',
      });
    });
  });

  describe('verify reply id function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReply('reply-xxxx'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply found', async () => {
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyReply('reply-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verify Owner function', () => {
    it('should not throw AuthorizationError when owner', async () => {
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyOwner({ id: 'reply-123', owner: 'user-123' }))
        .resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw AuthorizationError when not owner', async () => {
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(replyRepositoryPostgres.verifyOwner({ id: 'reply-123', owner: 'user-xxxx' }))
        .rejects.toThrowError(AuthorizationError);
    });
  });

  describe('Delete Reply function', () => {
    it('should update reply.is_delete to true', async () => {
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await replyRepositoryPostgres.deleteReply('reply-123');
      const deletedReply = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(deletedReply.is_delete).toEqual(true);
    });
  });

  describe('Get Replies function', () => {
    it('getReplies should return 2 replies ordered ascending correctly', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      const dateRes1 = await RepliesTableTestHelper.addReply({});
      const dateRes2 = await RepliesTableTestHelper.addReply({ id: 'reply-234' });
      const replies = await replyRepositoryPostgres.getReplies('comment-123');
      expect(replies).toHaveLength(2);
      expect(replies).toEqual(
        [
          {
            id: 'reply-123',
            username: 'username dicoding',
            date: dateRes1.date,
            content: 'secret Dicoding Indonesia',
            is_delete: false,
          },
          {
            id: 'reply-234',
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
