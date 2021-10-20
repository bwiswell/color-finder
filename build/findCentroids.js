"use strict";
exports.__esModule = true;
var util_1 = require("./util");
var initCentroids = function (colors, nCentroids) {
    var centroids = colors.slice(0);
    centroids.sort(function () { return Math.random(); });
    return centroids.slice(0, nCentroids);
};
var nearestCentroid = function (color, centroids) {
    var minDist = Infinity, minIndex = 0, i, dist;
    for (i = 0; i < centroids.length; i++) {
        dist = util_1.rgbDist(color, centroids[i]);
        if (dist < minDist) {
            minDist = dist;
            minIndex = i;
        }
    }
    return minIndex;
};
var findCentroids = function (colors, nClusters, nBest, maxIterations) {
    if (maxIterations === void 0) { maxIterations = 100; }
    var centroids = initCentroids(colors, nClusters);
    var assignments = new Array(colors.length);
    var done = false, i, j, assigned;
    var iterations = 0;
    while (!done && iterations < maxIterations) {
        for (i = 0; i < colors.length; i++) {
            assignments[i] = nearestCentroid(colors[i], centroids);
        }
        done = true;
        for (i = 0; i < nClusters; i++) {
            assigned = [];
            for (j = 0; j < colors.length; j++) {
                if (assignments[j] == i) {
                    assigned.push(colors[j]);
                }
            }
            if (assigned.length !== 0) {
                var centroid = centroids[i], newCentroid = new Array(3), k = void 0, sum = void 0;
                for (j = 0; j < 3; j++) {
                    sum = 0;
                    for (k = 0; k < assigned.length; k++) {
                        sum += assigned[k][j];
                    }
                    newCentroid[j] = sum / assigned.length;
                    if (newCentroid[j] != centroid[j]) {
                        done = false;
                    }
                }
                centroids[i] = newCentroid;
            }
        }
        iterations++;
    }
    var decorate = [];
    centroids.forEach(function (centroid, index) {
        decorate.push({
            centroid: centroid,
            clusterSize: assigned[index].length
        });
    });
    decorate.sort(function (a, b) { return b.clusterSize - a.clusterSize; });
    var undecorate = [];
    decorate.slice(0, nBest).forEach(function (value) { return undecorate.push(value.centroid); });
    undecorate.map(function (centroid) { return colors[nearestCentroid(centroid, colors)]; });
    return undecorate;
};
exports["default"] = findCentroids;
