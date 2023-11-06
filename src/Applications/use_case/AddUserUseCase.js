const RegisterUser = require('../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this.userRepository = userRepository;
    this.passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this.userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this.passwordHash.hash(registerUser.password);
    const registeredUser = await this.userRepository.addUser(registerUser);
    return new RegisteredUser(registeredUser);
  }
}

module.exports = AddUserUseCase;
