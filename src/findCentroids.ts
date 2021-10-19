import { rgbDist } from "./util";

const initCentroids = (colors: number[][], nCentroids: number): number[][] => {
   const centroids = colors.slice(0);
   centroids.sort(() => Math.random());
   return centroids.slice(0, nCentroids);
}

const nearestCentroid = (color: number[], centroids: number[][]): number => {
   let minDist = Infinity, minIndex = 0, i, dist;
   for (i = 0; i < centroids.length; i++) {
      dist = rgbDist(color, centroids[i]);
      if (dist < minDist) {
         minDist = dist;
         minIndex = i;
      }
   }
   return minIndex;
}

const findCentroids = (colors: number[][], nCentroids: number): number[][] => {
   const centroids = initCentroids(colors, nCentroids);
   const assignments: number[] = new Array(colors.length);
   let done = false, i: number, j: number, assigned: number[][];
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
            let centroid = centroids[i], newCentroid: number[] = new Array(3), k: number, sum: number;
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
}

export default findCentroids;