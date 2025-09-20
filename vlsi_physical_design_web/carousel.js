document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel__track');
    if (!track) return; // Exit if carousel isn't on this page

    const tiles = Array.from(track.children);
    const nextButton = document.querySelector('.carousel__arrow--right');
    const prevButton = document.querySelector('.carousel__arrow--left');

    // Helper to lazy-load background images
    const loadTileBackground = (tile) => {
        if (!tile) return;
        const content = tile.querySelector('.tile__content');
        // Check if the data-bg attribute exists and if the image hasn't been loaded yet
        if (content && content.dataset.bg && !content.style.backgroundImage) {
            content.style.backgroundImage = content.dataset.bg;
        }
    };

    // Determine number of visible tiles based on window width
    const getVisibleTiles = () => window.innerWidth <= 768 ? 1 : 3;

    let visibleTiles;
    let tileWidth;
    let currentIndex;

    // Function to move the track and update selected tile
    const moveToTile = (targetIndex) => {
        const currentTile = track.querySelector('.is-selected');
        const targetTile = tiles[targetIndex];

        if (!targetTile) return;
        
        // Calculate the amount to move the track
        const amountToMove = (targetIndex - Math.floor(visibleTiles / 2)) * tileWidth;
        track.style.transform = 'translateX(-' + amountToMove + 'px)';

        if (currentTile) {
            currentTile.classList.remove('is-selected');
        }
        targetTile.classList.add('is-selected');

        // Lazy load the current tile and its immediate neighbors
        loadTileBackground(tiles[targetIndex - 1]);
        loadTileBackground(targetTile);
        loadTileBackground(tiles[targetIndex + 1]);

        currentIndex = targetIndex;
        updateArrows();
    };

    // Function to show/hide arrows at the ends of the carousel
    const updateArrows = () => {
        if (currentIndex === 0) {
            prevButton.classList.add('is-hidden');
            nextButton.classList.remove('is-hidden');
        } else if (currentIndex === tiles.length - 1) {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.add('is-hidden');
        } else {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.remove('is-hidden');
        }
    };

    const setupCarousel = () => {
        visibleTiles = getVisibleTiles();
        if (tiles.length === 0) return;
        tileWidth = tiles[0].getBoundingClientRect().width;
        currentIndex = Math.floor(visibleTiles / 2);
        moveToTile(currentIndex);
    }

    // Initial setup
    setupCarousel();

    // Event listener for the "next" button
    nextButton.addEventListener('click', () => {
        if (currentIndex < tiles.length - 1) {
            moveToTile(currentIndex + 1);
        }
    });

    // Event listener for the "previous" button
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            moveToTile(currentIndex - 1);
        }
    });

    // Recalculate on window resize
    window.addEventListener('resize', () => {
        setupCarousel();
    });
});