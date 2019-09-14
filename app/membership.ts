import { Point } from "./point";
import { Cluster } from "./cluster";

export class Membership {
    constructor(point: Point, cluster: Cluster, ratio: number) {
        this.point = point;
        this.cluster = cluster;
        this.ratio = ratio;
    }
    point: Point;
    cluster: Cluster;
    ratio: number;

    equals(membership: Membership): boolean {
        return this.point === membership.point
            && this.cluster === membership.cluster
            && this.ratio === membership.ratio;
    }
}