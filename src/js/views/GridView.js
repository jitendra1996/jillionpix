export class GridView {
  #SPACING = 5;
  #AXIS_MARGIN = 20;

  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.setAttribute("width", document.documentElement.clientWidth);
    this.canvas.setAttribute("height", Math.ceil(2200000/document.documentElement.clientWidth));
    this.ctx = this.canvas.getContext("2d");
    // this.ctx.scale(1,1);
    this.bbox = this.canvas.getBoundingClientRect();
    this.width = this.canvas.width;
    this.height =this.canvas.height;
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 0.5;
    this.drawGrid();
  }

  horizontalLines() {
    while (this.height >= 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height);
      this.ctx.lineTo(this.canvas.width, this.height);
      this.ctx.stroke();
      this.height -= this.#SPACING;
    }
  }

  verticalLines() {
    while (this.width >= 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.width, 0);
      this.ctx.lineTo(this.width, this.canvas.height);
      this.ctx.stroke();
      this.width -= this.#SPACING;
    }
  }

  drawGrid() {
    this.ctx.clearRect(0, 0, this.bbox.width, this.bbox.height);
    this.horizontalLines();
    this.verticalLines();
  }

  windowToCanvas(x, y) {
    return {
      x: x - this.bbox.left * (this.canvas.width / this.bbox.width),
      y: y - this.bbox.top * (this.canvas.height / this.bbox.height),
    };
  }
}


