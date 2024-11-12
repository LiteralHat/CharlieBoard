const images = document.querySelectorAll('.draggable');
const itemsBox = document.getElementById('itemsBox');

// function loadPositions() {
//     images.forEach(image => {
//         const savedPosition = JSON.parse(localStorage.getItem(image.id)); // Assuming each image has a unique id
//         if (savedPosition) {
//             image.style.top = savedPosition.top;
//             image.style.left = savedPosition.left;
//         }
//     });
// }

// Suffer, if you've moved anything. SUFFER.
function savePosition(image) {
    const position = {
        top: image.style.top,
        left: image.style.left
    };
    localStorage.setItem(image.id, JSON.stringify(position));
}


images.forEach(image => {
    image.addEventListener('mousedown', mouseDown);


    function mouseDown(e) {
        e.preventDefault();
        // Declare initial position of the mouse

        let offset = -10;
        let startX = e.clientX;
        let startY = e.clientY;
        let newX = 0;
        let newY = 0;
        image.style.filter = 'drop-shadow(10px 10px 7px rgba(3, 1, 23, 0.531))';
        image.style.transform = 'scale(1.05)';


        // Add mousemove and mouseup event listeners
        function mouseMove(e) {
            // Calculate new position
            newX = startX - e.clientX;
            newY = startY - e.clientY;

            // Update starting position
            startX = e.clientX;
            startY = e.clientY;

            // Move the image
            image.style.top = (image.offsetTop - newY) + 'px';
            image.style.left = (image.offsetLeft - newX) + 'px';
        }

        function mouseUp() {
            // Remove event listeners when mouse is released
            image.style.filter = 'drop-shadow(0px 0px 3px rgba(3, 1, 23, 0.831))';
            image.style.transform = 'scale(1)';
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            savePosition(image);
        }

        // Add event listeners for mousemove and mouseup
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    }
});


window.addEventListener('load', loadPositions);