// Reload the page when the window is resized
window.onresize = function() {
    location.reload();
}

// Select the canvas element for drawing and get the 2D drawing context
let tfCanvas = document.querySelector("#transferCanvas"); // the id for hiustogram
var c = tfCanvas.getContext("2d");

// Initialize mouse so that we can track the mouse position and if we click with it
var mouse = { x: 0, y: 0, down: false, nodeSelected: -1 }; // -down: false nothing is clicked, -1 no node is selected

// Function to get mouse position relative to the histogram canvas. just so we know if we are within its border and clickable nodes
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(); // Get the bounding dimensions and position  of the canvas
    return {
        x: evt.clientX - rect.left, // Calculate mouse x position relative to the canvas
        y: evt.clientY - rect.top // Calculate mouse y position -''-
    };
}

// Event listener for when we move the mouse, to update mouse position and selection state
window.addEventListener('mousemove', function(e) {
    var mousePos = getMousePos(tfCanvas, e); // Get the current mouse position

    // Update mouse object with current position and button state
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
    mouse.down = e.buttons == 1; // Check if the left mouse button is pressed
    console.log(mouse);
    console.log(e.buttons == 1); // DEBUGGING
    if (e.buttons == 0) { // If no button is pressed, 
        mouse.nodeSelected = -1; // then no node are selected
    }
}, false); // false if we not within the window border

// Event listener for when we trigger with mouse button release
window.addEventListener('mouseup', function(e) {
    triggerTransferFunctionUpdate(); // Trigger the transfer function.
}, false); // false if we not release the button

function Node(x, y, radius, color, moveHorizontally, type) {
    this.x = x; // X-coordinate of the node
    this.y = y; // Y-coordinate of the node
    radius = 15; // radius of the circle making the node is set to 15 
    this.color = color; // Color of the node
    this.moveHorizontally = moveHorizontally; // Boolean indicating if node is horizontally movable
    this.type = type; // Type of the node 0,1,2,3,

    // Method to draw the circle of the node on the histogram canvas
    this.draw = function() {
        c.beginPath(); // Starting a new shape (a circle)
        c.arc(this.x, this.y, radius, 0, Math.PI * 2, false); // Draw a circle
        c.fillStyle = this.color; // Set fill color for the circle
        c.fill(); // Fill the circle
        c.stroke(); // Outline the circle
    }

    // Method to update the circle's ( just draws a new circle)
    this.update = function() {
        this.draw(); // Draw the updated circle
    }
}

var interactDist = 30; // How close to the node is dragable/clickable
var circleArrayNode = []; //  Array that contains the nodes available for dragging

/* mouse.nodeSelected holds the index of the currently selected node within the circleArrayNode array.  */

