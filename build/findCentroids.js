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
var meanSquaredError = function (centroid, assigned) {
    var sum = 0;
    assigned.forEach(function (color) {
        sum += util_1.rgbDist(centroid, color);
    });
    return assigned.length > 0 ? sum / assigned.length : 0;
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
        var _loop_1 = function () {
            assigned = colors.filter(function (_c, colIdx) { return assignments[colIdx] === i; });
            if (assigned.length !== 0) {
                var centroid = centroids[i];
                var newCentroid = new Array(3), sum_1;
                for (j = 0; j < 3; j++) {
                    sum_1 = 0;
                    assigned.forEach(function (color) { return sum_1 += color[j]; });
                    newCentroid[j] = sum_1 / assigned.length;
                    if (newCentroid[j] != centroid[j]) {
                        done = false;
                    }
                }
                centroids[i] = newCentroid;
            }
        };
        for (i = 0; i < nClusters; i++) {
            _loop_1();
        }
        iterations++;
    }
    var decorate = [];
    centroids.forEach(function (centroid, centI) {
        var assigned = colors.filter(function (color, colI) { return assignments[colI] === centI; });
        decorate.push({
            centroid: centroid,
            mse: meanSquaredError(centroid, assigned)
        });
    });
    decorate.sort(function (a, b) { return a.mse - b.mse; });
    var undecorate = [];
    decorate.slice(0, nBest).forEach(function (value) { return undecorate.push(value.centroid); });
    undecorate.map(function (centroid) { return colors[nearestCentroid(centroid, colors)]; });
    return undecorate;
};
exports["default"] = findCentroids;
