const AuthenticationTokenManager = require('../src/Applications/security/AuthenticationTokenManager');
const container = require('../src/Infrastructures/container');

const TokenTestHelper = {
  async createAccessToken() {
    return container.getInstance(AuthenticationTokenManager.name).createAccessToken({ id: 'user-123', username: 'dico' });
  },
};

module.exports = TokenTestHelper;
