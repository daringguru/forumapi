const AddThread = require('../AddThread');
/* eslint-disable no-undef */
describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property, without owner', () => {
    const payload = {
      title: 'abc',
      body: 'body body',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification, wrong body and owner', () => {
    const payload = {
      title: '123',
      body: true,
      owner: 12345,
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    const payload = {
      title: 'dicoding forum',
      body: 'This is my first thread in this super duper excellent forum',
      owner: 'user-123',
    };

    const { title, body, owner } = new AddThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
