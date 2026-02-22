import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Navbar } from '../../src/components/layout/Navbar';
import { useAuthStore } from '../../src/store/authStore';
import { UserRole } from '@car-dealership/shared-types';

// Mock useAuthStore
vi.mock('../../src/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar', () => {
  const mockLogout = vi.fn();
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.ADMIN,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
  });

  const renderNavbar = () => {
    return render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  };

  it('renders the application title', () => {
    renderNavbar();
    expect(screen.getByText(/Car Dealership Management/i)).toBeInTheDocument();
  });

  it('displays the user name and role', () => {
    renderNavbar();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('calls logout and navigates to login when logout button is clicked', () => {
    renderNavbar();
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});