function DragNode() {
    if (mouse.down) { // if left mouse button pressed
        //select a node
        if (mouse.nodeSelected == -1) { // if no nodes are selected currently
            for (let i = 0; i < circleArrayNode.length; i++) {// iterates through the circleArrayNode array 
                if (Math.abs(mouse.x - circleArrayNode[i].x) < interactDist && Math.abs(mouse.y - circleArrayNode[i].y) < interactDist) { // to find a node close enough to the mouse cursor (within interactDist)

                    /*Math.abs(mouse.x - circleArrayNode[i].x) < interactDist 
                      we check if the mouse distance in x and y direction and neare node distance between is 30*/

                    mouse.nodeSelected = i; // If a node is found, its index is stored in mouse.nodeSelected and we can drag that node
                }
            }
        }

        // Move that node
        if (mouse.nodeSelected > -1 && mouse.nodeSelected < circleArrayNode.length) { // Check if a node is selected (mouse.nodeSelected > -1) 
                                                                                      // Check if selected node index is within the bounds of the circleArrayNode
            // TOP left
            if (circleArrayNode[mouse.nodeSelected].type == 0) {
                // 50 and 425 is so we within the canvas and check mouse x pos is less than TOP right NODe and if top LEFT is not is further in x axis than top RIGHT node
                if (mouse.y > 50 && mouse.y < 425 && mouse.x < circleArrayNode[mouse.nodeSelected + 1].x && mouse.x > circleArrayNode[mouse.nodeSelected + 2].x) {
                    circleArrayNode[mouse.nodeSelected].x = mouse.x; // Update node x position to mouse poisiton
                    circleArrayNode[mouse.nodeSelected].y = mouse.y; // Update node y position 
                }
                if (mouse.y > 50 && mouse.y < 425 && mouse.x < circleArrayNode[mouse.nodeSelected + 2].x) {  // so we within border and no drag passed bot LEFT node
                    circleArrayNode[mouse.nodeSelected].x = circleArrayNode[mouse.nodeSelected + 2].x; // Update node x position to position of bot LEFT
                    circleArrayNode[mouse.nodeSelected].y = mouse.y; // Update node y pos
                }
            }

            // TOP right
            if (circleArrayNode[mouse.nodeSelected].type == 1) {
                if (mouse.y > 50 && mouse.y < 425 && mouse.x > circleArrayNode[mouse.nodeSelected - 1].x && mouse.x < circleArrayNode[mouse.nodeSelected + 2].x) {  // so we within border and no drag passed top LEFT, and bot RIGHT node
                    circleArrayNode[mouse.nodeSelected].y = mouse.y; // Update node x pos
                    circleArrayNode[mouse.nodeSelected].x = mouse.x; // Update node y pos
                }
                if (mouse.y > 50 && mouse.y < 425 && mouse.x > circleArrayNode[mouse.nodeSelected + 2].x) {  // so we within border and no drag passed bot RIGHT node
                    circleArrayNode[mouse.nodeSelected].x = circleArrayNode[mouse.nodeSelected + 2].x; // Update node x pos to pos of bot RIGHT
                    circleArrayNode[mouse.nodeSelected].y = mouse.y; // Update node y pos
                }
            }

            // BOT left
            if (circleArrayNode[mouse.nodeSelected].type == 2) {
                if (mouse.x > 50 && mouse.x < 600 && mouse.x < circleArrayNode[mouse.nodeSelected + 1].x && mouse.x < circleArrayNode[mouse.nodeSelected - 1].x) {  // so we within border and no drag passed bot,top RIGHT
                    circleArrayNode[mouse.nodeSelected].x = mouse.x; // Update node x pos
                    if (mouse.x > circleArrayNode[mouse.nodeSelected - 2].x) { // If mouse x pos is more than  top LEFT node
                        circleArrayNode[mouse.nodeSelected - 2].x = circleArrayNode[mouse.nodeSelected].x; // then  set x pos of top LEFT same as bot LEFT
                    }
                }
            }
            
            // BOT right
            if (circleArrayNode[mouse.nodeSelected].type == 3) {
                if (mouse.x > 50 && mouse.x < 600 && mouse.x > circleArrayNode[mouse.nodeSelected - 1].x && mouse.x > circleArrayNode[mouse.nodeSelected - 3].x) {// so we within border and no drag passed bot,top LEFT
                    circleArrayNode[mouse.nodeSelected].x = mouse.x; // Update node x pos
                    if (mouse.x < circleArrayNode[mouse.nodeSelected - 2].x) { // If mouse x pos is less than  top RIGHT node
                        circleArrayNode[mouse.nodeSelected - 2].x = circleArrayNode[mouse.nodeSelected].x; // then  set x pos of top RIGHT same as bot RIGHT
                    }
                }
            }
        }
    }
}

function hexToRgb(hex) { // Function to make hex to rgb 255. hexadecimal = base 16, 16^n
    let r = parseInt(hex.substring(1, 3), 16); // RED, make string into a decimal int
    let g = parseInt(hex.substring(3, 5), 16); // GREEN
    let b = parseInt(hex.substring(5, 7), 16); // BLUE
    return [r, g, b];
}

  /*
function rgbToHex(rgb) {
    return "#" + (1 << 24 | rgb[0] << 16 | rgb[1] << 8 | rgb[2]).toString(16).slice(1);
}*/

function ChangeColor(e) {
    let color = e.value; // Get the selected color from the event object
    let index = (e.name[e.name.length - 1] - 1) * 4; // Calculate the index of the nodes to update
  
    //Update colors of nodes based on the selected color
    circleArrayNode[index].color = color; // Assign selected color to node TOP LEFT
    circleArrayNode[index + 1].color = color; // Assign selected color to  TOP RIGHT
    
    e.value = color;
}

