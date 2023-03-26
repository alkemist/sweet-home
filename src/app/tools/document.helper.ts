export abstract class DocumentHelper {
  static getTraverseChildren(elem: Element): Element[] {
    const children = [];
    const elementsToCheck: Element[] = [ elem ];

    while (elementsToCheck.length > 0) {
      const currentElement = elementsToCheck.pop() as HTMLElement;
      children.push(currentElement);

      for (let i = 0; i < currentElement.children.length; i++) {
        elementsToCheck.push(currentElement.children[i]);
      }
    }

    // console.log("traverseChildren", children);
    return children;
  }
}
