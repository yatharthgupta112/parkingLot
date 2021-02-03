module.exports = class minHeap {
  constructor(capacity) {
    this.arr = new Array(parseInt(capacity));
    this.size = 0;
    this.capacity = capacity;
  }
  left(pos) {
    return 2 * pos + 1;
  }
  right(pos) {
    return 2 * pos + 2;
  }
  parent(pos) {
    return parseInt((pos - 1) / 2);
  }
  swap(parent, child) {
    const tmp = this.arr[child];
    this.arr[child] = this.arr[parent];
    this.arr[parent] = tmp;
  }
  insert(no) {
    //console.log("no", no);
    //console.log(this.size, this.arr);
    this.size++;
    this.arr[this.size - 1] = no;
    //console.log(this.size, this.arr);
    let i = this.size - 1;
    while(  i!=0 && this.arr[this.parent(i)] > no ){
      this.swap(this.parent(i), i);
      //console.log(this.arr);
      i = this.parent(i);
    }
    //console.log(this.size, this.arr);
  }
  minHeapify(i) {
    //console.log("min", this.arr);
    const lt = this.left(i),
      rt = this.right(i);
    let smallest = i;
    if (lt < this.size && this.arr[lt] < this.arr[i]) smallest = lt;
    if (rt < this.size && this.arr[rt] < this.arr[smallest]) smallest = rt;
    if (smallest != i) {
      this.swap(i, smallest);
      this.minHeapify(smallest);
    }
    //console.log("min", this.arr);
  }
  extractMin() {
    //console.log(this.arr);
    if (this.size == 0) {
      return -1;
    }
    if (this.size == 1) {
      this.size--;
      return this.arr[0];
    }
    this.swap(0, this.size - 1);
    this.size--;
    this.minHeapify(0);
    //console.log(this.arr);
    return this.arr[this.size];
  }
};
