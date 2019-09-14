export class Point {
    coordinates: number[] = [];

    constructor(coordinates: number[]) {
        this.coordinates = coordinates;
    }

    add(point: Point): Point {
        const sumCoordinates = this.coordinates.map((coordinate, i) => {
            return coordinate + point.coordinates[i];
        });
        const sumPoint = new Point(sumCoordinates);
        return sumPoint;
    }
}