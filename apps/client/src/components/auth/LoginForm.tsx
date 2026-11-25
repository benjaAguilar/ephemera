import { formatErr, RegisterSchema, TTL_OPTIONS, type RegisterType } from '@ephemera/schemas';
import { useState } from 'react';

interface FieldErrors {
  username?: string[];
  ttl?: string[];
}

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [ttl, setTtl] = useState<RegisterType['ttl'] | string>('');
  const [errors, setErrors] = useState<FieldErrors | null>(null);

  function checkInput(username: string, ttl: string) {
    const res = RegisterSchema.safeParse({ username, ttl });

    if (!res.success) {
      const err = formatErr(res.error);
      setErrors(err.fieldErrors);
    }
  }

  return (
    <form>
      <div>
        <label htmlFor="username">Username</label>
        <div>
          {errors?.username?.map((msg, i) => (
            <span key={i}>{msg}</span>
          ))}
        </div>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            checkInput(e.target.value, ttl);
          }}
          required
        />
      </div>
      <div>
        <label htmlFor="ttl">Expiration</label>
        <div>
          {errors?.ttl?.map((msg, i) => (
            <span key={i}>{msg}</span>
          ))}
        </div>
        <select
          name="ttl"
          id="ttl"
          value={ttl}
          onChange={(e) => {
            setTtl(e.target.value);
            checkInput(username, e.target.value);
          }}
        >
          <option value="">Select your expiration date</option>
          {TTL_OPTIONS.map((ttlVal) => {
            return <option value={ttlVal}>{ttlVal}</option>;
          })}
        </select>
      </div>
      <input type="submit" value="Create" />
    </form>
  );
}
