import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UpcomingTrips from '../components/UpcomingTrips';
import BookingPage from '../components/BookingPage';
import App from '../App';

describe('Adversarial Group Departure & Resiliency Stress Tests', () => {
  const mockPackages = [
    {
      id: 'pkg-golden',
      name: 'Golden Triangle Heritage',
      region: 'India',
      duration: '6 Days / 5 Nights',
      price: 50000,
      basePrice: 50000,
      slots: { total: 20, booked: 5 },
      highlights: ['Taj Mahal', 'Jaipur Fort'],
      inclusions: ['Hotels', 'Transfers'],
      exclusions: ['Flights'],
      itinerary: [
        { day: 1, title: 'Arrival Delhi', desc: 'Welcome' },
        { day: 2, title: 'Delhi to Agra', desc: 'Taj Mahal at sunset' }
      ]
    },
    {
      id: 'pkg-kyoto',
      name: 'Kyoto Zen Explorer',
      region: 'Asia',
      duration: '5 Days',
      price: 80000,
      basePrice: 80000,
      isBespoke: true
    }
  ];

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
      if (url.includes('/api/group-departures')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      if (url.includes('/api/packages')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPackages) });
      }
      if (url.includes('/api/testimonials') || url.includes('/api/corporate-packages') || url.includes('/api/speciality-categories')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      if (url.includes('/api/settings') || url.includes('/api/stats') || url.includes('/api/weather')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Slot Edge Cases & Malformed Slot Objects', () => {
    it('handles completely undefined slots and flat fallback fields gracefully', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-no-slots',
                packageId: 'pkg-golden',
                packageName: 'Golden Triangle Heritage',
                departureDate: '2026-11-01T00:00:00Z',
                status: 'scheduled',
                priceModifier: 0
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={vi.fn()} />);
      });

      expect(await screen.findByText(/20 \/ 20 spots/i)).toBeInTheDocument();
      const bookBtn = screen.getByRole('button', { name: /^Book$/i });
      expect(bookBtn).not.toBeDisabled();
    });

    it('handles zero slots (total: 0) and marks trip as Full and disables Book button', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-zero-slots',
                packageId: 'pkg-golden',
                packageName: 'Golden Triangle Heritage',
                departureDate: '2026-11-01T00:00:00Z',
                slots: { total: 0, booked: 0 },
                status: 'scheduled',
                priceModifier: 0
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={vi.fn()} />);
      });

      const fullButtons = await screen.findAllByRole('button', { name: /^Full$/i });
      expect(fullButtons.length).toBeGreaterThan(0);
      expect(fullButtons[0]).toBeDisabled();
    });

    it('handles overbooked departures (booked > total) without negative crashing', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-overbooked',
                packageId: 'pkg-golden',
                packageName: 'Golden Triangle Heritage',
                departureDate: '2026-11-01T00:00:00Z',
                slots: { total: 10, booked: 12 },
                status: 'scheduled',
                priceModifier: 0
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={vi.fn()} />);
      });

      const bookBtn = await screen.findByRole('button', { name: /^Full$/i });
      expect(bookBtn).toBeDisabled();
    });

    it('triggers "Almost full!" badge when spots left is <= 5 and > 0', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-almost-full',
                packageId: 'pkg-golden',
                packageName: 'Golden Triangle Heritage',
                departureDate: '2026-11-01T00:00:00Z',
                slots: { total: 10, booked: 8 }, // 2 left
                status: 'scheduled',
                priceModifier: 0
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={vi.fn()} />);
      });

      expect(await screen.findByText(/Almost full!/i)).toBeInTheDocument();
      expect(screen.getByText(/2 \/ 10 spots/i)).toBeInTheDocument();
    });
  });

  describe('2. Missing PackageId / Orphan Departures', () => {
    it('handles orphan departures where packageId is null without crashing packageCount or booking', async () => {
      const handleBook = vi.fn();
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-orphan',
                packageId: null,
                title: 'Secret Himalayan Trek',
                packageName: 'Himalayan Expedition',
                packageRegion: 'Nepal',
                packageDuration: '8 Days',
                packageBasePrice: 65000,
                priceModifier: 2000,
                departureDate: '2026-12-01T00:00:00Z',
                returnDate: '2026-12-08T00:00:00Z',
                slots: { total: 12, booked: 2 },
                status: 'scheduled',
                itinerary: [{ day: 1, title: 'Kathmandu Base', desc: 'Acclimatization' }]
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={handleBook} />);
      });

      expect(await screen.findByText(/Himalayan Expedition/i)).toBeInTheDocument();
      // Packages available stat should safely be 0 since packageId is null
      expect(screen.getByText('0')).toBeInTheDocument();

      // Click book on orphan departure — alert should fire since packageId is null
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const bookBtn = screen.getByRole('button', { name: /^Book$/i });
      fireEvent.click(bookBtn);

      expect(alertSpy).toHaveBeenCalledWith(expect.stringMatching(/missing/i));
      expect(handleBook).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });
  });

  describe('3. Edge Dates, Missing returnDate, and Date Formatting', () => {
    it('handles null returnDate, leap years (Feb 29), and invalid date strings safely', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-leap',
                packageId: 'pkg-golden',
                packageName: 'Leap Year Special',
                departureDate: '2028-02-29T00:00:00Z',
                returnDate: null,
                slots: { total: 10, booked: 1 },
                status: 'scheduled',
                priceModifier: 0
              },
              {
                id: 'dep-invalid-date',
                packageId: 'pkg-golden',
                packageName: 'Malformed Date Trip',
                departureDate: 'gibberish-date',
                returnDate: '',
                slots: { total: 10, booked: 1 },
                status: 'confirmed',
                priceModifier: 0
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={vi.fn()} />);
      });

      // Feb 29 2028 leap date should format cleanly in UTC without crashing
      expect(await screen.findByText(/Feb 29, 2028/i)).toBeInTheDocument();

      // Invalid date string should safely fallback to verbatim string without "Invalid Date"
      expect(screen.getByText(/gibberish-date/i)).toBeInTheDocument();
      expect(screen.queryByText(/Invalid Date/i)).not.toBeInTheDocument();
    });
  });

  describe('4. Itinerary Modal and Keyboard/DOM Lifecycle', () => {
    it('locks body scroll on modal open, closes on Escape key, and unlocks body scroll', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-itinerary-modal',
                packageId: 'pkg-golden',
                packageName: 'Golden Triangle Heritage',
                departureDate: '2026-10-15T00:00:00Z',
                returnDate: '2026-10-20T00:00:00Z',
                slots: { total: 20, booked: 5 },
                status: 'scheduled',
                priceModifier: 1500,
                notes: 'Please bring valid government photo ID for monument entry.',
                itinerary: [
                  { day: 1, title: 'Arrival Delhi', desc: 'Welcome dinner' },
                  { day: 2, title: 'Agra City Tour', desc: 'Visit Taj Mahal' }
                ]
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={vi.fn()} />);
      });

      const itineraryBtn = await screen.findByRole('button', { name: /Itinerary/i });
      fireEvent.click(itineraryBtn);

      // Modal open -> body scroll locked
      expect(document.body.style.overflow).toBe('hidden');
      expect(screen.getByText(/Day-by-Day Schedule/i)).toBeInTheDocument();
      expect(screen.getByText(/Please bring valid government photo ID/i)).toBeInTheDocument();

      // Press Escape key
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

      // Modal closed -> body scroll unlocked
      expect(document.body.style.overflow).toBe('');
      expect(screen.queryByText(/Day-by-Day Schedule/i)).not.toBeInTheDocument();
    });
  });

  describe('5. Status Filtering Behavior', () => {
    it('filters between All, Scheduled, Confirmed and excludes Cancelled from All', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              { id: 'd1', packageName: 'Trip S1', status: 'scheduled', departureDate: '2026-10-01T00:00:00Z' },
              { id: 'd2', packageName: 'Trip C1', status: 'confirmed', departureDate: '2026-10-02T00:00:00Z' },
              { id: 'd3', packageName: 'Trip X1', status: 'cancelled', departureDate: '2026-10-03T00:00:00Z' }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={vi.fn()} />);
      });

      // In All tab, cancelled should NOT be visible
      expect(await screen.findByText('Trip S1')).toBeInTheDocument();
      expect(screen.getByText('Trip C1')).toBeInTheDocument();
      expect(screen.queryByText('Trip X1')).not.toBeInTheDocument();

      // Switch to Confirmed
      fireEvent.click(screen.getByRole('button', { name: /^Confirmed$/i }));
      expect(screen.queryByText('Trip S1')).not.toBeInTheDocument();
      expect(screen.getByText('Trip C1')).toBeInTheDocument();

      // Switch to Scheduled
      fireEvent.click(screen.getByRole('button', { name: /^Scheduled$/i }));
      expect(screen.getByText('Trip S1')).toBeInTheDocument();
      expect(screen.queryByText('Trip C1')).not.toBeInTheDocument();
    });
  });

  describe('6. Deep Link & Browser History Popstate Resiliency in App.jsx', () => {
    it('restores group departure state (departureId, departureDate, returnDate, priceModifier) across popstate', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPackages) });
        }
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        if (url.includes('/api/testimonials') || url.includes('/api/corporate-packages') || url.includes('/api/speciality-categories')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        if (url.includes('/api/settings') || url.includes('/api/stats') || url.includes('/api/weather')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<App />);
      });

      // Simulate popstate navigation back to booking page with group departure metadata
      await act(async () => {
        const state = {
          page: 'booking',
          pkgId: 'pkg-golden',
          departureId: 'dep-deep-link-101',
          departureDate: '2026-11-20',
          returnDate: '2026-11-26',
          priceModifier: 3500,
          region: 'India',
          search: ''
        };
        window.history.pushState(state, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate', { state }));
      });

      // Verify BookingPage is rendered with selected group departure details
      expect(await screen.findByText(/Golden Triangle Heritage/i)).toBeInTheDocument();
      expect(screen.getByText(/20\/11\/2026 → 26\/11\/2026/i)).toBeInTheDocument();

      // Submit form and verify priceModifier is reflected in payload and confirmation screen
      fireEvent.change(screen.getByPlaceholderText(/e\.g\. Jane Doe/i), { target: { value: 'Alice Smith' } });
      fireEvent.change(screen.getByPlaceholderText(/jane@example\.com/i), { target: { value: 'alice@example.com' } });
      const phoneInput = document.getElementById('bk-phone');
      fireEvent.change(phoneInput, { target: { value: '2025550188' } });

      let postPayload = null;
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url, options) => {
        if (url.includes('/api/bookings/inquiry')) {
          postPayload = JSON.parse(options.body);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Success', booking: { id: 99 } })
          });
        }
        if (url.includes('/api/corporate-packages') || url.includes('/api/testimonials')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }));

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));
      });

      expect(postPayload).toEqual(expect.objectContaining({
        departureId: 'dep-deep-link-101',
        startDate: '2026-11-20',
        endDate: '2026-11-26'
      }));
      expect(postPayload).not.toHaveProperty('priceModifier');

      expect(await screen.findByText(/Inquiry Received/i)).toBeInTheDocument();
      expect(screen.getByText(/\+₹3,500 \/ guest/i)).toBeInTheDocument();
      expect(screen.getByText(/Scheduled Group Departure/i)).toBeInTheDocument();
      // Est total: (50000 + 3500) * 2 = 107,000
      expect(screen.getByText(/₹1,07,000/i)).toBeInTheDocument();
    });
  });

  describe('7. Negative Price Modifier / Discount Handling', () => {
    it('correctly displays discount modifier (-₹2,000 / guest) and factors into total', async () => {
      const selectedPkg = {
        id: 'pkg-golden',
        name: 'Golden Triangle Heritage',
        duration: '6 Days',
        price: 50000,
        basePrice: 50000,
        departureId: 'dep-discount',
        departureDate: '2026-12-10',
        returnDate: '2026-12-16',
        priceModifier: -2000
      };

      await act(async () => {
        render(<BookingPage packages={[selectedPkg]} selectedPackage={selectedPkg} />);
      });

      fireEvent.change(screen.getByPlaceholderText(/e\.g\. Jane Doe/i), { target: { value: 'Bob Ross' } });
      fireEvent.change(screen.getByPlaceholderText(/jane@example\.com/i), { target: { value: 'bob@example.com' } });
      const phoneInput = document.getElementById('bk-phone');
      fireEvent.change(phoneInput, { target: { value: '2025550177' } });

      let postPayload = null;
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url, options) => {
        if (url.includes('/api/bookings/inquiry')) {
          postPayload = JSON.parse(options.body);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Success' })
          });
        }
        if (url.includes('/api/corporate-packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }));

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));
      });

      expect(postPayload).not.toHaveProperty('priceModifier');
      expect(await screen.findByText(/Inquiry Received/i)).toBeInTheDocument();
      expect(screen.getByText(/₹-2,000 \/ guest/i)).toBeInTheDocument();
      // Est total: (50000 - 2000) * 2 = 96,000
      expect(screen.getByText(/₹96,000/i)).toBeInTheDocument();
    });
  });
});
