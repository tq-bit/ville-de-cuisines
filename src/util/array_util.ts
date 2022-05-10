export function removeDuplicates(items: string[] | undefined) {
  if (items) {
    return items.filter((item, index) => {
      return items.indexOf(item) === index;
    });
  }
}
