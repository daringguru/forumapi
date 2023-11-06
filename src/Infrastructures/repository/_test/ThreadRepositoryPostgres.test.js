const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
/* eslint-disable no-undef */
describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and should return added thread correctly', async () => {
      const addThread = {
        title: 'dicoding',
        body: 'dicoding is the best',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const addedThread = await threadRepositoryPostgres.addThread(addThread);
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual({
        id: 'thread-123',
        title: 'dicoding',
        owner: 'user-123',
      });
    });
  });

  describe('verify Thread id function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyThread('thread-xxxx'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyThread('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('get Thread function', () => {
    it('should return thread correctly', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      const dateRes = await ThreadsTableTestHelper.addThread({});
      const threadDetail = await threadRepositoryPostgres.getThread('thread-123');
      expect(threadDetail).toStrictEqual({
        id: 'thread-123',
        title: 'secret',
        body: 'Dicoding Indonesia',
        date: dateRes.date,
        username: 'username dicoding',
      });
    });

    it('should throw NotFoundError when thread id not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadDetailPromise = threadRepositoryPostgres.getThread('thread-xxxx');
      await expect(threadDetailPromise)
        .rejects.toThrowError(NotFoundError);
    });
  });
});