var colorArray = [ // 4 färger, kan addera mer här om vi vill
    "#FF0000", // Röd
    "#00FF00", // Grön
    "#0000AA", // Blå
    "#000000", // Svart, för bot noder
];
  
var startX = 150; // Start position in X axis

// Function to make the 3 defined nodes (r,g,b) from the start in the histogram
function createPairNodes(start) {
    let nodeBlack = colorArray[3]; // Black (from the [var colorArray])

    // RÖD NODES
    let nodeColor = colorArray[0]; // Red (from the [var colorArray])
    let redtopleft = new Node(startX - 40, 275, interactDist, nodeColor, true, 0); // Node position in the histogram
    let redtopright = new Node(startX + 50, 275, interactDist, nodeColor, true, 1);
    let redstart = new Node(startX - 40, 425, interactDist, nodeBlack, false, 2); // False indicates not moveable in y axis. moveHorizontally = false
    let redend = new Node(startX + 50, 425, interactDist, nodeBlack, false, 3);
    
    circleArrayNode.push(redtopleft); // Add the top left Röd node to the array
    circleArrayNode.push(redtopright); // Add the top right Röd node
    circleArrayNode.push(redstart); // Add the bottom left Röd node
    circleArrayNode.push(redend); // Add the bottom right Röd node

    // GRÖN NODES
    nodeColor = colorArray[1]; // Green
    let greentopleft = new Node(startX + 80, 275, interactDist, nodeColor, true, 0);
    let greentopright = new Node(startX + 180, 275, interactDist, nodeColor, true, 1);
    let greenstart = new Node(startX + 80, 425, interactDist, nodeBlack, false, 2);
    let greenend = new Node(startX + 180, 425, interactDist, nodeBlack, false, 3);
    
    circleArrayNode.push(greentopleft); //Same as the röd nodes but for grön
    circleArrayNode.push(greentopright);
    circleArrayNode.push(greenstart);
    circleArrayNode.push(greenend);

    // Blå NODES
    nodeColor = colorArray[2]; // Blue
    let bluetopleft = new Node(startX + 220, 275, interactDist, nodeColor, true, 0);
    let bluetopright = new Node(startX + 320, 275, interactDist, nodeColor, true, 1);
    let bluestart = new Node(startX + 220, 425, interactDist, nodeBlack, false, 2);
    let blueend = new Node(startX + 320, 425, interactDist, nodeBlack, false, 3);
    
    circleArrayNode.push(bluetopleft); //Same as the röd nodes but for blue
    circleArrayNode.push(bluetopright);
    circleArrayNode.push(bluestart);
    circleArrayNode.push(blueend);
}

createPairNodes(startX); // Make all node from startX position = 150

// Denna funktion hämtar data om noder från en lista av cirklar.
function getNodeData() {
    var data = []; // Skapa en tom lista för att lagra noddata.

    // Loopa igenom arrayen circleArrayNode, tar 4 steg varje gång.
    // Varje nod verkar bestå av 4 element (x, opacityStart, opacityEnd, färg).
    for (let i = 0; i < circleArrayNode.length; i += 4) {
      

        // Beräkna start genomskinlighet för noden baserat på dess x och y koordinater. rangen vi har är 600 och 50 minsta värde på 50 högst 600 och för y led minst 35 störst 425
        let opacityStart = [
            Math.round(255 * (circleArrayNode[i].x - 50) / (600 - 50)), // Beräkna en röd för opacitet
            Math.round(255 * (1 - (circleArrayNode[i].y - 35) / (425 - 35))) // Beräkna en grön för opacitet
        ];

        // Beräkna slut genomskinlighet för noden baserat på nästa nod i listan.
        let opacityEnd = [
            Math.round(255 * (circleArrayNode[i + 1].x - 50) / (600 - 50)), // Beräkna en röd för slutopacitet
            Math.round(255 * (1 - (circleArrayNode[i + 1].y - 35) / (425 - 35))) // Beräkna en grön för slutopacitet
        ];

        // Beräkna start- och slutvärden för noden.
        let start = Math.round(255 * (circleArrayNode[i + 2].x - 50) / (600 - 50)); // Beräkna startvärdet
        let end = Math.round(255 * (circleArrayNode[i + 3].x - 50) / (600 - 50)); // Beräkna slutvärdet

        // Konvertera färg från hex-format till RGB-format.
        let color = hexToRgb(circleArrayNode[i].color); // Omvandla hex-färg till RGB.


        // Lägg till ett objekt med noddata till listan 'data'.
        data.push({ 
            opacityStart: opacityStart, // Lägg till start opacitet.
            opacityEnd: opacityEnd,     // Lägg till slut opacitet.
            start: start,               // Lägg till startvärde.
            end: end,                   // Lägg till slutvärde.
            color: color                // Lägg till färg.
        });
    }

    return data; // Returnera listan med noddata.
}
  
