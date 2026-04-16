import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { EnvironmentSwitcher } from './EnvironmentSwitcher'
import { environments } from '@/data/environments'

describe('EnvironmentSwitcher', () => {
  const defaultProps = {
    activeId: 'apartment',
    onSelect: vi.fn(),
  }

  it('renders the toggle button', () => {
    render(<EnvironmentSwitcher {...defaultProps} />)
    expect(screen.getByLabelText('Switch background environment')).toBeInTheDocument()
  })

  it('popover is closed by default', () => {
    render(<EnvironmentSwitcher {...defaultProps} />)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('opens the popover when the toggle button is clicked', () => {
    render(<EnvironmentSwitcher {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Switch background environment'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('shows all environments when open', () => {
    render(<EnvironmentSwitcher {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Switch background environment'))
    for (const env of environments) {
      expect(screen.getByText(env.label)).toBeInTheDocument()
    }
  })

  it('marks the active environment with aria-selected', () => {
    render(<EnvironmentSwitcher {...defaultProps} activeId="kitchen" />)
    fireEvent.click(screen.getByLabelText('Switch background environment'))
    const options = screen.getAllByRole('option')
    const kitchenOption = options.find((opt) => opt.getAttribute('aria-selected') === 'true')
    expect(kitchenOption).toBeDefined()
    expect(kitchenOption!.textContent).toContain('Kitchen')
  })

  it('calls onSelect and closes the popover when an environment is selected', () => {
    const onSelect = vi.fn()
    render(<EnvironmentSwitcher activeId="apartment" onSelect={onSelect} />)
    fireEvent.click(screen.getByLabelText('Switch background environment'))
    fireEvent.click(screen.getByText('Kitchen'))
    expect(onSelect).toHaveBeenCalledWith('kitchen')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes the popover when Escape is pressed', () => {
    render(<EnvironmentSwitcher {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Switch background environment'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes the popover on outside click', () => {
    render(<EnvironmentSwitcher {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Switch background environment'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('sets aria-expanded on the toggle button', () => {
    render(<EnvironmentSwitcher {...defaultProps} />)
    const button = screen.getByLabelText('Switch background environment')
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('selects an environment via Enter key on an option', () => {
    const onSelect = vi.fn()
    render(<EnvironmentSwitcher activeId="apartment" onSelect={onSelect} />)
    fireEvent.click(screen.getByLabelText('Switch background environment'))

    const gardenOption = screen.getByText('Garden').closest('[role="option"]')!
    fireEvent.keyDown(gardenOption, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith('garden')
  })

  it('selects an environment via Space key on an option', () => {
    const onSelect = vi.fn()
    render(<EnvironmentSwitcher activeId="apartment" onSelect={onSelect} />)
    fireEvent.click(screen.getByLabelText('Switch background environment'))

    const gardenOption = screen.getByText('Garden').closest('[role="option"]')!
    fireEvent.keyDown(gardenOption, { key: ' ' })
    expect(onSelect).toHaveBeenCalledWith('garden')
  })

  it('toggles the popover on repeated clicks', () => {
    render(<EnvironmentSwitcher {...defaultProps} />)
    const button = screen.getByLabelText('Switch background environment')

    fireEvent.click(button)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.click(button)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
