export class ImageBox{
    static pointsLieInsideCurve(topRightXCoord,topRightYCoord,bottomLeftXCoord,bottomLeftYCoord,x,y){
        if(x < topRightXCoord && x > bottomLeftXCoord && y > topRightYCoord && y < bottomLeftYCoord){
            return true;
        }
        return false;
    }
}



