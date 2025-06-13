// utils/animations.js

// ============ ANIMATION VARIANTS ============

export const fadeInUp = {
    initial: {
        opacity: 0,
        y: 40
    },
    animate: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 1,
            duration: 1,
            ease: "easeOut"
        }
    }),
    exit: {
        opacity: 0,
        y: 40,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    }
};

export const fadeInDown = {
    initial: {
        opacity: 0,
        y: -40
    },
    animate: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.8,
            ease: "easeOut"
        }
    }),
    exit: {
        opacity: 0,
        y: -40,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    }
};

export const fadeInLeft = {
    initial: {
        opacity: 0,
        x: -40
    },
    animate: (i = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 1,
            duration: 1.8,
            ease: "easeOut"
        }
    }),
    exit: {
        opacity: 0,
        x: -40,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    }
};

export const fadeInRight = {
    initial: {
        opacity: 0,
        x: 40
    },
    animate: (i = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 1,
            duration: 1.8,
            ease: "easeOut"
        }
    }),
    exit: {
        opacity: 0,
        x: 40,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    }
};

export const fadeInScale = {
    initial: {
        opacity: 0,
        scale: 0.95
    },
    animate: (i = 0) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: i * 1,
            duration: 1,
            ease: "easeOut"
        }
    }),
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    }
};

export const scaleIn = {
    initial: {
        scale: 0,
        opacity: 0
    },
    animate: (i = 0) => ({
        scale: 1,
        opacity: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: "backOut",
            type: "spring",
            bounce: 0.4
        }
    }),
    exit: {
        scale: 0,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

export const slideInFromBottom = {
    initial: {
        y: "100%",
        opacity: 0
    },
    animate: (i = 0) => ({
        y: 0,
        opacity: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.8,
            ease: "easeOut"
        }
    }),
    exit: {
        y: "100%",
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    }
};

export const slideInFromTop = {
    initial: {
        y: "-100%",
        opacity: 0
    },
    animate: (i = 0) => ({
        y: 0,
        opacity: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.8,
            ease: "easeOut"
        }
    }),
    exit: {
        y: "-100%",
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    }
};

export const rotateIn = {
    initial: {
        rotate: -180,
        opacity: 0,
        scale: 0.5
    },
    animate: (i = 0) => ({
        rotate: 0,
        opacity: 1,
        scale: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.8,
            ease: "easeOut"
        }
    }),
    exit: {
        rotate: 180,
        opacity: 0,
        scale: 0.5,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    }
};

export const flipIn = {
    initial: {
        rotateY: -90,
        opacity: 0
    },
    animate: (i = 0) => ({
        rotateY: 0,
        opacity: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.8,
            ease: "easeOut"
        }
    }),
    exit: {
        rotateY: 90,
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    }
};

// ============ STAGGER ANIMATIONS ============

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

export const staggerItem = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

// ============ PAGE TRANSITION ANIMATIONS ============

export const pageTransition = {
    initial: {
        opacity: 0,
        x: 100
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        x: -100,
        transition: {
            duration: 0.4,
            ease: "easeIn"
        }
    }
};

export const pageSlideUp = {
    initial: {
        opacity: 0,
        y: "100vh"
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: "-100vh",
        transition: {
            duration: 0.6,
            ease: "easeIn"
        }
    }
};

export const pageFade = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: "easeIn"
        }
    }
};

// ============ HERO SECTION ANIMATIONS ============

export const heroLogo = {
    initial: {
        opacity: 0,
        scale: 0,
        rotate: -180
    },
    animate: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            duration: 2.5,
            ease: "easeOut",
            delay: 1
        }
    }
};

export const heroTitle = {
    initial: {
        opacity: 0,
        y: 50,
        scale: 0.9
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 1,
            ease: "easeOut",
            type: "spring",
            bounce: 0.3,
            delay: 3
        }
    }
};

export const heroSubtitle = {
    initial: {
        opacity: 0,
        y: 30
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            ease: "easeOut",
            delay: 4
        }
    }
};

export const heroCTA = {
    initial: {
        opacity: 0,
        y: 40
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            ease: "easeOut",
            delay: 5
        }
    }
};

// ============ NAVBAR ANIMATIONS ============

export const navbarSlideDown = {
    initial: {
        opacity: 0,
        y: -20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: 2
        }
    }
};

export const navItem = {
    initial: {
        opacity: 0,
        y: -10
    },
    animate: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            delay: 2.2 + (i * 0.1),
            ease: "easeOut"
        }
    })
};

// ============ BACKGROUND BLUR ANIMATIONS ============

export const backgroundBlur1 = {
    initial: {
        opacity: 0,
        scale: 0
    },
    animate: {
        opacity: 0.4,
        scale: 1,
        transition: {
            duration: 4,
            ease: "easeOut",
            delay: 5
        }
    }
};

export const backgroundBlur2 = {
    initial: {
        opacity: 0,
        x: 100
    },
    animate: {
        opacity: 0.3,
        x: 0,
        transition: {
            duration: 2,
            ease: "easeOut",
            delay: 5
        }
    }
};

