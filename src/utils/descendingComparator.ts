function descendingComparator<T>(a: T, b: T, orderBy: keyof T): -1 | 0 | 1 {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export default descendingComparator;
