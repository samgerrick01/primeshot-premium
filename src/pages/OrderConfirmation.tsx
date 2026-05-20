import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * OrderConfirmation is now handled inline on the PaymentSession page.
 * This stays as a redirect fallback in case someone navigates to it directly.
 */
export function OrderConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/account?tab=orders');
  }, [navigate]);

  return null;
}
