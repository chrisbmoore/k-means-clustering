import { Membership } from "./membership";
import { Point } from "./point";
import { Cluster } from "./cluster";

export class KMeansGenerator {
    private _k: number;
    private _points: Point[];
    private _memberships: Membership[] = [];
    private _clusters: Cluster[] = [];
    private _dimensions: number;

    constructor(data: number[][], k: number) {
        this._k = k;
        // Convert raw vectors to Points.
        this._points = this.convertDataToPoints(data);
        // Calculate dimensions from Points.
        this._dimensions = this._points.length ? this._points[0].coordinates.length : 0;
        this._clusters = this.initializeClusters(k, this._points);
    }

    private convertDataToPoints(data: number[][]): Point[] {
        return data.map(d => new Point(...d));
    }

    private initializeClusters(k: number, points: Point[]): Cluster[] {
        const centroids: Point[] = this.initialCentroids(k, points);
        const clusters: Cluster[] = [...Array(k).keys()].map(i => {
            const cluster = new Cluster();
            cluster.centroid = centroids[i];
            return cluster;
        });
        return clusters;
    }

    private initialCentroids(k: number, points: Point[]): Point[] {
        let possiblePoints = [...points];
        const centroids: Point[] = [...Array(k).keys()].map(i => {
            const index = Math.floor(Math.random() * possiblePoints.length);
            const point = possiblePoints.splice(index, 1)[0]; // Remove the item from the array
            return point;
        });
        return centroids;
    }
}