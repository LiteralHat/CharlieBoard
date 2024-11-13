//init the stuff
const images = document.querySelectorAll('.draggable');
const itemsBox = document.getElementById('itemsBox');
const soundPickUp = new Audio('sfx/pickup.mp3');
const soundDrop = new Audio('sfx/dropped.mp3');
soundPickUp.volume = 0.2;
soundDrop.volume = 0.1;

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

// just important variables
let zIndex = 2;
let isDarkMode = 0;
const artTools = ['brush', 'paint', 'lapiz', 'goma'];

function enableInteract() {
    images.forEach(image => {
        image.style.pointerEvents = 'auto';
        image.addEventListener('mousedown', mouseDown);
        image.addEventListener('mouseover', mouseOver);

    });
}

function disableInteract() {
    images.forEach(image => {
        if (!artTools.includes(image.id)) {
            image.style.pointerEvents = 'none';
            image.removeEventListener('mouseout', mouseOut);
            image.removeEventListener('mousedown', mouseDown);
            image.removeEventListener('mouseover', mouseOver);
        }
    });
}

// for simply hovering it will brighten the image
function mouseOver(e) {


    this.style.filter = 'drop-shadow(0px 0px 2px rgba(3, 1, 23, 0.831)) brightness(110%) ';
    this.addEventListener('mouseout', mouseOut);
    this.style.cursor = 'pointer';
    this.style.pointerEvents = 'auto';

}

// when user stops hovering
function mouseOut(e) {
    this.style.filter = 'drop-shadow(0px 0px 3px rgba(3, 1, 23, 0.831))';
    this.removeEventListener('mouseout', mouseOut);
}

//when mouseclick is detected
function mouseDown(e) {

    soundPickUp.play();
    // move image to top
    this.style.zIndex = zIndex++;

    // Start dragging
    isDragging = false;

    //transformation stuff
    e.preventDefault();
    let startX = e.clientX;
    let startY = e.clientY;
    let newX = 0;
    let newY = 0;

    //cosmetic
    this.style.filter = 'drop-shadow(2px 2px 4px rgba(3, 1, 23, 0.831)) brightness(110%)';
    this.style.transform = 'scale(1.03)';
    soundDrop.volume = 0.02;

    // if user actually moves the mouse
    const mouseMove = (e) => {

        soundDrop.volume = 0.1;
        e.preventDefault();
        // Calculate new position
        newX = startX - e.clientX;
        newY = startY - e.clientY;

        // Update starting position
        startX = e.clientX;
        startY = e.clientY;

        //cosmetic
        this.style.filter = 'drop-shadow(10px 10px 7px rgba(3, 1, 23, 0.531)) brightness(110%)';
        this.style.transform = 'scale(1.05)';

        // Move the this
        this.style.top = (this.offsetTop - newY) + 'px';
        this.style.left = (this.offsetLeft - newX) + 'px';

        isDragging = true;
    }

    const mouseUp = (e) => {
        soundDrop.play();

        //cosmetic effects
        this.style.filter = 'drop-shadow(0px 0px 3px rgba(3, 1, 23, 0.831)) brightness(110%)';
        this.style.transform = 'scale(1)';

        //if its a bowtie it will randomly rotate it a certain amount when its dropped
        if (e.target.id.includes('bowtie')) {
            let bowtieRotation = Math.floor(Math.random() * 80) - 40;
            this.style.transform = 'rotate(' + bowtieRotation + 'deg)';
        }


        // Remove event listeners when mouse is released
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
        this.addEventListener('mouseover', mouseOver);
        savePosition(this);
    }

    // Add event listeners for mousemove and mouseup
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

}

//prevents link from opening if the user has dragged the thing
this.addEventListener('click', function (e) {
    if (isDragging) {
        e.preventDefault(); // Prevent the link from being activated
    }
});

//adds sticky note
function sticky(color) {
    if (!isDragging) {
        let sticky = document.getElementById(color);
        let container = document.getElementById('container');
        var imgTop = sticky.style.top;
        var imgLeft = sticky.style.left;
        var newDiv = document.createElement('div');
        newDiv.innerHTML = '<img src="img/' + color + '-one.png"/>'


        newDiv.classList.add('draggable');
        newDiv.addEventListener('mousedown', mouseDown);
        newDiv.addEventListener('mouseover', mouseOver);

        newDiv.style.position = 'absolute';
        newDiv.style.zIndex = sticky.style.zIndex + 2;
        newDiv.style.top = imgTop;
        newDiv.style.left = imgLeft;

        container.appendChild(newDiv);

    }
}


//changes the overlay div to be visible, it's already there but you can't see it. essentially when lamp is clicked it will change the opacity
function lights() {
    if (!isDragging) {
        const overlay = document.getElementById('overlay');
        const bg = document.body;

        if (isDarkMode === 0) {
            overlay.style.opacity = 1;
            isDarkMode = 1;
        } else {
            overlay.style.opacity = 0;
            isDarkMode = 0;
        }
    } else {

    }
}


let painting = false;
let paintMode = false;

function paint(toolname) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext("2d");

    function startPosition(e) {
        if (paintMode) {
            painting = true;
            draw(e);
        }
    }

    function endPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#782434";
        ctx.shadowColor = "#782434";
        ctx.shadowBlur = 4;

        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    if (paintMode == false && !isDragging) {
        paintMode = true;
        console.log('paintmode on');
        console.log('selected tool ' + toolname);

        disableInteract();

        canvas.addEventListener("mousedown", startPosition);
        canvas.addEventListener("mouseup", endPosition);
        canvas.addEventListener("mousemove", draw);
    } else {
        paintMode = false;
        enableInteract();

        painting = false;

        console.log('paintmode off');

        canvas.removeEventListener("mousedown", startPosition);
        canvas.removeEventListener("mouseup", endPosition);
        canvas.removeEventListener("mousemove", draw);

    }
}

enableInteract();
// loads the stuff in case previous 'save' is detected. SUFFER.
window.addEventListener('load', loadPositions);