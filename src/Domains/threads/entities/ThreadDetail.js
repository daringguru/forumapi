/* eslint-disable class-methods-use-this */
const CommentDetail = require('../../comments/entities/CommentDetail');

class ThreadDetail {
  constructor(payload) {
    this.verifyPayload(payload);
    const {
      id, title, body, date, username, comments,
    } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = Array.from(comments).map((comment) => new CommentDetail(comment));
  }

  verifyPayload({
    id, title, body, date, username, comments,
  }) {
    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof username !== 'string' || !(new Date(date) > 0) || !Array.isArray(comments)) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadDetail;
