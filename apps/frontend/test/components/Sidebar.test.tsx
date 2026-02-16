import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Sidebar } from '../../src/components/layout/Sidebar';

describe('Sidebar', () => {
  const renderSidebar = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Sidebar />
      </MemoryRouter>
    );
  };

  it('renders all navigation links', () => {
    renderSidebar();

    const links = [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Vehicles', href: '/vehicles' },
      { name: 'Customers', href: '/customers' },
      { name: 'Sales', href: '/sales' },
      { name: 'Repairs', href: '/repairs' },
    ];

    links.forEach((link) => {
      const navLink = screen.getByRole('link', { name: new RegExp(link.name, 'i') });
      expect(navLink).toBeInTheDocument();
      expect(navLink).toHaveAttribute('href', link.href);
    });
  });

  it('highlights the active route', () => {
    renderSidebar(['/vehicles']);

    const vehiclesLink = screen.getByRole('link', { name: /vehicles/i });
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });

    // Active link should have specific classes
    expect(vehiclesLink).toHaveClass('bg-primary-50');
    expect(vehiclesLink).toHaveClass('text-primary-700');

    // Inactive link should not have active classes
    expect(dashboardLink).not.toHaveClass('bg-primary-50');
    expect(dashboardLink).toHaveClass('text-gray-700');
  });
});