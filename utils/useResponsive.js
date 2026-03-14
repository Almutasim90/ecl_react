import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

/** Breakpoints for tablets/foldables. Content reflows instead of stretching. */
const TABLET_MIN = 600;
const WIDE_MIN = 840;

export function useResponsive() {
  const [dims, setDims] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', setDims);
    return () => sub?.remove?.();
  }, []);

  const { width, height } = dims;
  const isTablet = width >= TABLET_MIN;
  const isWide = width >= WIDE_MIN;
  const cardMaxWidth = isWide ? 520 : isTablet ? 440 : Math.min(width - 48, 440);
  const horizontalPadding = isTablet ? 32 : 24;
  const cardPadding = isTablet ? 32 : 28;

  return {
    width,
    height,
    isTablet,
    isWide,
    cardMaxWidth,
    horizontalPadding,
    cardPadding,
  };
}
