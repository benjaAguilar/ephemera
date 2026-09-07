import { useAuth } from '../auth/useAuth';

export function Chats() {
  const { user } = useAuth();

  return (
    <>
      <i>Welcome! {user?.username}</i>
      <h1>Your Chats</h1>
    </>
  );
}
