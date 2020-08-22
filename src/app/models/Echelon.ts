export class Echelon {
    private static idCounter = 0;
    public imageData: ImageData = new ImageData(1, 1);

    private _id: number = Echelon.idCounter++;
    public get id(): number {
        return this._id;
    }

    public constructor(imageData: ImageData) {
        this.imageData = imageData;
    }
}