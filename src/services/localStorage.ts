export const getStorageItem = (key: string): string =>
  localStorage.getItem(key)

export const removeStorageItem = (key: string): void =>
  localStorage.removeItem(key)

export const setStorageItem = (key: string, value: string): void =>
  localStorage.setItem(key, value)
