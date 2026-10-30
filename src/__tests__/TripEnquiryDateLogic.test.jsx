/* global global */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BookingPage from '../components/BookingPage'
import CalendarPopup from '../components/CalendarPopup'
import PackageDetail from '../components/PackageDetail'
import EnquiryPage from '../components/EnquiryPage'

describe('Trip Enquiry Frontend Date Calculation & Logic', () => {
  const mockPackages = [
    {
      id: 'PKG-SWISS',
      name: 'Swiss Alps Odyssey',
      duration: '7 Days',
      price: 150000,
      region: 'Europe',
      isBespoke: false,
      itinerary: [
        { day: 1, title: 'Day 1 Arrival', desc: 'Arrive and check in' }
      ]
    },
    {
      id: 'PKG-VIETNAM',
      name: 'Explore Vietnam',
      duration: '10 Days',
      price: 120000,
      region: 'Asia',
      isBespoke: false,
      itinerary: []
    },
    {
      id: 'PKG-BESPOKE',
      name: 'Custom Bali Retreat',
      duration: 'Flexible',
      price: 200000,
      region: 'Asia',
      isBespoke: true,
      itinerary: []
    }
  ]

  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/corporate-packages')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }
      if (url.includes('/api/weather')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
      }
      if (url.includes('/api/group-departures')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, booking: { id: 'BK-100' } }) })
    })
  })

  it('CalendarPopup in fixed-duration mode automatically selects start + (duration - 1) days on single click', () => {
    const handleChangeRange = vi.fn()
    const handleClose = vi.fn()

    render(
      <CalendarPopup
        startDate="2026-11-01"
        durationDays={7}
        isEndDateLocked={true}
        onChangeRange={handleChangeRange}
        onClose={handleClose}
      />
    )

    // Find and click on day 10
    const day10Buttons = screen.getAllByRole('button', { name: '10' })
    fireEvent.click(day10Buttons[0])

    expect(handleChangeRange).toHaveBeenCalledWith({
      startDate: expect.stringMatching(/2026-11-10/),
      endDate: expect.stringMatching(/2026-11-16/)
    })
    expect(handleClose).toHaveBeenCalled()
  })

  it('BookingPage correctly displays start -> end date for a 7-day package', async () => {
    render(
      <BookingPage
        packages={mockPackages}
        selectedPackage={mockPackages[0]}
      />
    )

    // Open calendar
    const datesTrigger = screen.getByText('Dates').closest('div')
    fireEvent.click(datesTrigger)

    // Navigate to next month to ensure all days are future dates (not disabled by minDate)
    const nextMonthBtn = screen.getByLabelText(/next month/i)
    fireEvent.click(nextMonthBtn)

    // Click day 15
    const day15Btn = screen.getAllByRole('button', { name: '15' })[0]
    fireEvent.click(day15Btn)

    // Expected format: DD/MM/YYYY -> DD/MM/YYYY (inclusive 7 days: e.g. 15/MM/YYYY -> 21/MM/YYYY)
    await waitFor(() => {
      const datesText = screen.getByText(/→/)
      expect(datesText.textContent).toMatch(/15\/\d{2}\/\d{4}\s*→\s*21\/\d{2}\/\d{4}/)
    })
  })

  it('PackageDetail embedded form computes Return Date and sends both startDate and endDate on submission', async () => {
    render(
      <PackageDetail
        pkg={mockPackages[0]}
        settings={{}}
      />
    )

    // Fill form fields
    const nameInput = screen.getByPlaceholderText(/eleanor vance/i)
    fireEvent.change(nameInput, { target: { value: 'John Smith' } })

    const emailInput = screen.getByPlaceholderText(/eleanor@luxurytravel.com/i)
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })

    const phoneInput = screen.getByPlaceholderText(/98765 43210/i)
    fireEvent.change(phoneInput, { target: { value: '9876543210' } })

    const dateInput = screen.getByLabelText(/travel date \*/i)
    fireEvent.change(dateInput, { target: { value: '2026-12-01' } })

    // Verify Return Date hint is displayed
    await waitFor(() => {
      expect(screen.getByText(/Returns:\s*Dec 7, 2026/i)).toBeDefined()
    })

    // Submit inquiry
    const submitBtn = screen.getByRole('button', { name: /Book Now \/ Submit Inquiry/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/bookings/inquiry'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"endDate":"2026-12-07"')
        })
      )
    })
  })

  it('EnquiryPage correctly displays the date range when startDate and endDate are present', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          id: 'ENQ-777',
          destination: 'Swiss Alps Odyssey',
          startDate: '2026-11-01',
          endDate: '2026-11-07',
          travelDate: '2026-11-01',
          guests: 2,
          status: 'logged',
          submittedAt: '2026-10-30'
        }
      })
    })

    render(
      <EnquiryPage
        enquiryId="ENQ-777"
        onBackToHome={vi.fn()}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Travel Dates')).toBeDefined()
      expect(screen.getByText(/November 1, 2026 → November 7, 2026/)).toBeDefined()
    })
  })
})
