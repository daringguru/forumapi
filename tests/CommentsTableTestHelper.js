/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', thread = 'thread-123', owner = 'user-123', content = 'secret Dicoding Indonesia',
  }) {
    const query = {
      text: 'INSERT INTO comments (id, thread, owner, content) VALUES($1, $2, $3, $4) RETURNING date',
      values: [id, thread, owner, content],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
