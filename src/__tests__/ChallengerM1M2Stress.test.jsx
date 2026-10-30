import { render, screen, fireEvent, act, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import DestinationsPage from '../components/DestinationsPage'
import TestimonialsSection from '../components/TestimonialsSection'
import CorporateTours from '../components/CorporateTours'
import BookingPage from '../components/BookingPage'
import PackageDetail from '../components/PackageDetail'

describe('Empirical Challenger: Milestone 1 Gen 2 & Milestone 2 Stress Test Suite', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
    window.sessionStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url, opts) => {
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
                { day: 2, title: 'Conference & Strategy Summit', desc: 'Full-day MICE ballroom session with AV and banquet lunch.' },
                { day: 3, title: 'Gala Dinner & Desert Safari', desc: 'Private dune dinner with executive entertainment.' }
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
          status: 201,
          ok: true,
          json: () => Promise.resolve({ message: 'Inquiry submitted successfully', booking: { id: 'BK-CONFIRMED-99' } })
        })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.sessionStorage.clear()
  })

  // =========================================================================
  // Challenge 1: Compound searches, edge delimiters (&, ,, /), casing in DestinationsPage
  // =========================================================================
  describe('Challenge 1: Compound Searches, Edge Delimiters (&, ,, /) & Casing in DestinationsPage', () => {
    const packagesCatalog = [
      {
        id: 'PKG-GREECE-01',
        name: 'Greece Island Hopper & Aegean Odyssey',
        region: 'Europe',
        duration: '7 Days',
        price: 85000,
        highlights: ['Santorini Sunset', 'Athens Acropolis'],
        inclusions: ['Luxury Hotel', 'Ferry']
      },
      {
        id: 'PKG-TURKEY-01',
        name: 'Turkey Cappadocia & Istanbul Grand Bazaar',
        region: 'Europe',
        duration: '8 Days',
        price: 90000,
        highlights: ['Hot Air Balloon', 'Hagia Sophia'],
        inclusions: ['Cave Suites', 'Domestic Flights']
      },
      {
        id: 'PKG-JAPAN-01',
        name: 'Japan Cherry Blossoms',
        region: 'Asia',
        duration: '10 Days',
        price: 135000,
        highlights: ['Tokyo Skytree', 'Kyoto Temples'],
        inclusions: ['Bullet Train', 'Ryokan Stay']
      }
    ]

    it('handles compound search with ampersand delimiter "Greece & Turkey"', () => {
      render(<DestinationsPage packages={packagesCatalog} initialSearch="Greece & Turkey" />)
      expect(screen.getByText('Greece Island Hopper & Aegean Odyssey')).toBeInTheDocument()
      expect(screen.getByText('Turkey Cappadocia & Istanbul Grand Bazaar')).toBeInTheDocument()
      expect(screen.queryByText('Japan Cherry Blossoms')).not.toBeInTheDocument()
    })

    it('handles compound search with slash delimiter "greece / turkey"', () => {
      render(<DestinationsPage packages={packagesCatalog} initialSearch="greece / turkey" />)
      expect(screen.getByText('Greece Island Hopper & Aegean Odyssey')).toBeInTheDocument()
      expect(screen.getByText('Turkey Cappadocia & Istanbul Grand Bazaar')).toBeInTheDocument()
      expect(screen.queryByText('Japan Cherry Blossoms')).not.toBeInTheDocument()
    })

    it('handles compound search with comma delimiter "GREECE, TURKEY"', () => {
      render(<DestinationsPage packages={packagesCatalog} initialSearch="GREECE, TURKEY" />)
      expect(screen.getByText('Greece Island Hopper & Aegean Odyssey')).toBeInTheDocument()
      expect(screen.getByText('Turkey Cappadocia & Istanbul Grand Bazaar')).toBeInTheDocument()
      expect(screen.queryByText('Japan Cherry Blossoms')).not.toBeInTheDocument()
    })

    it('handles compound search with keyword "and" and mixed casing "gReEcE and TuRkEy"', () => {
      render(<DestinationsPage packages={packagesCatalog} initialSearch="gReEcE and TuRkEy" />)
      expect(screen.getByText('Greece Island Hopper & Aegean Odyssey')).toBeInTheDocument()
      expect(screen.getByText('Turkey Cappadocia & Istanbul Grand Bazaar')).toBeInTheDocument()
      expect(screen.queryByText('Japan Cherry Blossoms')).not.toBeInTheDocument()
    })

    it('resilient against delimiter-only or special char queries without crashing', () => {
      render(<DestinationsPage packages={packagesCatalog} initialSearch=" & / , " />)
      // Should cleanly render empty state without throwing errors
      expect(screen.getByText(/No packages available yet/i)).toBeInTheDocument()
      expect(screen.getByText(/Reset Filters/i)).toBeInTheDocument()
    })

    it('supports live search input typing with compound delimiters', () => {
      render(<DestinationsPage packages={packagesCatalog} initialSearch="" />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'Japan / Greece' } })
      expect(screen.getByText('Japan Cherry Blossoms')).toBeInTheDocument()
      expect(screen.getByText('Greece Island Hopper & Aegean Odyssey')).toBeInTheDocument()
      expect(screen.queryByText('Turkey Cappadocia & Istanbul Grand Bazaar')).not.toBeInTheDocument()
    })
  })

  // =========================================================================
  // Challenge 2: Testimonials expansion, toggle open/close, card navigation
  // =========================================================================
  describe('Challenge 2: Testimonials Expansion, Toggle Open/Close & Navigation', () => {
    const multiReviews = [
      { id: 1, name: 'Reviewer One', location: 'Delhi', text: 'First amazing review trip', rating: 5, package: 'Trip 1' },
      { id: 2, name: 'Reviewer Two', location: 'Mumbai', text: 'Second fantastic experience', rating: 5, package: 'Trip 2' },
      { id: 3, name: 'Reviewer Three', location: 'Bangalore', text: 'Third wonderful journey', rating: 5, package: 'Trip 3' },
      { id: 4, name: 'Reviewer Four', location: 'Chennai', text: 'Fourth memorable vacation', rating: 5, package: 'Trip 4' },
      { id: 5, name: 'Reviewer Five', location: 'Kolkata', text: 'Fifth splendid getaway', rating: 5, package: 'Trip 5' }
    ]

    it('limits initial display to 3 reviews and shows "View More Reviews (2+)" button', () => {
      render(<TestimonialsSection testimonials={multiReviews} />)
      expect(screen.getByText(/Reviewer One/i)).toBeInTheDocument()
      expect(screen.getByText(/Reviewer Two/i)).toBeInTheDocument()
      expect(screen.getByText(/Reviewer Three/i)).toBeInTheDocument()
      expect(screen.queryByText(/Reviewer Four/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Reviewer Five/i)).not.toBeInTheDocument()

      const toggleBtn = screen.getByRole('button', { name: /view more reviews/i })
      expect(toggleBtn).toBeInTheDocument()
    })

    it('toggles expansion open to show all 5 reviews, then toggles closed back to 3', () => {
      render(<TestimonialsSection testimonials={multiReviews} />)
      const toggleBtn = screen.getByRole('button', { name: /view more reviews/i })

      // Click View More -> Expands
      fireEvent.click(toggleBtn)
      expect(screen.getByText(/Reviewer Four/i)).toBeInTheDocument()
      expect(screen.getByText(/Reviewer Five/i)).toBeInTheDocument()
      const showLessBtn = screen.getByRole('button', { name: /show less/i })
      expect(showLessBtn).toBeInTheDocument()

      // Click Show Less -> Collapses
      fireEvent.click(showLessBtn)
      expect(screen.queryByText(/Reviewer Four/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Reviewer Five/i)).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /view more reviews/i })).toBeInTheDocument()
    })

    it('navigates to gallery story page when review card is clicked', () => {
      const onNavigate = vi.fn()
      render(<TestimonialsSection testimonials={multiReviews} onNavigate={onNavigate} />)
      const card = screen.getByText(/Reviewer One/i).closest('figure')
      fireEvent.click(card)
      expect(onNavigate).toHaveBeenCalledWith('gallery')
    })
  })

  // =========================================================================
  // Challenge 3: Corporate itinerary day cards rendering, close on escape or button click
  // =========================================================================
  describe('Challenge 3: Corporate Itinerary Day Cards, Escape Key & Button Dismissal', () => {
    it('renders all day cards in full-screen modal and closes on close button click', async () => {
      render(<CorporateTours />)

      await waitFor(() => {
        expect(screen.getByText(/Dubai MICE & Leadership Retreat/i)).toBeInTheDocument()
      })

      // Open Itinerary
      const viewItineraryBtn = screen.getByRole('button', { name: /view itinerary/i })
      fireEvent.click(viewItineraryBtn)

      // Verify day cards rendered
      expect(screen.getByText(/Arrival & Welcome Reception/i)).toBeInTheDocument()
      expect(screen.getByText(/Conference & Strategy Summit/i)).toBeInTheDocument()
      expect(screen.getByText(/Gala Dinner & Desert Safari/i)).toBeInTheDocument()
      expect(screen.getByText('D1')).toBeInTheDocument()
      expect(screen.getByText('D2')).toBeInTheDocument()
      expect(screen.getByText('D3')).toBeInTheDocument()

      // Click top close button
      const closeBtn = screen.getByLabelText(/close itinerary/i)
      fireEvent.click(closeBtn)
      expect(screen.queryByText(/Arrival & Welcome Reception/i)).not.toBeInTheDocument()
    })

    it('closes full-screen corporate itinerary on Escape key press', async () => {
      render(<CorporateTours />)

      await waitFor(() => {
        expect(screen.getByText(/Dubai MICE & Leadership Retreat/i)).toBeInTheDocument()
      })

      const viewItineraryBtn = screen.getByRole('button', { name: /view itinerary/i })
      fireEvent.click(viewItineraryBtn)

      expect(screen.getByText(/Arrival & Welcome Reception/i)).toBeInTheDocument()

      // Fire Escape keydown
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
      expect(screen.queryByText(/Arrival & Welcome Reception/i)).not.toBeInTheDocument()
    })

    it('closes full-screen corporate itinerary on bottom "Close Itinerary" button click', async () => {
      render(<CorporateTours />)

      await waitFor(() => {
        expect(screen.getByText(/Dubai MICE & Leadership Retreat/i)).toBeInTheDocument()
      })

      const viewItineraryBtn = screen.getByRole('button', { name: /view itinerary/i })
      fireEvent.click(viewItineraryBtn)

      expect(screen.getByText(/Arrival & Welcome Reception/i)).toBeInTheDocument()

      // Click bottom Close Itinerary button
      const closeButtons = screen.getAllByRole('button', { name: /Close Itinerary/i })
      const bottomCloseBtn = closeButtons[closeButtons.length - 1]
      fireEvent.click(bottomCloseBtn)
      expect(screen.queryByText(/Arrival & Welcome Reception/i)).not.toBeInTheDocument()
    })
  })

  // =========================================================================
  // Challenge 4: Inquiry form submission without passport and verification of 201 response
  // =========================================================================
  describe('Challenge 4: Inquiry Form Submission without Passport Field', () => {
    const testPackage = {
      id: 'pkg-luxury-bali',
      name: 'Bali Private Villa Retreat',
      duration: '6 Days',
      region: 'Asia',
      price: 75000,
      slots: { total: 20, booked: 5 },
      departureId: 'dep-101',
      departureDate: '2026-11-15',
      returnDate: '2026-11-20'
    }

    it('submits inquiry successfully without any passport field and verifies API invocation', async () => {
      render(<BookingPage packages={[testPackage]} selectedPackage={testPackage} />)

      // Verify no passport fields exist anywhere in the DOM
      expect(screen.queryByLabelText(/passport/i)).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText(/passport/i)).not.toBeInTheDocument()

      // Fill primary contact details
      const nameInput = screen.getByPlaceholderText(/e\.g\. Jane Doe/i)
      const emailInput = screen.getByPlaceholderText(/jane@example\.com/i)
      const phoneInput = screen.getByPlaceholderText(/e\.g\. 98765 43210/i)

      fireEvent.change(nameInput, { target: { value: 'Aarav Mehta' } })
      fireEvent.change(emailInput, { target: { value: 'aarav@luxury.com' } })
      fireEvent.change(phoneInput, { target: { name: 'phone', value: '9876543210' } })

      // Expand special requests
      const specialReqBtn = screen.getByRole('button', { name: /Add special requests or notes/i })
      fireEvent.click(specialReqBtn)

      // Ensure even in expanded preferences, passport is absent
      expect(screen.queryByText(/passport/i)).not.toBeInTheDocument()

      // Submit inquiry
      const submitBtn = screen.getByRole('button', { name: /Submit Request/i })
      await act(async () => {
        fireEvent.click(submitBtn)
      })

      // Verify fetch was called to /api/bookings/inquiry
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/bookings/inquiry'),
        expect.objectContaining({
          method: 'POST',
          body: expect.not.stringContaining('passport')
        })
      )

      // Verify success screen is rendered
      await waitFor(() => {
        expect(screen.getByText(/Inquiry Received/i)).toBeInTheDocument()
      })
    })
  })

  // =========================================================================
  // Challenge 5: Gated itinerary download validation and brochure trigger
  // =========================================================================
  describe('Challenge 5: Gated Itinerary Download Validation & Brochure Trigger', () => {
    const gatedPackage = {
      id: 'PKG-SWISS-01',
      name: 'Swiss Alps Luxury Explorer',
      duration: '7 Days',
      region: 'Europe',
      price: 150000,
      slots: { total: 20, booked: 3 }
    }

    it('rejects invalid email and invalid phone, then successfully triggers brochure on valid submission', async () => {
      render(<PackageDetail pkg={gatedPackage} />)

      // Click Download Itinerary (PDF)
      const downloadBtn = screen.getByRole('button', { name: /download itinerary \(pdf\)/i })
      fireEvent.click(downloadBtn)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()

      const nameInput = within(dialog).getByPlaceholderText(/e\.g\. John Doe/i)
      const emailInput = within(dialog).getByPlaceholderText(/e\.g\. john@example\.com/i)
      const phoneInput = within(dialog).getByPlaceholderText(/e\.g\. 98765 43210/i)
      const submitBtn = within(dialog).getByTestId('lead-submit-btn')

      // 1. Enter invalid email
      fireEvent.change(nameInput, { target: { value: 'Valid Name' } })
      fireEvent.change(emailInput, { target: { value: 'not-an-email' } })
      fireEvent.change(phoneInput, { target: { name: 'phone', value: '9876543210' } })

      fireEvent.click(submitBtn)
      expect(await screen.findByText(/Please provide a valid email address/i)).toBeInTheDocument()

      // 2. Enter invalid phone (< 7 digits)
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } })
      fireEvent.change(phoneInput, { target: { name: 'phone', value: '12345' } })

      fireEvent.click(submitBtn)
      const phoneErrors = await screen.findAllByText(/Phone number must be between 7 and 15 digits/i)
      expect(phoneErrors.length).toBeGreaterThan(0)

      // 3. Enter valid phone and submit
      fireEvent.change(phoneInput, { target: { name: 'phone', value: '9876543210' } })

      await act(async () => {
        fireEvent.click(submitBtn)
      })

      // Verify enquiries API called with leadSource: 'Itinerary Download'
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/enquiries/submit'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"leadSource":"Itinerary Download"')
        })
      )

      // Verify session storage set
      expect(window.sessionStorage.getItem('kraft_lead_captured')).toBe('true')

      // Verify brochure modal opened
      expect(await screen.findByText(/Package Brochure Preview/i)).toBeInTheDocument()
    })
  })
})
