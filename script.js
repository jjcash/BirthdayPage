// ====================================================================
// 1. START SCREEN AND AUDIO LOGIC
// ====================================================================

const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');
const mainContent = document.getElementById('main-content');
const bdaySong = document.getElementById('bday-song');

startButton.addEventListener('click', () => {
    // 1. Hide the start screen
    startScreen.style.display = 'none';

    // 2. Show the main content
    mainContent.style.display = 'block';

    // 3. Play the music
    bdaySong.play().catch(error => {
        console.error("Autoplay failed:", error);
    });

    // 4. Set the initial background color of the body
    const initialSection = document.querySelector('.scroll-section');
    if (initialSection) {
        const initialColor = initialSection.getAttribute('data-color');
        document.body.style.backgroundColor = initialColor;
    }
});


// ====================================================================
// 2. SCROLL INTERSECTION OBSERVER (BG Color Change)
// ====================================================================

const sections = document.querySelectorAll('.scroll-section');

const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.5 // trigger when 50% of the section is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const newColor = entry.target.getAttribute('data-color');
            // Change the body background color smoothly (CSS transition handles smoothness)
            document.body.style.backgroundColor = newColor;

            // Optional: Add a class for entry animations
            entry.target.classList.add('is-visible');
        } else {
            entry.target.classList.remove('is-visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});


// ====================================================================
// 3. DYNAMIC CAROUSEL INJECTION
// ====================================================================

// IMPORTANT: Update this array with the exact file names of your images and videos
const carouselImageFiles = [
    '20250626023931.png',
    '20250626031919.png',
    '20250626034251.png',
    '20250626035949.png',
    '20250628002435.png',
    '20250628025920.png',
    '20250630230106.png',
    '20250710003212.png',
    '20250710003516.png',
    '20250711014033.png',
    '20250711023735.png',
    '20250711031249.png',
    '20250711031318.png',
    '20250716232745.png',
    '20250718231949.png',
    '20250718232431.png',
    '20250718232718.png',
    '20250718232928.png',
    '20250813005034.png',
    '20250819002341.png',
    '20250823010400.png',
    '20250929011413.png',
    '20251001221754.png',
    'genshinVideo.mp4',
    'screenshot1.png',
    'screenshot2.png'
];

const imageDirectory = 'assets/images/genshin/';
const carouselTrack = document.querySelector('.carousel-track');

// Function to check if the file is a video
const isVideo = (fileName) => {
    return fileName.toLowerCase().endsWith('.mp4');
};

// Clear any existing content and inject the images/videos
if (carouselTrack) {
    carouselTrack.innerHTML = '';

    carouselImageFiles.forEach(fileName => {
        const filePath = imageDirectory + fileName;
        
        if (isVideo(fileName)) {
            const video = document.createElement('video');
            video.src = filePath;
            video.controls = true;
            video.muted = true; // Start muted, good practice for autoplay
            video.alt = `Video for my love: ${fileName}`;
            carouselTrack.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = filePath;
            img.alt = `photo: ${fileName}`;
            carouselTrack.appendChild(img);
        }
    });
}


// ====================================================================
// 4. CAROUSEL FUNCTIONALITY
// ====================================================================

const carouselImages = Array.from(carouselTrack ? carouselTrack.children : []);
const nextButton = document.querySelector('.carousel-button.next');
const prevButton = document.querySelector('.carousel-button.prev');
const carouselNav = document.querySelector('.carousel-nav');

if (carouselImages.length > 0 && nextButton && prevButton && carouselNav) {
    // We must recalculate width inside a function for responsive handling
    const getImageWidth = () => carouselImages[0] ? carouselImages[0].getBoundingClientRect().width : 0;
    let currentIndex = 0;

    // Create navigation dots dynamically
    carouselNav.innerHTML = '';
    carouselImages.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('data-index', index);
        carouselNav.appendChild(dot);
    });
    
    // Set the first dot as active
    carouselNav.children[0].classList.add('active');

    const updateCarouselPosition = () => {
        const imageWidth = getImageWidth();
        carouselTrack.style.transform = `translateX(-${imageWidth * currentIndex}px)`;
    };

    const updateDots = (targetIndex) => {
        const currentDot = carouselNav.querySelector('.active');
        const targetDot = carouselNav.children[targetIndex];
        if (currentDot) currentDot.classList.remove('active');
        if (targetDot) targetDot.classList.add('active');
    };

    // When the next button is clicked
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % carouselImages.length; // Loop to start
        updateCarouselPosition();
        updateDots(currentIndex);
    });

    // When the previous button is clicked
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length; // Loop to end
        updateCarouselPosition();
        updateDots(currentIndex);
    });

    // When a nav dot is clicked
    carouselNav.addEventListener('click', e => {
        if (e.target.classList.contains('carousel-dot')) {
            const targetIndex = parseInt(e.target.getAttribute('data-index'));
            currentIndex = targetIndex;
            updateCarouselPosition();
            updateDots(currentIndex);
        }
    });
    
    // Optional: Auto-play functionality
    let autoSlideInterval;
    const startAutoSlide = () => {
        // Clear any existing interval before starting a new one
        clearInterval(autoSlideInterval); 
        autoSlideInterval = setInterval(() => {
            nextButton.click(); // Programmatically click the next button
        }, 5000); // Change slide every 5 seconds
    };

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        // Pause auto-play on hover
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Start auto-play when page loads
    startAutoSlide();

    // Handle window resize to ensure correct position calculation
    window.addEventListener('resize', updateCarouselPosition);
}