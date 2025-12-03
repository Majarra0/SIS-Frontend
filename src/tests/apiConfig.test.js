import {
  simulateNetwork,
  paginate,
  filterBySearch,
  nextId,
  normalizeId,
  getMockUserId,
  setMockUserId
} from '../api/apiConfig';

describe('apiConfig helpers', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('simulateNetwork returns a deep clone of the payload', async () => {
    const source = { user: { id: 1 }, list: [1, 2, 3] };
    const result = await simulateNetwork(source, 1);
    expect(result).toEqual(source);
    expect(result).not.toBe(source);
    expect(result.user).not.toBe(source.user);
  });

  it('paginate returns metadata only when pagination params are provided', () => {
    const items = Array.from({ length: 10 }).map((_, index) => ({ id: index + 1 }));
    const paginated = paginate(items, { page: 2, pageSize: 3 });
    expect(paginated.results).toHaveLength(3);
    expect(paginated.page).toBe(2);
    expect(paginated.page_size).toBe(3);

    const allItems = paginate(items);
    expect(allItems).toEqual(items);
  });

  it('filterBySearch matches nested fields case-insensitively', () => {
    const items = [
      { id: 1, student: { name: 'Alice' } },
      { id: 2, student: { name: 'Bob' } }
    ];

    const result = filterBySearch(items, ['student.name'], 'ali');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('nextId returns the next integer id from a list', () => {
    expect(nextId([])).toBe(1);
    expect(nextId([{ id: 4 }, { id: 10 }])).toBe(11);
  });

  it('normalizeId converts numeric strings but preserves other values', () => {
    expect(normalizeId('15')).toBe(15);
    expect(normalizeId('abc')).toBe('abc');
    expect(normalizeId(null)).toBeNull();
  });

  it('getMockUserId and setMockUserId round-trip values from localStorage', () => {
    expect(getMockUserId()).toBeNull();
    setMockUserId(42);
    expect(getMockUserId()).toBe(42);
  });
});
