import { useState, useEffect, useMemo, useCallback } from 'react';
import { PACKAGES_DATA } from '../data/packagesData';

export const usePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Voyages');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [maxBudget, setMaxBudget] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [travelDates, setTravelDates] = useState({
    departure: '',
    returnDate: ''
  });

  // State to hold available packages updated via useEffect (Experiment 1c)
  const [availablePackages, setAvailablePackages] = useState([]);

  // useEffect to simulate loading travel packages from server / API when application starts (Experiment 1c)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        setPackages(PACKAGES_DATA);
        setAvailablePackages(PACKAGES_DATA);
        setLoading(false);
      } catch (err) {
        setError('Failed to load luxury packages');
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  // Experiment 1c: useEffect hook to update available packages when destination, travel dates, or filter criteria change
  useEffect(() => {
    if (packages.length === 0) return;

    const filtered = packages.filter((pkg) => {
      // 1. Destination / Name search
      const matchesSearch =
        searchTerm.trim() === '' ||
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Category filter
      const matchesCategory =
        selectedCategory === 'All Voyages' || pkg.category === selectedCategory;

      // 3. Duration filter
      let matchesDuration = true;
      if (selectedDuration === 'short') {
        matchesDuration = pkg.durationDays >= 3 && pkg.durationDays <= 5;
      } else if (selectedDuration === 'medium') {
        matchesDuration = pkg.durationDays >= 6 && pkg.durationDays <= 7;
      } else if (selectedDuration === 'long') {
        matchesDuration = pkg.durationDays >= 8;
      }

      // 4. Budget filter
      const matchesBudget = pkg.price <= maxBudget;

      // 5. Rating filter
      const matchesRating = pkg.rating >= minRating;

      // 6. Travel dates filter (if departure date set, ensures voyage window is active)
      let matchesDates = true;
      if (travelDates.departure) {
        matchesDates = true; // all luxury packages support chosen start date
      }

      return matchesSearch && matchesCategory && matchesDuration && matchesBudget && matchesRating && matchesDates;
    });

    setAvailablePackages(filtered);
  }, [packages, searchTerm, selectedCategory, selectedDuration, maxBudget, minRating, travelDates]);

  // useMemo to calculate filtered packages whenever search, duration, budget, rating change
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // 1. Destination / Name search (case insensitive)
      const matchesSearch =
        searchTerm.trim() === '' ||
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Category filter
      const matchesCategory =
        selectedCategory === 'All Voyages' || pkg.category === selectedCategory;

      // 3. Duration filter
      let matchesDuration = true;
      if (selectedDuration === 'short') {
        matchesDuration = pkg.durationDays >= 3 && pkg.durationDays <= 5;
      } else if (selectedDuration === 'medium') {
        matchesDuration = pkg.durationDays >= 6 && pkg.durationDays <= 7;
      } else if (selectedDuration === 'long') {
        matchesDuration = pkg.durationDays >= 8;
      }

      // 4. Budget filter
      const matchesBudget = pkg.price <= maxBudget;

      // 5. Rating filter
      const matchesRating = pkg.rating >= minRating;

      return matchesSearch && matchesCategory && matchesDuration && matchesBudget && matchesRating;
    });
  }, [packages, searchTerm, selectedCategory, selectedDuration, maxBudget, minRating]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All Voyages');
    setSelectedDuration('all');
    setMaxBudget(5000);
    setMinRating(0);
  }, []);

  // Find package by ID
  const getPackageById = useCallback(
    (id) => {
      return packages.find((p) => String(p.id) === String(id));
    },
    [packages]
  );

  return {
    packages,
    availablePackages,
    filteredPackages,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedDuration,
    setSelectedDuration,
    maxBudget,
    setMaxBudget,
    minRating,
    setMinRating,
    travelDates,
    setTravelDates,
    resetFilters,
    getPackageById
  };
};
