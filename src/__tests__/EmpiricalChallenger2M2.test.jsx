import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UpcomingTrips from '../components/UpcomingTrips';
import BookingPage from '../components/BookingPage';
import App from '../App';

describe('Empirical Challenger 2 - Milestone 2 In-Depth Verification', () => {
  const samplePackages = [
    {
      id: 'pkg-alps',
      name: 'Swiss Alps Expedition',
      region: 'Europe',
      duration: '7 Days',
      price: 150000,
      basePrice: 150000,
      slots: { total: 16, booked: 4 },
      itinerary: [
        { day: 1, title: 'Zurich Arrival', desc: 'Hotel check-in and briefing' },
        { day: 2, title: 'Lucerne & Mount Pilatus', desc: 'Cogwheel train ascent' }
      ]
    },
    {
      id: 'pkg-desert',
      name: 'Sahara Luxury Dunes',
      region: 'Africa',
      duration: '5 Days',
      price: 90000,
      basePrice: 90000,
      slots: undefined,
      slotsTotal: 10,
      slotsBooked: 1,
      itinerary: [] // empty package itinerary
    }
  ];

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
      if (url.includes('/api/group-departures')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      if (url.includes('/api/packages')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(samplePackages) });
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

  describe('1. Itinerary Hierarchy & Modal Controls in UpcomingTrips', () => {
    it('uses departure-level itinerary when present, overriding package itinerary', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-override',
                packageId: 'pkg-alps',
                packageName: 'Swiss Alps Expedition',
                title: 'Winter Ski Special',
                departureDate: '2026-12-15T00:00:00Z',
                returnDate: '2026-12-22T00:00:00Z',
                slots: { total: 12, booked: 2 },
                status: 'scheduled',
                priceModifier: 10000,
                itinerary: [
                  { day: 1, title: 'Geneva Ski Arrival', desc: 'Transfer to Zermatt chalets' },
                  { day: 2, title: 'Matterhorn Glacier Skiing', desc: 'Full day private ski instructor' },
                  { day: 3, title: 'Fondue & Spa', desc: 'Evening alpine bath' }
                ]
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(samplePackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={vi.fn()} />);
      });

      // Departure has 3-day custom itinerary
      expect(await screen.findByText(/3 Days Itinerary/i)).toBeInTheDocument();

      const itineraryBtn = screen.getByRole('button', { name: /Itinerary/i });
      fireEvent.click(itineraryBtn);

      // Verify custom departure itinerary items rendered in modal
      expect(screen.getByText(/Geneva Ski Arrival/i)).toBeInTheDocument();
      expect(screen.getByText(/Matterhorn Glacier Skiing/i)).toBeInTheDocument();
      expect(screen.getByText(/Fondue & Spa/i)).toBeInTheDocument();
      // Should NOT render package-level itinerary
      expect(screen.queryByText(/Lucerne & Mount Pilatus/i)).not.toBeInTheDocument();
    });

    it('falls back to package-level itinerary when departure has no itinerary array', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-fallback',
                packageId: 'pkg-alps',
                packageName: 'Swiss Alps Expedition',
                departureDate: '2026-12-15T00:00:00Z',
                slots: { total: 12, booked: 2 },
                status: 'scheduled',
                priceModifier: 0,
                itinerary: null // null departure itinerary
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(samplePackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={vi.fn()} />);
      });

      // Package has 2-day itinerary
      expect(await screen.findByText(/2 Days Itinerary/i)).toBeInTheDocument();

      const itineraryBtn = screen.getByRole('button', { name: /Itinerary/i });
      fireEvent.click(itineraryBtn);

      // Verify package-level itinerary items rendered in modal
      expect(screen.getByText(/Zurich Arrival/i)).toBeInTheDocument();
      expect(screen.getByText(/Lucerne & Mount Pilatus/i)).toBeInTheDocument();
    });

    it('omits itinerary badge and button completely when neither departure nor package has itinerary', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-no-itin',
                packageId: 'pkg-desert',
                packageName: 'Sahara Luxury Dunes',
                departureDate: '2026-11-05T00:00:00Z',
                slots: { total: 10, booked: 1 },
                status: 'scheduled',
                priceModifier: 0,
                itinerary: [] // empty
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(samplePackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={vi.fn()} />);
      });

      expect(await screen.findByText(/Sahara Luxury Dunes/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Itinerary/i })).not.toBeInTheDocument();
      expect(screen.queryByText(/Days Itinerary/i)).not.toBeInTheDocument();
    });

    it('modal "Book This Departure" button closes modal and invokes onBook callback with complete payload', async () => {
      const handleBook = vi.fn();
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-modal-book',
                packageId: 'pkg-alps',
                packageName: 'Swiss Alps Expedition',
                departureDate: '2026-10-10T00:00:00Z',
                returnDate: '2026-10-17T00:00:00Z',
                slots: { total: 10, booked: 3 },
                status: 'scheduled',
                priceModifier: 5000,
                itinerary: [{ day: 1, title: 'Arrival', desc: 'Day 1' }]
              }
            ])
          });
        }
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(samplePackages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }));

      await act(async () => {
        render(<UpcomingTrips onBook={handleBook} />);
      });

      const itineraryBtn = await screen.findByRole('button', { name: /Itinerary/i });
      fireEvent.click(itineraryBtn);

      const modalBookBtn = screen.getByRole('button', { name: /Book This Departure/i });
      fireEvent.click(modalBookBtn);

      // Verify modal is closed
      expect(screen.queryByText(/Day-by-Day Schedule/i)).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('');

      // Verify onBook invoked
      expect(handleBook).toHaveBeenCalledWith(expect.objectContaining({
        id: 'pkg-alps',
        name: 'Swiss Alps Expedition',
        departureId: 'dep-modal-book',
        departureDate: '2026-10-10',
        returnDate: '2026-10-17',
        priceModifier: 5000
      }));
    });
  });

  describe('2. Booking Inquiry Guest Stepper & Group Members Sync', () => {
    it('synchronizes group member preferences when guests count increases and decreases', async () => {
      const selectedPkg = {
        id: 'pkg-alps',
        name: 'Swiss Alps Expedition',
        duration: '7 Days',
        region: 'Europe',
        price: 150000,
        departureId: 'dep-stepper-1',
        departureDate: '2026-10-10',
        returnDate: '2026-10-17',
        priceModifier: 0
      };

      await act(async () => {
        render(<BookingPage packages={[selectedPkg]} selectedPackage={selectedPkg} />);
      });

      // Initial count: 2 guests
      expect(screen.getByText('2 Guests')).toBeInTheDocument();

      // Open preferences section
      fireEvent.click(screen.getByText(/Add special requests or notes/i));
      expect(screen.getByText(/Guest Preferences \(2\)/i)).toBeInTheDocument();

      // Increment guests to 4
      const plusBtn = screen.getAllByRole('button').find(b => b.querySelector('svg.lucide-plus'));
      fireEvent.click(plusBtn);
      fireEvent.click(plusBtn);

      expect(screen.getByText('4 Guests')).toBeInTheDocument();
      expect(screen.getByText(/Guest Preferences \(4\)/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. Guest 3')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. Guest 4')).toBeInTheDocument();

      // Decrement guests back to 3
      const minusBtn = screen.getAllByRole('button').find(b => b.querySelector('svg.lucide-minus'));
      fireEvent.click(minusBtn);

      expect(screen.getByText('3 Guests')).toBeInTheDocument();
      expect(screen.getByText(/Guest Preferences \(3\)/i)).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('e.g. Guest 4')).not.toBeInTheDocument();
    });
  });

  describe('3. BookingPage API Error Resiliency', () => {
    it('gracefully handles backend HTTP 400 error response with descriptive message in toast and banner', async () => {
      const selectedPkg = {
        id: 'pkg-alps',
        name: 'Swiss Alps Expedition',
        price: 150000,
        departureId: 'dep-err-1',
        departureDate: '2026-10-10',
        returnDate: '2026-10-17',
        priceModifier: 0
      };

      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/bookings/inquiry')) {
          return Promise.resolve({
            ok: false,
            status: 400,
            json: () => Promise.resolve({ error: 'This group departure is fully booked. Please choose another date.' })
          });
        }
        if (url.includes('/api/corporate-packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }));

      await act(async () => {
        render(<BookingPage packages={[selectedPkg]} selectedPackage={selectedPkg} />);
      });

      fireEvent.change(screen.getByPlaceholderText(/e\.g\. Jane Doe/i), { target: { value: 'John Smith' } });
      fireEvent.change(screen.getByPlaceholderText(/jane@example\.com/i), { target: { value: 'john@example.com' } });
      const phoneInput = document.getElementById('bk-phone');
      fireEvent.change(phoneInput, { target: { value: '2025550133' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));
      });

      const errorElements = await screen.findAllByText(/This group departure is fully booked/i);
      expect(errorElements.length).toBeGreaterThan(0);
      expect(screen.queryByText(/Inquiry Received/i)).not.toBeInTheDocument();
    });

    it('gracefully handles network failure without throwing unhandled exception', async () => {
      const selectedPkg = {
        id: 'pkg-alps',
        name: 'Swiss Alps Expedition',
        price: 150000,
        departureId: 'dep-net-err',
        departureDate: '2026-10-10',
        returnDate: '2026-10-17',
        priceModifier: 0
      };

      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/bookings/inquiry')) {
          return Promise.reject(new Error('Network offline or connection refused'));
        }
        if (url.includes('/api/corporate-packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }));

      await act(async () => {
        render(<BookingPage packages={[selectedPkg]} selectedPackage={selectedPkg} />);
      });

      fireEvent.change(screen.getByPlaceholderText(/e\.g\. Jane Doe/i), { target: { value: 'John Smith' } });
      fireEvent.change(screen.getByPlaceholderText(/jane@example\.com/i), { target: { value: 'john@example.com' } });
      const phoneInput = document.getElementById('bk-phone');
      fireEvent.change(phoneInput, { target: { value: '2025550133' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));
      });

      const errorElements = await screen.findAllByText(/Network offline or connection refused/i);
      expect(errorElements.length).toBeGreaterThan(0);
    });
  });

  describe('4. Multi-Departure Navigation & Dynamic Key State Resets in App.jsx', () => {
    it('resets form data and dates when switching from one departure to another departure', async () => {
      vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
        if (url.includes('/api/packages')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(samplePackages) });
        }
        if (url.includes('/api/group-departures')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 'dep-a',
                packageId: 'pkg-alps',
                packageName: 'Swiss Alps Expedition',
                departureDate: '2026-10-01T00:00:00Z',
                returnDate: '2026-10-08T00:00:00Z',
                slots: { total: 10, booked: 1 },
                status: 'scheduled',
                priceModifier: 2000
              }
            ])
          });
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

      // Navigate to booking page for dep-a via popstate
      await act(async () => {
        const stateA = {
          page: 'booking',
          pkgId: 'pkg-alps',
          departureId: 'dep-a',
          departureDate: '2026-10-01',
          returnDate: '2026-10-08',
          priceModifier: 2000,
          region: 'Europe',
          search: ''
        };
        window.history.pushState(stateA, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate', { state: stateA }));
      });

      expect(await screen.findByText(/Swiss Alps Expedition/i)).toBeInTheDocument();
      expect(screen.getByText(/01\/10\/2026 → 08\/10\/2026/i)).toBeInTheDocument();

      // Now navigate to booking page for dep-b via popstate
      await act(async () => {
        const stateB = {
          page: 'booking',
          pkgId: 'pkg-desert',
          departureId: 'dep-b',
          departureDate: '2026-11-15',
          returnDate: '2026-11-20',
          priceModifier: -5000,
          region: 'Africa',
          search: ''
        };
        window.history.pushState(stateB, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate', { state: stateB }));
      });

      // Verify Sahara Dunes departure is cleanly rendered with its own dates
      expect(await screen.findByText(/Sahara Luxury Dunes/i)).toBeInTheDocument();
      expect(screen.getByText(/15\/11\/2026 → 20\/11\/2026/i)).toBeInTheDocument();
    });
  });
});
