export const getStorageItem = (key: string): any =>
  localStorage.getItem(key)

export const removeStorageItem = (key: string) =>
  localStorage.removeItem(key)

export const setStorageItem = (key: string, value: any) =>
  localStorage.setItem(key, value)
