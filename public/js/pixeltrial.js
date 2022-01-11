const check_canvas = document.getElementById("check__canvas");
const ctx = check_canvas.getContext('2d');
const pixelAmount = document.getElementById('pix');
const checkBtn = document.getElementById("checkBtn");
const width = document.getElementById('width');
const height = document.getElementById('height');
const blocks = document.getElementById('boxes');
const rows = document.getElementById("rows");
const cols = document.getElementById("cols");
const line_spacing = 5;
ctx.strokeStyle = "#000";
ctx.lineWidth = 0.5;

ctx.scale(1, 1);
function horizontalLines() {
    let h = check_canvas.height;
    while (h >= 0) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(check_canvas.width, h);
        ctx.stroke();
        h -= line_spacing;
    }
}

function verticalLines() {
    let w = check_canvas.width;
    while (w >= 0) {
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(w, check_canvas.height);
        ctx.stroke();
        w -= line_spacing;
    }
}
function drawGrid() {
    ctx.clearRect(0, 0, check_canvas.width, check_canvas.height);
    horizontalLines();
    verticalLines();
}

drawGrid();

function findWidthHeight(pixel) {
    let w = 0;
    let h = 0;
    for (let i = 2; i < pixel; i++) {
        if (pixel % i === 0) {
            if (i === pixel / i) {
                return [i, i];
            } else if (w !== pixel / i) {
                w = i;
                h = pixel / i;
            } else {
                break;
            }
        }
    }
    return [w, h];
}

// function isPrime(num) {
//     for (let i = 2; i < num; i++) {
//         if (num % i === 0) {
//             return false;
//         }
//     }
//     return true;
// }

checkBtn.addEventListener('click', e => {
    e.preventDefault();
    if (pixelAmount.value <= 0) {
        alert('pixels value should be positive integer.');
        pixelAmount.value='';
        return;
    }
    const [cw, ch] = findWidthHeight(pixelAmount.value);
    width.value = cw;
    height.value = ch;
    blocks.value = pixelAmount.value / 25;
    rows.value = ch / 5;
    cols.value = cw / 5;
    check_canvas.setAttribute('width', cw);
    check_canvas.setAttribute('height', ch);
    drawGrid();
});
