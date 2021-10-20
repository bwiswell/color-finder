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

const findCentroids = (
      colors: number[][],
      nClusters: number, 
      nBest: number, 
      maxIterations: number = 100
   ): number[][] => {
   const centroids = initCentroids(colors, nClusters);
   const assignments: number[] = new Array(colors.length);
   let done = false, i: number, j: number, assigned: number[][];
   let iterations = 0;
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
      iterations++;
   }

   const decorate: { centroid: number[], clusterSize: number }[] = [];
   centroids.forEach((centroid, index) => {
      decorate.push({ 
         centroid: centroid, 
         clusterSize: assigned[index].length 
      })
   });
   decorate.sort((a, b) => b.clusterSize - a.clusterSize);
   const undecorate: number[][] = [];
   decorate.slice(0, nBest).forEach(value => undecorate.push(value.centroid));
   undecorate.map(centroid => colors[nearestCentroid(centroid, colors)])
   return undecorate;
}

export default findCentroids;