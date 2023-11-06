/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
class ReplyDetail {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id, username, date, content, is_delete,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**balasan telah dihapus**' : content;
  }

  verifyPayload({
    id, username, date, content, is_delete,
  }) {
    if (!id || !username || !date || !content || !{ is_delete }) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || !(new Date(date) > 0) || typeof is_delete !== 'boolean') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyDetail;
