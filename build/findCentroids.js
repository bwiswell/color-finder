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
var findCentroids = function (colors, nCentroids) {
    var centroids = initCentroids(colors, nCentroids);
    var assignments = new Array(colors.length);
    var done = false, i, j, assigned;
    while (!done) {
        for (i = 0; i < colors.length; i++) {
            assignments[i] = nearestCentroid(colors[i], centroids);
        }
        done = true;
        for (i = 0; i < nCentroids; i++) {
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
    }
    return centroids;
};
exports["default"] = findCentroids;
