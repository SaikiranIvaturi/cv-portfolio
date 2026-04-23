import { useEffect, useRef, useCallback } from 'react';
import { IDLE_TIMEOUT_MS, IDLE_WARNING_MS } from '../config/okta';

interface UseIdleTimeoutProps {
  onTimeout: () => void;
  onWarn: () => void;
  enabled?: boolean;
}

export function useIdleTimeout({ onTimeout, onWarn, enabled = true }: UseIdleTimeoutProps) {
  const timeoutIdRef = useRef<number | null>(null);
  const warningIdRef = useRef<number | null>(null);
  
  // Use refs to store callbacks to prevent resetTimer from being recreated
  const onTimeoutRef = useRef(onTimeout);
  const onWarnRef = useRef(onWarn);
  
  // Update refs when callbacks change
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
    onWarnRef.current = onWarn;
  }, [onTimeout, onWarn]);

  const resetTimer = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    if (warningIdRef.current) {
      clearTimeout(warningIdRef.current);
    }

    warningIdRef.current = setTimeout(() => {
      console.log('[IdleTimeout] Warning threshold reached - 30 seconds remaining');
      onWarnRef.current();
    }, IDLE_WARNING_MS);

    timeoutIdRef.current = setTimeout(() => {
      console.log('[IdleTimeout] Timeout reached - logging out');
      onTimeoutRef.current();
    }, IDLE_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    // Only activate timers if enabled
    if (!enabled) {
      console.log('[IdleTimeout] Disabled - cleaning up timers');
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (warningIdRef.current) clearTimeout(warningIdRef.current);
      return;
    }

    console.log('[IdleTimeout] Enabled - starting timers');
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    let isThrottled = false;
    const throttleDelay = 1000;

    const handleActivity = () => {
      if (isThrottled) return;
      
      isThrottled = true;
      // Track last activity time for idle detection across page reloads
      sessionStorage.setItem('lastActivity', Date.now().toString());
      resetTimer();
      
      setTimeout(() => {
        isThrottled = false;
      }, throttleDelay);
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      console.log('[IdleTimeout] Cleanup - removing event listeners and timers');
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (warningIdRef.current) {
        clearTimeout(warningIdRef.current);
      }
    };
  }, [resetTimer, enabled]);

  return { resetTimer };
}
