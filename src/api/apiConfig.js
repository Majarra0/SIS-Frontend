const modeFromEnv = (import.meta.env?.VITE_API_MODE || '').toLowerCase();
const useMocksFlag = (import.meta.env?.VITE_USE_MOCKS || '').toLowerCase() === 'true';

export const API_MODE = modeFromEnv || (useMocksFlag ? 'mock' : 'real');
export const isMockMode = API_MODE === 'mock';

export const simulateNetwork = async (payload, delay = 200) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  try {
    return structuredClone(payload);
  } catch (_err) {
    return JSON.parse(JSON.stringify(payload));
  }
};

export const paginate = (items = [], params = {}) => {
  const page = Number(params.page) || 1;
  const pageSize = Number(params.page_size || params.pageSize) || items.length || 1;
  const start = (page - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  if (params.page || params.page_size || params.pageSize) {
    return {
      results: paginatedItems,
      count: items.length,
      page,
      page_size: pageSize
    };
  }

  return items;
};

export const filterBySearch = (items = [], fields = [], term = '') => {
  if (!term) return items;
  const lowered = term.toLowerCase();
  return items.filter(item =>
    fields.some(field => {
      const value = field.split('.').reduce((acc, key) => acc?.[key], item);
      return typeof value === 'string' && value.toLowerCase().includes(lowered);
    })
  );
};

export const nextId = (list = []) => {
  const ids = list.map(item => item.id).filter(Boolean);
  return ids.length ? Math.max(...ids) + 1 : 1;
};

export const normalizeId = (value) => {
  if (value === null || value === undefined) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
};

export const getMockUserId = () => {
  const stored = localStorage.getItem('mock_user_id');
  return stored ? Number(stored) : null;
};

export const setMockUserId = (id) => {
  localStorage.setItem('mock_user_id', String(id));
};
