import { useBooking } from '../context/BookingContext';

/**
 * Custom Hook: useBookingCart
 * Experiment 2 Deliverable:
 * Manages selected packages, travel dates, number of travelers,
 * cart items, and booking calculations via the central BookingContext.
 */
export const useBookingCart = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    selectedPackage,
    setSelectedPackage,
    selectPackage,
    travelDates,
    updateTravelDates,
    travelers,
    updateTravelers,
    totalTravelersCount,
    tripDurationDays,
    calculationSummary,
    cartSummary,
    discountCode,
    setDiscountCode,
    isPromoApplied,
    setIsPromoApplied,
    confirmBooking,
    travelerDetails,
    setTravelerDetails,
    bookings
  } = useBooking();

  return {
    cartItems,
    cartCount: cartItems.length,
    isEmpty: cartItems.length === 0,
    addToCart,
    removeFromCart,
    clearCart,
    selectedPackage,
    setSelectedPackage,
    selectPackage,
    travelDates,
    updateTravelDates,
    travelers,
    updateTravelers,
    totalTravelersCount,
    tripDurationDays,
    calculationSummary,
    cartSummary,
    discountCode,
    setDiscountCode,
    isPromoApplied,
    setIsPromoApplied,
    confirmBooking,
    travelerDetails,
    setTravelerDetails,
    bookingDetails: travelerDetails,
    bookings
  };
};
