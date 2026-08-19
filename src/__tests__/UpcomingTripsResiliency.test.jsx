import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UpcomingTrips from '../components/UpcomingTrips';
import PackageDetail from '../components/PackageDetail';
import DestinationsPage from '../components/DestinationsPage';
import FeaturedPackages from '../components/FeaturedPackages';
import LuxuryExperiences from '../components/LuxuryExperiences';
import BookingPage from '../components/BookingPage';

describe('Customer Site Components Resiliency', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
      if (url.includes('/api/group-departures')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 'dep-1',
              packageId: 'pkg-1',
              packageName: 'Golden Triangle Heritage Tour',
              packageRegion: 'India',
              packageDuration: '6 Days',
              packageBasePrice: 45000,
              priceModifier: 5000,
              departureDate: '2026-10-15T00:00:00Z',
              returnDate: null, // null returnDate test
              slots: null, // null slots test
              slotsTotal: 15,
              slotsBooked: 5,
              status: 'scheduled',
              title: 'Diwali Special Departure',
              itinerary: [
                { day: 1, title: 'Arrival in Delhi', desc: 'Welcome dinner and hotel transfer.' }
              ]
            }
          ])
        });
      }
      if (url.includes('/api/packages')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 'pkg-1',
              name: 'Golden Triangle Heritage Tour',
              region: 'India',
              duration: '6 Days',
              price: 45000,
              slots: undefined,
              slotsTotal: 20,
              slotsBooked: 2,
              highlights: ['Taj Mahal visit', 'Amber Fort safari'],
              inclusions: ['5-star hotels', 'Breakfast'],
              exclusions: ['Flights'],
              itinerary: [{ day: 1, title: 'Arrival', desc: 'Welcome' }]
            }
          ])
        });
      }
      if (url.includes('/api/weather') || url.includes('/api/speciality-categories')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }));
  });

  it('renders UpcomingTrips without crash when slots object is null and returnDate is null', async () => {
    const handleBook = vi.fn();
    render(<UpcomingTrips onBook={handleBook} />);

    // Should display scheduled departures title
    expect(await screen.findByText(/Scheduled Departures/i)).toBeInTheDocument();

    // Verify departure item rendered
    expect(await screen.findByText(/Golden Triangle Heritage Tour/i)).toBeInTheDocument();

    // Verify slots left correctly calculated via fallback (15 - 5 = 10 spots)
    expect(screen.getByText(/10 \/ 15 spots/i)).toBeInTheDocument();

    // Click Itinerary button to open modal
    const itineraryBtn = screen.getByRole('button', { name: /Itinerary/i });
    fireEvent.click(itineraryBtn);

    // Verify modal header renders without "Invalid Date"
    expect(screen.getAllByText(/Diwali Special Departure/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Invalid Date/i)).not.toBeInTheDocument();

    // Verify seats remaining in modal footer (15 - 5 = 10)
    expect(screen.getByText(/10 seats remaining/i)).toBeInTheDocument();

    // Click Book This Departure
    const bookBtn = screen.getByRole('button', { name: /Book This Departure/i });
    fireEvent.click(bookBtn);
    expect(handleBook).toHaveBeenCalledWith(expect.objectContaining({
      departureId: 'dep-1',
      priceModifier: 5000
    }));
  });

  it('renders PackageDetail safely when pkg.slots is undefined', async () => {
    const onBack = vi.fn();
    const pkgWithoutSlots = {
      id: 'pkg-safe-1',
      name: 'Kyoto Zen Explorer',
      region: 'Asia',
      duration: '7 Days',
      price: 120000,
      slotsTotal: 10,
      slotsBooked: 2,
      highlights: ['Arashiyama Bamboo Grove'],
      inclusions: ['Ryokan stay'],
      exclusions: ['International Flights'],
      itinerary: [{ day: 1, title: 'Arrival', desc: 'Check-in' }]
    };

    render(<PackageDetail pkg={pkgWithoutSlots} onBook={vi.fn()} onBack={onBack} />);
    expect(screen.getByText(/Kyoto Zen Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/8 spots remaining/i)).toBeInTheDocument();

    // Test onBack handler
    const backBtn = screen.getByRole('button', { name: /Back to Destinations/i });
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalled();
  });

  it('renders DestinationsPage safely when package slots are undefined', () => {
    const packages = [
      {
        id: 'dest-1',
        name: 'Swiss Alps Hiking',
        region: 'Europe',
        duration: '5 Days',
        price: 85000,
        slotsTotal: 25,
        slotsBooked: 5,
        highlights: ['Matterhorn Trail']
      }
    ];

    render(<DestinationsPage packages={packages} onViewPackage={vi.fn()} onBook={vi.fn()} />);
    expect(screen.getByText(/Swiss Alps Hiking/i)).toBeInTheDocument();
  });

  it('renders FeaturedPackages and LuxuryExperiences safely when slots are undefined', () => {
    const packages = [
      {
        id: 'feat-1',
        name: 'Serengeti Safari',
        region: 'Africa',
        duration: '6 Days',
        price: 95000,
        slotsTotal: 12,
        slotsBooked: 3,
        highlights: ['Great Migration']
      }
    ];

    render(<FeaturedPackages packages={packages} onViewPackage={vi.fn()} />);
    expect(screen.getByText(/Serengeti Safari/i)).toBeInTheDocument();

    render(<LuxuryExperiences onViewPackage={vi.fn()} onBook={vi.fn()} />);
    expect(screen.getByText(/Curated Excellence/i)).toBeInTheDocument();
  });

  it('factors priceModifier from group departure in BookingPage submission payload', async () => {
    const selectedPkg = {
      id: 'pkg-1',
      name: 'Golden Triangle Heritage Tour',
      duration: '6 Days',
      region: 'India',
      price: 45000,
      departureId: 'dep-1',
      departureDate: '2026-10-15',
      returnDate: '2026-10-21',
      priceModifier: 5000
    };

    render(<BookingPage packages={[selectedPkg]} selectedPackage={selectedPkg} />);

    expect(screen.getByText(/Golden Triangle Heritage Tour/i)).toBeInTheDocument();

    // Fill required form fields
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Jane Doe/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/jane@example\.com/i), { target: { value: 'jane@example.com' } });
    const phoneInput = document.getElementById('bk-phone');
    fireEvent.change(phoneInput, { target: { value: '2025550199' } });

    // Submit inquiry
    fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));

    await waitFor(() => {
      expect(screen.getByText(/Inquiry Received/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/\+₹5,000 \/ guest/i)).toBeInTheDocument();
  });
});
