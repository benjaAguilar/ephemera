import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { TTL_OPTIONS } from '@ephemera/schemas';

describe('LoginForm', () => {
  it('renders the form', () => {
    render(<LoginForm />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Select your expiration date')).toBeInTheDocument();

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Expiration')).toBeInTheDocument();

    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('Renders the correct TTL values', () => {
    render(<LoginForm />);

    TTL_OPTIONS.map((opt) => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });

  it('Shows instant error messages', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'sun');

    expect(input).toHaveValue('sun');
    expect(screen.getByText('Username must be at least 4 characters')).toBeInTheDocument();
  });

  it('its possible to select a ttl', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const select = document.getElementById('ttl') as HTMLSelectElement;
    await user.selectOptions(select, '30m');

    expect(select.value).toBe('30m');
  });
});
