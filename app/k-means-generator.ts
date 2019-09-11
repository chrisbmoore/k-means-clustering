import { Membership } from "./membership";
import { Point } from "./point";
import { Cluster } from "./cluster";
import { euclidean } from 'ml-distance-euclidean';

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
        this.updateMemberships(this._points, this._clusters); //TODO reassign _memberships
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

    private updateMemberships(points: Point[], clusters: Cluster[]) { //return copy of memberships
        this._memberships = [];
        points.forEach(point => {
            // For each point, find the nearest Cluster centroid.
            const nearestCluster = this.nearestCluster(point, clusters);
            // Change the point to be a full member of that cluster.
            this._memberships.push(new Membership(point, nearestCluster, 1));
        });
    }

    private nearestCluster(point: Point, clusters: Cluster[]): Cluster {
        let nearestCluster: Cluster;
        let nearestDistance = Number.MAX_VALUE;
        clusters.forEach(cluster => {
            const distance = euclidean(point.coordinates, cluster.centroid.coordinates);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestCluster = cluster;
            }
        });
        return nearestCluster;
    }
}