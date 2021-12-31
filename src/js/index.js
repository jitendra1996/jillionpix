import { elements } from "./views/base";
import { GridView } from "./views/GridView";
import { ImageBox } from "./views/ImageBox";

window.onload =function () {
  const grid = new GridView(elements.canvas);
  const croodData = [];
    fetchData(croodData);
    elements.canvas.addEventListener("click", function(e){
      whenClicked(e , grid , croodData);
    });
};


document.querySelector("body").style.overflow = "hidden";


window.onresize=function(e){
  const grid = new GridView(elements.canvas);
  const croodData = [];
  fetchData(croodData);
  elements.canvas.addEventListener("click", function(e){
  whenClicked(e , grid , croodData);
});
}



function fetchData(croodData){
  fetch("/d")
  .then((d) => {
    return d.json();
  })
  .then((d) => {
    for (let i = 0; i < d.length; i++) {
      const imageData = {};
      const img1 = new Image();
      img1.src = d[i].image;
      imageData["id"] = i;
      imageData["img"] = img1;
      img1.onload = function () {
        if (d[i].status === "true") {
          imageData["area"] = d[i].width*d[i].height;
          imageData["topLeftCoord"] = [d[i].xcoordinate, d[i].ycoordinate];
          imageData["topRightCoord"] = [
            d[i].xcoordinate + d[i].width,
            d[i].ycoordinate,
          ];
          imageData["bottomRightCoord"] = [
            d[i].xcoordinate + d[i].width,
            d[i].ycoordinate + d[i].height,
          ];
          imageData["bottomLeftCoord"] = [
            d[i].xcoordinate,
            d[i].ycoordinate + d[i].height,
          ];
          imageData["links"] = [...d[i].links];
          imageData["username"] = d[i].username;
          croodData.push(imageData);
          elements.canvas
            .getContext("2d")
            .drawImage(
              img1,
              d[i].xcoordinate,
              d[i].ycoordinate,
              d[i].width,
              d[i].height
            );
        }
      };
    }
  })
  .catch((err) => {
    console.log("Server Error");
  }); 
}


function whenClicked(e , grid , croodData){
  e.preventDefault();
  const coord = grid.windowToCanvas(e.clientX, e.clientY);
  let scrollingPoints = document.querySelector(".canvas__container").scrollTop;
  croodData.forEach((el) => {
    const isLie = ImageBox.pointsLieInsideCurve(
      el.topRightCoord[0],
      el.topRightCoord[1],
      el.bottomLeftCoord[0],
      el.bottomLeftCoord[1],
      coord.x,
      coord.y + scrollingPoints
    );
    if (isLie) {
      const backdrop = document.getElementById("backdrop");
      const popUpImageDiv = document.createElement("div");
      popUpImageDiv.className="popUpImage";
      popUpImageDiv.append(el.img);
      const popUpLinkDiv = document.createElement("div");
      popUpLinkDiv.className="popUpLink"; 
      //creating popUp links
      const pEl = document.createElement("p");
      const h1 = document.createElement("h1");
      h1.textContent=el.username;
      pEl.append(h1);
      el.links.forEach((link) => {
        if(link){
          const linkEl = document.createElement("a");
          linkEl.href = link;
          linkEl.textContent = link;
          pEl.append(linkEl);
        }
      });
      
      backdrop.style.display = 'block';
      popUpLinkDiv.append(pEl);
      backdrop.append(popUpImageDiv);
      backdrop.append(popUpLinkDiv);

      backdrop.onclick = function(){
        backdrop.removeChild(popUpImageDiv);
        backdrop.removeChild(popUpLinkDiv);
        backdrop.style.display = 'none';
      };
    }
  });
}