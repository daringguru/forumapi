const AddThread = require('../../Domains/threads/entities/AddThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new AddThread(useCasePayload);
    const addedThread = await this.threadRepository.addThread(newThread);
    return new AddedThread(addedThread);
  }
}

module.exports = AddThreadUseCase;
