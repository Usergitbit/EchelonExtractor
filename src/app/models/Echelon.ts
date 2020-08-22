export class Echelon {
    private static idCounter = 0;

    public imageData: ImageData = new ImageData(1, 1);
    public isSelected: boolean = true;

    private _id: number = Echelon.idCounter++;
    public get id(): number {
        return this._id;
    }

    public constructor(imageData: ImageData, selected?: boolean) {
        this.imageData = imageData;
    }
}