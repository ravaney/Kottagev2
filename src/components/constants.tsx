export const weightedAverage = (weights: number[]) => {
  //weights are the actual ratings left by guests
  //nums are the possible values 1-5
  const nums = [1, 2, 3, 4, 5];
  const [sum, weightSum] = weights.reduce(
    (acc, w, i) => {
      acc[0] = acc[0] + nums[i] * w;
      acc[1] = acc[1] + w;
      return acc;
    },
    [0, 0]
  );
  return sum / weightSum;
};

//create an array of colors to pick from
export enum Colors {
  blue = '#007bff',
  raspberry = '#d155b6',
  powderBlue = '#b1d6e3',
  offWhite = '#e6e6e6',
  white = '#ffffff',
  background = '#F9F1F0',
  cerulean = '#007BA7',
}
