export function randomizeItems<T>(arr: T[], num: number): T[] {
  if (num > arr.length) {
    throw new Error("Requested more items than available in the array.");
  }

  let shuffled = arr.slice(); // Copy array to avoid mutation
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
  }
  return shuffled.slice(0, num);
}
