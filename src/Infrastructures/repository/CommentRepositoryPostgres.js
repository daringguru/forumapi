const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { thread, content, owner } = addComment;
    const id = `comment-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments(id, thread, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, thread, content, owner],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyComment(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('id comment tidak ditemukan');
    }
  }

  async verifyOwner({ id, owner }) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda bukan pemilik comment ini');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this.pool.query(query);
  }

  async getComments(id) {
    const query = {
      text: 'SELECT comments.id, comments.date, comments.content, comments.is_delete, users.username FROM comments JOIN users ON comments.owner = users.id WHERE comments.thread = $1 ORDER BY comments.date',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
