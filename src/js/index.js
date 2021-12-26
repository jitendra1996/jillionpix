import { elements } from "./views/base";
import { GridView } from "./views/GridView";
import { ImageBox } from "./views/ImageBox";

const grid = new GridView(elements.canvas);

const croodData = [];

window.onload =function () {
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
};

elements.canvas.addEventListener("click", function(e){
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
      const popUpDiv = document.createElement("div");
      popUpDiv.className = "popUp";
      const toolTip = document.getElementById("tooltip");
      const toolTipBody = document.importNode(toolTip.content, true);

      //creating popUp links
      el.links.forEach((link) => {
        const pEl = document.createElement("p");
        const linkEl = document.createElement("a");
        linkEl.href = link;
        linkEl.textContent = link;
        pEl.append(linkEl);
        toolTipBody.append(pEl);
      });

      popUpDiv.append(toolTipBody);
      const x = el.topLeftCoord[0] + 40;
      const y = el.topLeftCoord[1] - scrollingPoints + 60;
      popUpDiv.style.position = "absolute";
      popUpDiv.style.left = x + "px";
      popUpDiv.style.top = y + "px";
      document.querySelector(".canvas__container").append(popUpDiv);
      
      // remove when we click on popUpDiv
      popUpDiv.onclick = function () {
        document.querySelector(".canvas__container").removeChild(popUpDiv);
      };

      // auto clear popUpDiv
      setTimeout((e) => {
        try {
          document.querySelector(".canvas__container").removeChild(popUpDiv);
        } catch {}
      }, 5000);

    }
  });
});

document.querySelector("body").style.overflow = "hidden";

