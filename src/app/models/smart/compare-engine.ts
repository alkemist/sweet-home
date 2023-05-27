import {JSONObject, JSONPath, JSONValue, ObjectHelper, TypeHelper} from "@tools";

// eslint-disable-next-line no-shadow
export enum PanelEnum {
  LEFT = "left",
  RIGHT = "right"
}

// eslint-disable-next-line no-shadow
export enum CompareStateEnum {
  NONE = "",
  ADDED = "jse-added",
  UPDATED = "jse-updated",
  REMOVED = "jse-removed",
  EQUAL = "jse-equal",
}

export class CompareEngine {
  protected compareStateIndex: Record<PanelEnum, Map<string, CompareStateEnum>>;
  protected arrayIndex: Record<PanelEnum, Map<string, boolean>>;
  protected jsonValues: Record<PanelEnum, JSONValue>;

  constructor(protected determineArrayIndexFn: (paths: JSONPath) => string) {
    this.compareStateIndex = {
      left: new Map<string, CompareStateEnum>(),
      right: new Map<string, CompareStateEnum>()
    };
    this.arrayIndex = {
      left: new Map<string, boolean>(),
      right: new Map<string, boolean>()
    };
    this.jsonValues = {
      left: null,
      right: null
    };
  }

  update(panel: PanelEnum, json: JSONValue): void {
    this.jsonValues[panel] = json;
    this.compareStateIndex[panel].clear();
    this.arrayIndex[panel].clear();
  }

  updateCompareIndex(): void {
    // console.log("- Json left", this.json.left);
    // console.log("- Json right", this.json.right);

    this.updateComparePanelIndex(this.jsonValues[PanelEnum.LEFT], this.jsonValues[PanelEnum.RIGHT], PanelEnum.LEFT);
    this.updateComparePanelIndex(this.jsonValues[PanelEnum.RIGHT], this.jsonValues[PanelEnum.LEFT], PanelEnum.RIGHT);


    console.log("- Array index left", this.arrayIndex.left);
    console.log("- Array index right", this.arrayIndex.right);

    console.log("- Compare state index left", this.compareStateIndex.left);
    console.log("- Compare state index right", this.compareStateIndex.right);
  }

  updateComparePanelIndex(sideValue: JSONValue | undefined, otherSideValue: JSONValue | undefined, panel: PanelEnum, path: JSONPath = [])
    : void {
    const otherPanel = panel === PanelEnum.LEFT ? PanelEnum.RIGHT : PanelEnum.LEFT;

    const isArray = TypeHelper.isArray(sideValue);
    const isObject = !isArray && TypeHelper.isObject(sideValue);
    const isPrimitive = !isArray && !isObject;

    if (isArray || isObject) {
      this.arrayIndex[panel].set(path.join("/"), isArray);
    }

    const arrayDiffLevels = this.findArrayDiffLevels(panel, path);
    console.log(`- [Next] ${path.join("/")}  : `, isArray ? "isArray" : "", isObject ? "isObject" : "",
      isPrimitive ? "isPrimitive" : "", ", with array diff level", arrayDiffLevels);

    let compareState = this.compareValues(sideValue, otherSideValue, panel);

    let currentRoot = this.jsonValues[panel];
    let currentOtherRoot = this.jsonValues[otherPanel];
    let currentPath = TypeHelper.deepClone(path);
    let currentSideValue = TypeHelper.deepClone(sideValue);
    let currentOtherSideValue = TypeHelper.deepClone(otherSideValue);

    arrayDiffLevels.forEach((arrayDiffLevel) => {
      console.log("--- [Next] Array diff level : ", arrayDiffLevel);
      console.log("--- Current side value", currentSideValue);
      console.log("--- Current other side value", currentOtherSideValue);
      console.log("--- Current root", currentRoot);
      console.log("--- Current other root", currentOtherRoot);

      const arrayPath = currentPath.slice(0, currentPath.length - arrayDiffLevel);

      console.log("--- Current path : ", currentPath.join("/"));
      console.log("--- Array path : ", arrayPath.join("/"));

      const otherSideItems =
        ObjectHelper.getIn(currentOtherRoot, arrayPath) as JSONObject[];
      console.log("-- Other side items : ", otherSideItems);

      if (otherSideItems) {
        if (arrayDiffLevel === 0) {
          console.log("----- Compare array");
          compareState = this.compareValues(currentSideValue, currentOtherSideValue, panel);
        } else {
          const searchKey = this.determineArrayIndexFn(currentPath);
          const objectPath = currentPath.slice(0, arrayPath.length + 1);
          console.log("----- Object path : ", objectPath);

          const sideObject = ObjectHelper.getIn(currentRoot, objectPath) as JSONObject;
          console.log("----- Side object : ", sideObject);

          const itemFinded = this.findCompareItem(sideObject, otherSideItems, searchKey);
          const otherSideObject = itemFinded.value;

          if (otherSideObject) {
            const propertyPath = currentPath.slice(objectPath.length);
            console.log("------- Other side object : ", otherSideObject);

            if (arrayDiffLevel === 1) {
              const index = parseInt([...currentPath].pop() as string, 10);
              currentSideValue = ObjectHelper.getIn(sideObject, propertyPath);

              console.log("------- Compare array item", index);

              const compareIndex = this.compareValues(index, itemFinded.index, panel);
              const compareValue = this.compareValues(currentSideValue, itemFinded.value, panel);

              console.log("------- Compare index : ", index, itemFinded.index, compareIndex);
              console.log("------- Compare value : ", currentSideValue, itemFinded.value, compareValue);

              compareState = compareIndex === CompareStateEnum.UPDATED || compareValue === CompareStateEnum.UPDATED
                ? CompareStateEnum.UPDATED : CompareStateEnum.EQUAL;
            } else {
              console.log("------- Compare array item property", propertyPath);
              currentSideValue = ObjectHelper.getIn(sideObject, propertyPath);
              currentOtherSideValue = ObjectHelper.getIn(otherSideObject, propertyPath);

              console.log("-- compare item value :", currentSideValue);
              console.log("--- with :", currentOtherSideValue);

              compareState = this.compareValues(currentSideValue, currentOtherSideValue, panel);
            }

            currentPath = TypeHelper.deepClone(propertyPath);
            currentRoot = TypeHelper.deepClone(sideObject);
            currentSideValue = TypeHelper.deepClone(sideObject);
            currentOtherRoot = TypeHelper.deepClone(otherSideObject);
            currentOtherSideValue = TypeHelper.deepClone(otherSideObject);
          } else {
            console.log("----- Object not finded ", objectPath);

            compareState = panel === PanelEnum.LEFT ? CompareStateEnum.REMOVED : CompareStateEnum.ADDED;
          }
        }
      } else {
        compareState = panel === PanelEnum.LEFT ? CompareStateEnum.REMOVED : CompareStateEnum.ADDED;
      }
    });

    console.log("- Update compare state with : ", compareState);

    this.compareStateIndex[panel].set(path.join("/"), compareState);

    if (compareState === CompareStateEnum.UPDATED && (isArray || isObject)) {
      const items = isArray
        ? sideValue.map((_, index) => index)
        : Object.keys(sideValue);


      items.forEach((index) => {
        const sideSubValue = sideValue ?
          TypeHelper.isNumber(index) ? (sideValue as JSONObject)[index]
            : (sideValue as Record<string, JSONValue>)[index]
          : undefined;
        const otherSideSubValue = otherSideValue ?
          TypeHelper.isNumber(index) ? (otherSideValue as JSONObject)[index]
            : (otherSideValue as Record<string, JSONValue>)[index]
          : undefined;

        console.log("- Is array or object, next level");
        this.updateComparePanelIndex(sideSubValue, otherSideSubValue, panel, [...path, index.toString()]);
      });
    }
  }

