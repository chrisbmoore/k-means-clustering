import { KMeansGenerator } from "./k-means-generator";

const data = [[-3, 2], [2, 0], [-6, 4], [-3, -4], [3, 5]];
const k = 2;
const kMeans = new KMeansGenerator(data, k);
