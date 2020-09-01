export class Echelon {
    private static idCounter = 0;

    public imageData: ImageData = new ImageData(1, 1);
    public isSelected: boolean = true;

    private id: number = Echelon.idCounter++;
    public get Id(): number {
        return this.id;
    }

    public constructor(imageData: ImageData, selected?: boolean) {
        this.imageData = imageData;
    }
}
