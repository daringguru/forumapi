/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {

  async addReply({
    id = 'reply-123', comment = 'comment-123', owner = 'user-123', content = 'secret Dicoding Indonesia',
  }) {
    const query = {
      text: 'INSERT INTO replies (id, comment, owner, content) VALUES($1, $2, $3, $4) RETURNING date',
      values: [id, comment, owner, content],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
