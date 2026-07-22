import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Counter } from './Counter';

describe('Counter', () => {
  it('renders the initial count', () => {
    render(<Counter />);

    expect(screen.getByText('Count is 0')).toBeInTheDocument();
  });
});
