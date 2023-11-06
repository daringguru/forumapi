const pool = require('../../../Infrastructures/database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const TokenTestHelper = require('../../../../tests/TokenTestHelper');
const container = require('../../../Infrastructures/container');
const createServer = require('../../../Infrastructures/http/createServer');
/* eslint-disable no-undef */
describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  it('should response 401 when request without authentication', async () => {
    // Arrange
    const requestPayload = {
      title: 'dicoding',
      body: 'dicoding is the best',
    };

    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(401);
    expect(responseJson.message).toEqual('Missing authentication');
  });

  it('should response 400 when payload not contain needed property', async () => {
    // Arrange
    const requestPayload = {
      title: 'dicoding',
    };

    const accessToken = await TokenTestHelper.createAccessToken();
    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
  });

  it('should response 201 and persisted thread', async () => {
    // Arrange
    const requestPayload = {
      title: 'dicoding',
      body: 'dicoding is the best',
    };
    const accessToken = await TokenTestHelper.createAccessToken();
    // eslint-disable-next-line no-undef
    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedThread).toBeDefined();
  });
});
