import { users } from './data';
import { DummyServer } from './dummy-server';

describe('DummyServer', () => {
  const server = new DummyServer();

  it('should return first page', () => {
    const fetched = server.getUsers({searchTerm: '', requestedPage: 0, pageSize: 10});
    expect(fetched.length).toBe(10);
    expect(fetched).toEqual(users.filter((u, index) => index >= 0 && index < 10));
  });

  it('should return second page', () => {
    const fetched = server.getUsers({searchTerm: '', requestedPage: 1, pageSize: 10});
    expect(fetched.length).toBe(10);
    expect(fetched).toEqual(users.filter((u, index) => index >= 100 && index < 110));
  });
});
