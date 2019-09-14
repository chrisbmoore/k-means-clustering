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

    constructor(data: number[][], k: number, maxIterations = 10) {
        this._k = k;
        // Convert raw vectors to Points.
        this._points = this.convertDataToPoints(data);
        // Calculate dimensions from Points.
        this._dimensions = this._points.length ? this._points[0].coordinates.length : 0;
        this._clusters = this.initializeClusters(k, this._points);
        //Iterate process until memberships don't change, or a max iterations have been reached.
        let areMembershipsEqual = false;
        for (let i = 0; (!areMembershipsEqual && i < maxIterations); i++) {
            const updatedMemberships = this.updateMemberships(this._points, this._clusters);
            this._clusters = this.updateCentroids(this._clusters, updatedMemberships);
            areMembershipsEqual = this.areMembershipsEqual(this._memberships, updatedMemberships);
            this._memberships = updatedMemberships;
        }
    }

    private areMembershipsEqual(memberships1: Membership[], memberships2: Membership[]) {
        //If different sizes, not equal.
        if (memberships1.length !== memberships2.length) return false;
        //Same if every membership in list 1 exists somewhere in list 2.
        return memberships1.every(m1 => memberships2.some(m2 => m1.equals(m2)));
    }

    private convertDataToPoints(data: number[][]): Point[] {
        return data.map(d => new Point(d));
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

    private updateMemberships(points: Point[], clusters: Cluster[]): Membership[] {
        let newMemberships: Membership[] = [];
        points.forEach(point => {
            // For each point, find the nearest Cluster centroid.
            const nearestCluster = this.nearestCluster(point, clusters);
            // Change the point to be a full member of that cluster.
            newMemberships.push(new Membership(point, nearestCluster, 1));
        });
        return newMemberships;
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

    private updateCentroids(clusters: Cluster[], memberships: Membership[]): Cluster[] {
        clusters.forEach(cluster => {
            const clusterPoints = memberships.filter(membership => membership.cluster === cluster)
                .map(membership => membership.point);
            const newCentroid = this.calculateMean(clusterPoints);
            cluster.centroid = newCentroid;
            return cluster;
        });
        return clusters;
    }

    private calculateMean(points: Point[]): Point {
        const sumPoint = points.reduce((currentSum, point) => {
            return currentSum.add(point);
        });
        const total = points.length;
        const meanCoordinates = sumPoint.coordinates.map(coordinate => coordinate / total);
        return new Point(meanCoordinates);
    }
}