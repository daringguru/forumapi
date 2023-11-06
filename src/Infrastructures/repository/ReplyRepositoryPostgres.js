const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addReply(reply) {
    const { comment, content, owner } = reply;
    const id = `reply-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies (id, comment, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, comment, content, owner],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyReply(id) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('id reply tidak ditemukan');
    }
  }

  async verifyOwner({ id, owner }) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda bukan pemilik reply ini');
    }
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this.pool.query(query);
  }

  async getReplies(id) {
    const query = {
      text: 'SELECT replies.id, replies.date, replies.content, replies.is_delete, users.username FROM replies JOIN users ON replies.owner = users.id WHERE replies.comment = $1 ORDER BY replies.date',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