  getState(panel: PanelEnum, paths: JSONPath): CompareStateEnum {
    return this.compareStateIndex[panel].get(paths.join("/")) ?? CompareStateEnum.NONE;
  }

  hasChange(): boolean {
    return this.compareStateIndex.right.get("") !== CompareStateEnum.EQUAL;
  }

  // On récupère la différence de niveau entre chaque tableau
  protected findArrayDiffLevels(panel: PanelEnum, paths: string[], level = 1, diffs: number[] = []): number[] {
    // console.log("-- findArrayDiffLevels : ", paths.join("/"), diffs);

    const currentPath = paths.slice(0, level);
    const isArray = this.arrayIndex[panel].get(currentPath.join("/")) ?? false;


    if (diffs.length > 0) {
      diffs = diffs.map(value => value + 1);
    }

    if (isArray) {
      diffs.push(0);
    }

    if (level < paths.length) {
      return this.findArrayDiffLevels(panel, paths, level + 1, diffs);
    }

    return diffs;
  }

  protected findCompareItem(
    sideValue: Record<string, JSONValue> | undefined, otherSideItems: Record<string, JSONValue>[], searchKey: string | boolean)
    : { index: number, value: Record<string, JSONValue> | undefined } {
    if (!sideValue) return {index: -1, value: undefined};

    if (searchKey && TypeHelper.isString(searchKey) && sideValue[searchKey] !== undefined) {
      const findedItem = otherSideItems
        .find((item) => item[searchKey] === sideValue[searchKey]);
      return {
        value: findedItem,
        index: findedItem ? otherSideItems
            .findIndex((item) => item[searchKey] === sideValue[searchKey])
          : -1
      };
    } else {
      const flattenItems = otherSideItems.map(item => JSON.stringify(item));
      const itemIndex = flattenItems.indexOf(JSON.stringify(sideValue));
      return {
        index: itemIndex,
        value: itemIndex > -1 ? otherSideItems[itemIndex] : undefined
      };
    }
  }

  protected compareValues(sideValue: JSONValue | undefined, otherSideValue: JSONValue | undefined, panel: PanelEnum): CompareStateEnum {
    if (panel === PanelEnum.LEFT && otherSideValue === undefined) {
      return CompareStateEnum.REMOVED;
    }
    if (panel === PanelEnum.RIGHT && otherSideValue === undefined) {
      return CompareStateEnum.ADDED;
    }

    // eslint-disable-next-line eqeqeq
    return TypeHelper.isEqual(sideValue, otherSideValue)
      ? CompareStateEnum.EQUAL
      : CompareStateEnum.UPDATED;
  }
}
