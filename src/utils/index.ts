export const genUserName = (): string => {
  const usernameprefix = 'user-';
  const randomChars = Math.random().toFixed(36).slice(2);

  const username = usernameprefix + randomChars;

  return username;
};
