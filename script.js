// 3-Phase scroll animation system
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    let isAnimating = false;
    let currentPhase = 1; // 1, 2, or 3
    let scrollPosition = 0;
    let scrollAccumulator = 0;
    const scrollThreshold = 250; // User needs to scroll this much to trigger

    function lockScroll() {
        scrollPosition = window.pageYOffset;
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition}px`;
        body.style.width = '100%';
    }

    function unlockScroll() {
        body.style.removeProperty('overflow');
        body.style.removeProperty('position');
        body.style.removeProperty('top');
        body.style.removeProperty('width');
        window.scrollTo(0, scrollPosition);
    }

    function setPhase(phase) {
        // Remove all phase classes
        body.classList.remove('phase-1', 'phase-2', 'phase-3');
        
        // Add current phase class
        body.classList.add(`phase-${phase}`);
        currentPhase = phase;
        
        // Lock scroll for phases 2 and 3
        if (phase > 1) {
            lockScroll();
        } else {
            unlockScroll();
        }
    }

    function handleScroll(event) {
        const deltaY = event.deltaY;
        
        // Prevent default scrolling behavior
        event.preventDefault();
        
        // Scrolling down - advance to next phase
        if (deltaY > 0 && !isAnimating) {
            scrollAccumulator += Math.abs(deltaY);
            
            if (scrollAccumulator >= scrollThreshold) {
                if (currentPhase < 3) {
                    isAnimating = true;
                    scrollAccumulator = 0;
                    
                    setPhase(currentPhase + 1);
                    
                    // Reset animation flag after transition completes
                    setTimeout(() => {
                        isAnimating = false;
                    }, 1400);
                } else {
                    scrollAccumulator = 0; // Reset if at max phase
                }
            }
        } 
        // Scrolling up - go back to previous phase
        else if (deltaY < 0 && !isAnimating) {
            scrollAccumulator += Math.abs(deltaY);
            
            if (scrollAccumulator >= scrollThreshold) {
                if (currentPhase > 1) {
                    isAnimating = true;
                    scrollAccumulator = 0;
                    
                    setPhase(currentPhase - 1);
                    
                    setTimeout(() => {
                        isAnimating = false;
                    }, 1400);
                } else {
                    scrollAccumulator = 0; // Reset if at min phase
                }
            }
        }
    }

    // Initialize to phase 1
    setPhase(1);

    // Listen for wheel events instead of scroll
    window.addEventListener('wheel', handleScroll, { passive: false });
    
    // Also listen for touch events for mobile
    let startY = 0;
    window.addEventListener('touchstart', function(event) {
        startY = event.touches[0].clientY;
    }, { passive: false });
    
    window.addEventListener('touchmove', function(event) {
        if (isAnimating) {
            event.preventDefault();
            return;
        }
        
        const currentY = event.touches[0].clientY;
        const deltaY = startY - currentY;
        
        if (Math.abs(deltaY) > 80) { // Increased minimum swipe distance
            const syntheticEvent = {
                deltaY: deltaY,
                preventDefault: () => event.preventDefault()
            };
            handleScroll(syntheticEvent);
            startY = currentY;
        }
    }, { passive: false });
});