import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from '../../src/components/layout/Layout';

// Mock Navbar and Sidebar to focus on Layout structure
vi.mock('../../src/components/layout/Navbar', () => ({
  Navbar: () => <div data-testid="mock-navbar">Navbar</div>,
}));

vi.mock('../../src/components/layout/Sidebar', () => ({
  Sidebar: () => <div data-testid="mock-sidebar">Sidebar</div>,
}));

describe('Layout', () => {
  it('renders Navbar, Sidebar and Outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="test" element={<div data-testid="child-content">Child Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('has correct layout classes for main content area', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1');
    expect(main).toHaveClass('p-6');
    expect(main).toHaveClass('ml-64');
    expect(main).toHaveClass('mt-16');
  });
});