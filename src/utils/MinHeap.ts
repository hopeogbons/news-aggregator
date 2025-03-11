export default class MinHeap<T> {
  private heap: T[];
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.heap = [];
    this.comparator = comparator;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private leftChild(index: number): number {
    return 2 * index + 1;
  }

  private rightChild(index: number): number {
    return 2 * index + 2;
  }

  private heapifyUp(): void {
    let index = this.heap.length - 1;
    while (
      index > 0 &&
      this.comparator(this.heap[index], this.heap[this.parent(index)]) < 0
    ) {
      this.swap(index, this.parent(index));
      index = this.parent(index);
    }
  }

  private heapifyDown(): void {
    let index = 0;
    while (this.leftChild(index) < this.heap.length) {
      let smallerChild = this.leftChild(index);
      if (
        this.rightChild(index) < this.heap.length &&
        this.comparator(
          this.heap[this.rightChild(index)],
          this.heap[smallerChild]
        ) < 0
      ) {
        smallerChild = this.rightChild(index);
      }

      if (this.comparator(this.heap[index], this.heap[smallerChild]) <= 0) {
        break;
      }

      this.swap(index, smallerChild);
      index = smallerChild;
    }
  }

  insert(value: T): void {
    this.heap.push(value);
    this.heapifyUp();
  }

  extract(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();
    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();
    return root;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  toArray(): T[] {
    return [...this.heap].sort(this.comparator);
  }
}
