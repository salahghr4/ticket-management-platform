const storage = () => {
  const set = (key: string, value: unknown) => {
    try {
      if (typeof value === "object") {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, String(value));
      }
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`);
    }
  };

  const get = <T = unknown>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      try {
        // Attempt to parse as JSON
        return JSON.parse(item) as T;
      } catch {
        // If parsing fails, return as is
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error retrieving from localStorage: ${error}`);
      return null;
    }
  };

  const remove = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
    }
  };

  const clear = () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  };

  return { set, get, remove, clear };
};

const { set, get, remove, clear } = storage();

export default { set, get, remove, clear };