var histData = Array.from(Array(256)).fill(0);
  
/*
[loadRawData] process the raw data in the loadRawData function and
 store the results in the histData array. 
 This array will be used to plot the histogram.

 */
function loadRawData(loadRawData) {
    // console.log(loadRawData);
  
    for (let i = 0; i < loadRawData.length; i++) {
      histData[loadRawData[i]]++;
    }
    // log all data
    for (let i = 0; i < histData.length; i++) {
      histData[i] = Math.log(histData[i] + 1);
    }
  
    let histMax = Math.max(...histData);
    // console.log(histMax);
    // console.log(histData);
    for (let i = 0; i < histData.length; i++) {
      histData[i] = histData[i] / histMax;
    }
    // console.log(Math.min(...histData));
    // console.log(histData);
}
  
// default text color och line color for drawing
let textColor = "Black";

/*In the [drawHist] function, the histogram is drawn based on the processed histData.
 The loop within this function determines how each histogram bar is drawn:'
*/
function drawHist() {
    let yDiff = (425 - 35) / 2;
    /* the range for the Y-axis is set from 35 (the top) to 425 (the bottom). 
    This means the total height available for the histogram is 390*/

    let scaledHistData = Array.from(Array(256)).fill(0);
    for (let i = 0; i < histData.length; i++) {
      scaledHistData[i] = (1 - histData[i]) * yDiff + yDiff + 35;
    }
    console.log(Math.min(...scaledHistData)); // CONSOLE för kolla
  
    let xStep = (600 - 50) / 256; // Width of the histogram
    console.log(scaledHistData);
    /*The histogram has a total width of 550 pixels, 
    with each of the 256 bins approximately 2.15 pixels wide. */

  
    c.fillStyle = textColor;
    c.beginPath();
    c.moveTo(50, scaledHistData[0]);
    for (var i = 1; i < scaledHistData.length; i++) {
      c.lineTo(50 + i * xStep, scaledHistData[i]);
    }
}
  
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
  
    // HISTOGRAM X axis and Y axis line
    c.fillStyle = textColor;
    c.beginPath(); // Create the histogram 
    c.moveTo(50, 35);
    c.lineTo(50, 425);
    c.lineTo(600, 425);
    c.lineWidth = 5;
    c.strokeStyle = textColor;
    c.stroke();
  
    // SIDE LINE OPACITY AND VALUE TEXT
    c.font = "25px sans-serif"; //Font property expects a string that combines both the size and the font.
    c.fillText("Opacitet", 5, 30); // 5,30 is (x,y), that beign the position of where its placed.
    c.fillText("Värde", 575, 400);
  
    drawHist(); // Make the histogram
  
    for (let i = 0; i < circleArrayNode.length; i += 4) {
        c.beginPath();
        c.moveTo(circleArrayNode[i + 2].x, circleArrayNode[i + 2].y);
        c.lineTo(circleArrayNode[i].x, circleArrayNode[i].y);
        c.lineTo(circleArrayNode[i + 1].x, circleArrayNode[i + 1].y);
        c.lineTo(circleArrayNode[i + 3].x, circleArrayNode[i + 3].y);
        c.lineWidth = 3;
        c.stroke();
    }
  
    c.lineWidth = 1;
    for (var i = 0; i < circleArrayNode.length; i++) {
        circleArrayNode[i].update();
    }
    DragNode();
}

animate();