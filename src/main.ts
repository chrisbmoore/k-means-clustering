import { KMeansGenerator } from "./k-means-generator";
import { PlotData, newPlot } from "plotly.js";
import jsonData from '../data/synthetic_test_data.json';

const k = 3;

const testData = jsonData.map(dataPoint => {
    return [dataPoint.x1, dataPoint.x2];
});

console.log("starting K-means");
const kMeans = new KMeansGenerator(testData, k);
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
        range: [-15, 15]
    },
    yaxis: {
        range: [-15, 15]
    },
    title: 'Clusters'
};

newPlot('graph1', plots, layout);
