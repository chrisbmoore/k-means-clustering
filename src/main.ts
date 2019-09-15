import { KMeansGenerator } from "./k-means-generator";
import { PlotData, newPlot } from "plotly.js";

const inputData = [[-3, 2], [2, 0], [-6, 4], [-3, -4], [3, 5],
[-8, -2], [4, 5], [6, -4], [3, 4], [-7, -9]];
const k = 2;

console.log("starting K-means");
const kMeans = new KMeansGenerator(inputData, k);
const clustersData = kMeans.clusters;

const plots = clustersData.map((clusterData, i) => {
    const xs: number[] = clusterData.data.map(dataPoint => dataPoint[0]);
    const ys: number[] = clusterData.data.map(dataPoint => dataPoint[1]);
    const labels: string[] = clusterData.data.map((datum, i) => "Point-" + i)
    const plot: Partial<PlotData> = {
        x: xs,
        y: ys,
        mode: 'markers',
        type: 'scatter',
        name: 'Cluster-' + i,
        text: labels,
        marker: { size: 8 }
    };
    return plot;
});

var layout = {
    xaxis: {
        range: [-10, 10]
    },
    yaxis: {
        range: [-10, 10]
    },
    title: 'Clusters'
};

newPlot('graph1', plots, layout);
