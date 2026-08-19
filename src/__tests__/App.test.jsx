/* global global */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

describe('Customer Site App Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/settings')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });
  });

  it('renders the brand navigation title', async () => {
    render(<App />);
    const brandElements = await screen.findAllByText(/KRAFT/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });
});
