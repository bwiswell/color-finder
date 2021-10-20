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

const meanSquaredError = (centroid: number[], assigned: number[][]): number => {
   let sum = 0;
   assigned.forEach(color => {
      sum += rgbDist(centroid, color);
   });
   return assigned.length > 0 ? sum / assigned.length : 0;
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
         assigned = colors.filter((_c, colIdx) => assignments[colIdx] === i);
         if (assigned.length !== 0) {
            let centroid = centroids[i];
            let newCentroid: number[] = new Array(3), sum: number;
            for (j = 0; j < 3; j++) {
               sum = 0;
               assigned.forEach(color => sum += color[j]);
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

   const decorate: { centroid: number[], mse: number }[] = [];
   centroids.forEach((centroid, centI) => {
      const assigned = colors.filter((color, colI) => assignments[colI] === centI);
      decorate.push({ 
         centroid: centroid, 
         mse: meanSquaredError(centroid, assigned)
      })
   });
   decorate.sort((a, b) => a.mse - b.mse);
   const undecorate: number[][] = [];
   decorate.slice(0, nBest).forEach(value => undecorate.push(value.centroid));
   undecorate.map(centroid => colors[nearestCentroid(centroid, colors)])
   return undecorate;
}

export default findCentroids;