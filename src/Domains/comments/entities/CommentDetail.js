/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const ReplyDetail = require('../../replies/entities/ReplyDetail');

class CommentDetail {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id, username, date, content, is_delete, replies,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.replies = Array.from(replies).map((reply) => new ReplyDetail(reply));
  }

  verifyPayload({
    id, username, date, content, is_delete, replies,
  }) {
    if (!id || !username || !date || !content || !{ is_delete } || !replies) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || !(new Date(date) > 0) || typeof is_delete !== 'boolean' || !Array.isArray(replies)) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentDetail;
