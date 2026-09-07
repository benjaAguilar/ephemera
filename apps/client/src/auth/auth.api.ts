export async function getCurrentUser() {
  const res = await fetch('/api/auth/session', {
    credentials: 'include',
  });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error('Failed to fetch the current user');
  }

  return res.json();
}
