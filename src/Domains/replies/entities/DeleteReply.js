/* eslint-disable class-methods-use-this */
class DeleteReply {
  constructor(payload) {
    this.verifyPayload(payload);
    const { id, owner } = payload;
    this.id = id;
    this.owner = owner;
  }

  verifyPayload({ id, owner }) {
    if (!id || !owner) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