export const backgroundBlur3 = {
    initial: {
        opacity: 0,
        x: -100
    },
    animate: {
        opacity: 0.2,
        x: 0,
        transition: {
            duration: 3,
            ease: "easeOut",
            delay: 5
        }
    }
};

// ============ SCROLL INDICATOR ANIMATION ============

export const scrollIndicator = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            delay: 6
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

// ============ UTILITY FUNCTIONS ============

// Function untuk create custom delay sequence
export const createStaggerDelay = (index, baseDelay = 0, staggerAmount = 0.1) => {
    return baseDelay + (index * staggerAmount);
};

// Function untuk create responsive animation duration
export const getResponsiveDuration = (baseDuration = 0.8) => {
    const isMobile = window.innerWidth < 768;
    return isMobile ? baseDuration * 0.7 : baseDuration;
};

// Function untuk create bounce animation
export const createBounceAnimation = (delay = 0, duration = 0.8) => ({
    initial: {
        opacity: 0,
        y: 40,
        scale: 0.8
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay,
            duration,
            type: "spring",
            bounce: 0.4,
            damping: 8
        }
    }
});

// Function untuk create slide animation dengan custom direction
export const createSlideAnimation = (direction = 'up', distance = 40, delay = 0) => {
    const directions = {
        up: {
            y: distance
        },
        down: {
            y: -distance
        },
        left: {
            x: distance
        },
        right: {
            x: -distance
        }
    };

    return {
        initial: {
            opacity: 0,
            ...directions[direction]
        },
        animate: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                delay,
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };
};

// Function untuk create scale animation dengan custom scale
export const createScaleAnimation = (initialScale = 0.8, delay = 0, duration = 0.8) => ({
    initial: {
        opacity: 0,
        scale: initialScale
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            delay,
            duration,
            ease: "easeOut"
        }
    }
});

// Function untuk create rotation animation
export const createRotateAnimation = (rotation = 180, delay = 0) => ({
    initial: {
        opacity: 0,
        rotate: -rotation,
        scale: 0.5
    },
    animate: {
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: {
            delay,
            duration: 1,
            ease: "easeOut"
        }
    }
});

// ============ HOVER ANIMATIONS ============

export const hoverScale = {
    scale: 1.05,
    transition: {
        duration: 0.3,
        ease: "easeOut"
    }
};

export const hoverLift = {
    y: -5,
    transition: {
        duration: 0.3,
        ease: "easeOut"
    }
};

export const hoverGlow = {
    boxShadow: "0 0 20px rgba(46, 224, 241, 0.5)",
    transition: {
        duration: 0.3,
        ease: "easeOut"
    }
};

export const hoverRotate = {
    rotate: 5,
    scale: 1.05,
    transition: {
        duration: 0.3,
        ease: "easeOut"
    }
};

// ============ LOADING ANIMATIONS ============

export const pulseAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
    }
};

export const spinAnimation = {
    rotate: 360,
    transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
    }
};

export const bounceAnimation = {
    y: [0, -20, 0],
    transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
    }
};

// ============ MODAL/OVERLAY ANIMATIONS ============

export const modalOverlay = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: "easeIn"
        }
    }
};

export const modalContent = {
    initial: {
        opacity: 0,
        scale: 0.8,
        y: 50
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: 50,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

// ============ CUSTOM EASING CURVES ============

export const customEasing = {
    spring: [0.68, -0.55, 0.265, 1.55],
    bounce: [0.68, -0.6, 0.32, 1.6],
    smooth: [0.25, 0.46, 0.45, 0.94],
    sharp: [0.4, 0, 0.2, 1],
    standard: [0.4, 0, 0.2, 1]
};

// ============ EXPORT COLLECTIONS ============

// Collection untuk fade animations
export const fadeAnimations = {
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    fadeInScale
};

// Collection untuk slide animations
export const slideAnimations = {
    slideInFromBottom,
    slideInFromTop
};

// Collection untuk scale animations
export const scaleAnimations = {
    scaleIn,
    fadeInScale
};

// Collection untuk page transitions
export const pageTransitions = {
    pageTransition,
    pageSlideUp,
    pageFade
};

// Collection untuk hero animations
export const heroAnimations = {
    heroLogo,
    heroTitle,
    heroSubtitle,
    heroCTA
};

// Collection untuk hover effects
export const hoverEffects = {
    hoverScale,
    hoverLift,
    hoverGlow,
    hoverRotate
};

// Default export dengan semua animations
export default {
    fade: fadeAnimations,
    slide: slideAnimations,
    scale: scaleAnimations,
    page: pageTransitions,
    hero: heroAnimations,
    hover: hoverEffects,
    stagger: {
        staggerContainer,
        staggerItem
    },
    navbar: {
        navbarSlideDown,
        navItem
    },
    background: {
        backgroundBlur1,
        backgroundBlur2,
        backgroundBlur3
    },
    scroll: {
        scrollIndicator
    },
    modal: {
        modalOverlay,
        modalContent
    },
    loading: {
        pulseAnimation,
        spinAnimation,
        bounceAnimation
    },
    utils: {
        createStaggerDelay,
        getResponsiveDuration,
        createBounceAnimation,
        createSlideAnimation,
        createScaleAnimation,
        createRotateAnimation
    },
    easing: customEasing
};
