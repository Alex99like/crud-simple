export const MessageErr = {
  isNotValidID: (parameter: string) => ({ error: `this Id: ${parameter} is not valid` }),
  isNotUserID: (parameter: string) => ({ error: `there is no user with this id: ${parameter}` }),
  failed: (method: 'create' | 'update') => ({ error: `failed to ${method} user` }),
  notFound: { error: 'Not Found' },
  notID: { message: `id not specified` },
}