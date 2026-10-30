import { render, screen, fireEvent, act, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import DestinationsPage from '../components/DestinationsPage'
import TestimonialsSection from '../components/TestimonialsSection'
import CorporateTours from '../components/CorporateTours'
import BookingPage from '../components/BookingPage'
import PackageDetail from '../components/PackageDetail'
import staticPackages from '../data/packages'

describe('Milestone 2 Customer Site Enhancements (R1, R2, R3, R4, R7)', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
    window.sessionStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
      if (url.includes('/api/group-departures')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }
      if (url.includes('/api/speciality-categories')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }
      if (url.includes('/api/corporate-packages')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 'corp-dubai-01',
              destination: 'Dubai MICE & Leadership Retreat',
              category: 'international',
              nights: '5 Days / 4 Nights',
              starting_price: 65000,
              description: 'Executive conference in Dubai Marina with Desert Safari gala.',
              itinerary: [
                { day: 1, title: 'Arrival & Welcome Reception', desc: 'Transfer to luxury hotel and evening networking cocktail.' },
                { day: 2, title: 'Conference & Strategy Summit', desc: 'Full-day MICE ballroom session with AV and banquet lunch.' }
              ]
            }
          ])
        })
      }
      if (url.includes('/api/corporate-clients')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }
      if (url.includes('/api/testimonials')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }
      if (url.includes('/api/enquiries/submit')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: 'success', message: 'Enquiry submitted successfully' })
        })
      }
      if (url.includes('/api/bookings/inquiry')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Inquiry submitted successfully', booking: { id: 'BK-123' } })
        })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.sessionStorage.clear()
  })

  describe('R1: Top Bar Destination Navigation & Filtering', () => {
    const testPackages = [
      {
        id: 'PKG-GREECE-01',
        name: 'Greece Island Hopper & Aegean Odyssey',
        region: 'Europe',
        duration: '8 Days / 7 Nights',
        price: 95000,
        highlights: ['Athens Acropolis', 'Santorini Sunset', 'Mykonos Windmills'],
        inclusions: ['Hotels', 'Ferries', 'Breakfast']
      },
      {
        id: 'PKG-JAPAN-01',
        name: 'Japan Golden Route',
        region: 'Asia',
        duration: '7 Days',
        price: 110000,
        highlights: ['Tokyo Shibuya', 'Kyoto Fushimi Inari'],
        inclusions: ['Hotels', 'Bullet Train']
      }
    ]

    it('matches Greek package when searchQuery is compound name "Greece & Turkey"', () => {
      render(
        <DestinationsPage
          packages={testPackages}
          initialSearch="Greece & Turkey"
          initialRegion="Europe"
        />
      )

      expect(screen.getByText('Greece Island Hopper & Aegean Odyssey')).toBeInTheDocument()
      expect(screen.queryByText('Japan Golden Route')).not.toBeInTheDocument()
    })

    it('matches Greek package when selectedRegion is a country name like "Greece"', () => {
      render(
        <DestinationsPage
          packages={testPackages}
          initialSearch=""
          initialRegion="Greece"
        />
      )

      expect(screen.getByText('Greece Island Hopper & Aegean Odyssey')).toBeInTheDocument()
      expect(screen.queryByText('Japan Golden Route')).not.toBeInTheDocument()
    })

    it('displays packages matching standard continent region "Europe"', () => {
      render(
        <DestinationsPage
          packages={testPackages}
          initialSearch=""
          initialRegion="Europe"
        />
      )

      expect(screen.getByText('Greece Island Hopper & Aegean Odyssey')).toBeInTheDocument()
      expect(screen.queryByText('Japan Golden Route')).not.toBeInTheDocument()
    })
  })

  describe('R2: Customer Site Reviews Section Display', () => {
    const mockReviews = [
      { id: 1, name: 'Aarav Mehta', location: 'Mumbai', text: 'Stunning luxury trip to Santorini and Athens!', rating: 5, package: 'Greece Odyssey' },
      { id: 2, name: 'Pooja Sharma', location: 'Delhi', text: 'The cherry blossom tour was unforgettable.', rating: 5, package: 'Japan Discovery' },
      { id: 3, name: 'Rohan Gupta', location: 'Bengaluru', text: 'Private villa in Bali with exceptional service.', rating: 5, package: 'Bali Bespoke' },
      { id: 4, name: 'Sneha Patel', location: 'Ahmedabad', text: 'Swiss Alps express train was magnificent.', rating: 5, package: 'Swiss Alps Explorer' },
      { id: 5, name: 'Karan Verma', location: 'Pune', text: 'Amalfi coast yacht experience was top notch.', rating: 5, package: 'Amalfi Odyssey' }
    ]

    it('displays reviews in a responsive grid and limits initial view to 3', () => {
      const { container } = render(<TestimonialsSection testimonials={mockReviews} />)
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid.className).toContain('grid-cols-1')
      expect(grid.className).toContain('md:grid-cols-2')
      expect(grid.className).toContain('lg:grid-cols-3')

      // Initial visible reviews
      expect(screen.getByText(/Aarav Mehta/i)).toBeInTheDocument()
      expect(screen.getByText(/Pooja Sharma/i)).toBeInTheDocument()
      expect(screen.getByText(/Rohan Gupta/i)).toBeInTheDocument()
      expect(screen.queryByText(/Sneha Patel/i)).not.toBeInTheDocument()
    })

    it('toggles View More Reviews and Show Less correctly', () => {
      render(<TestimonialsSection testimonials={mockReviews} />)
      const toggleBtn = screen.getByRole('button', { name: /view more reviews/i })
      expect(toggleBtn).toBeInTheDocument()

      // Click to view more
      fireEvent.click(toggleBtn)
      expect(screen.getByText(/Sneha Patel/i)).toBeInTheDocument()
      expect(screen.getByText(/Karan Verma/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument()

      // Click to show less
      fireEvent.click(screen.getByRole('button', { name: /show less/i }))
      expect(screen.queryByText(/Sneha Patel/i)).not.toBeInTheDocument()
    })

    it('clicking a review card redirects to gallery / story page', () => {
      const handleNavigate = vi.fn()
      render(<TestimonialsSection testimonials={mockReviews} onNavigate={handleNavigate} />)

      const firstCard = screen.getByText(/Aarav Mehta/i).closest('figure')
      expect(firstCard).toBeInTheDocument()
      fireEvent.click(firstCard)
      expect(handleNavigate).toHaveBeenCalledWith('gallery')
    })
  })

  describe('R3: Corporate Departure Full-Screen Itinerary View', () => {
    it('opens full-width/full-screen modal overlay with complete day-by-day details when viewing itinerary', async () => {
      render(<CorporateTours />)

      // Wait for corporate package to load
      await waitFor(() => {
        expect(screen.getByText(/Dubai MICE & Leadership Retreat/i)).toBeInTheDocument()
      })

      const viewItineraryBtn = screen.getByRole('button', { name: /view itinerary/i })
      fireEvent.click(viewItineraryBtn)

      // Modal dialog must be rendered
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(dialog.className).toContain('fixed')
      expect(dialog.className).toContain('inset-0')
      expect(dialog.className).toContain('w-screen')
      expect(dialog.className).toContain('h-screen')
      expect(dialog.className).toContain('z-[100]')

      // Must display complete day-by-day schedule details
      expect(screen.getByText(/Complete Day-by-Day Itinerary Schedule/i)).toBeInTheDocument()
      expect(screen.getByText(/Arrival & Welcome Reception/i)).toBeInTheDocument()
      expect(screen.getByText(/Conference & Strategy Summit/i)).toBeInTheDocument()

      // Close button should close the modal
      const closeBtn = screen.getByLabelText(/close itinerary/i)
      fireEvent.click(closeBtn)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('R4: Inquiry Form Field Cleanup', () => {
    it('renders the inquiry form and guest preferences without any Passport No. field', () => {
      render(<BookingPage packages={staticPackages} />)

      // Verify no passport label or input exists
      expect(screen.queryByText(/passport/i)).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText(/passport/i)).not.toBeInTheDocument()

      // Expand optional preferences
      const preferencesToggle = screen.getByRole('button', { name: /Add special requests or notes/i })
      fireEvent.click(preferencesToggle)

      // Primary traveller and Guest preferences still render cleanly
      expect(screen.getAllByText(/Dietary Preference/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Seat Preference/i).length).toBeGreaterThan(0)
      expect(screen.queryByText(/Passport No\./i)).not.toBeInTheDocument()
    })
  })

  describe('R7: Itinerary Download Contact Details Lead Capture', () => {
    const mockPackage = {
      id: 'PKG-GREECE-01',
      name: 'Greece Island Hopper',
      duration: '8 Days / 7 Nights',
      region: 'Europe',
      price: 95000,
      slots: { total: 20, booked: 2 }
    }

    it('gates itinerary download behind contact modal requiring name, email, and phone', async () => {
      render(<PackageDetail pkg={mockPackage} />)

      // Click Download Itinerary (PDF)
      const downloadBtn = screen.getByRole('button', { name: /download itinerary \(pdf\)/i })
      fireEvent.click(downloadBtn)

      // Lead modal must open
      expect(screen.getByText(/Download Day-by-Day Itinerary/i)).toBeInTheDocument()
      expect(screen.getByText(/Free Itinerary PDF/i)).toBeInTheDocument()

      const dialog = screen.getByRole('dialog')

      // Attempt submit without details -> validation errors
      const submitBtn = within(dialog).getByTestId('lead-submit-btn')
      fireEvent.click(submitBtn)
      expect(await screen.findByText(/Please enter your full name/i)).toBeInTheDocument()

      // Fill in valid details
      const nameInput = within(dialog).getByPlaceholderText(/e\.g\. John Doe/i)
      const emailInput = within(dialog).getByPlaceholderText(/e\.g\. john@example\.com/i)
      const phoneInput = within(dialog).getByPlaceholderText(/e\.g\. 98765 43210/i)

      fireEvent.change(nameInput, { target: { value: 'Rajesh Kumar' } })
      fireEvent.change(emailInput, { target: { value: 'rajesh@example.com' } })
      fireEvent.change(phoneInput, { target: { name: 'phone', value: '9876543210' } })

      // Submit lead form
      await act(async () => {
        fireEvent.click(submitBtn)
      })

      // Backend API should have received the submission with Itinerary Download leadSource
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/enquiries/submit'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"leadSource":"Itinerary Download"')
        })
      )

      // Brochure modal should now be unlocked and open
      expect(screen.getByText(/Package Brochure Preview/i)).toBeInTheDocument()
    })

    it('subsequent download clicks open brochure directly if contact details are already captured in session', () => {
      window.sessionStorage.setItem('kraft_lead_captured', 'true')
      render(<PackageDetail pkg={mockPackage} />)

      const downloadBtn = screen.getByRole('button', { name: /download itinerary \(pdf\)/i })
      fireEvent.click(downloadBtn)

      // Brochure opens directly without lead capture modal
      expect(screen.getByText(/Package Brochure Preview/i)).toBeInTheDocument()
      expect(screen.queryByText(/Free Itinerary PDF/i)).not.toBeInTheDocument()
    })
  })
})
