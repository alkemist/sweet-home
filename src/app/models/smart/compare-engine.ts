import {JSONObject, JSONValue, ObjectHelper, TypeHelper} from "@tools";
import {CompareState} from "./compare-state";

enum PanelEnum {
  LEFT = "left",
  RIGHT = "right"
}

interface FindedItem {
  index: number,
  value: Record<string, JSONValue> | undefined
}

export class JsonPath extends Array<string> {
  override toString(): string {
    return this.join('/');
  }
}

export class CompareEngine {
  protected compareStateIndex: Record<PanelEnum, Map<string, CompareState>>;
  protected arrayIndex: Record<PanelEnum, Map<string, boolean>>;
  protected jsonValues: Record<PanelEnum, JSONValue>;

  constructor(protected determineArrayIndexFn?: (paths: string[]) => string) {
    this.compareStateIndex = {
      left: new Map<string, CompareState>(),
      right: new Map<string, CompareState>()
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

  updateLeft(json: JSONValue) {
    this.update(PanelEnum.LEFT, json);
  }

  updateRight(json: JSONValue) {
    this.update(PanelEnum.RIGHT, json);
  }

  updateCompareIndex(): void {
    // console.log("- Json left", this.json.left);
    // console.log("- Json right", this.json.right);

    this.updateComparePanelIndex(PanelEnum.LEFT, this.jsonValues[PanelEnum.LEFT], this.jsonValues[PanelEnum.RIGHT]);
    this.updateComparePanelIndex(PanelEnum.RIGHT, this.jsonValues[PanelEnum.RIGHT], this.jsonValues[PanelEnum.LEFT]);


    // console.log("- Array index left", this.arrayIndex.left);
    // console.log("- Array index right", this.arrayIndex.right);

    //console.log("- Compare state index left", this.compareStateIndex.left);
    //console.log("- Compare state index right", this.compareStateIndex.right);
  }

  hasChange(): boolean {
    return this.compareStateIndex.right.get("")?.isChanged ?? false;
  }

  getLeftState(paths: string[]): CompareState {
    return this.getState(PanelEnum.LEFT, new JsonPath(...paths));
  }

  getRightState(paths: string[]): CompareState {
    return this.getState(PanelEnum.RIGHT, new JsonPath(...paths));
  }

  protected getState(panel: PanelEnum, paths: JsonPath): CompareState {
    return this.compareStateIndex[panel].get(paths.toString()) ?? CompareState.NONE;
  }

  protected update(panel: PanelEnum, json: JSONValue): void {
    this.jsonValues[panel] = json;
    this.compareStateIndex[panel].clear();
    this.arrayIndex[panel].clear();
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
    sideValue: Record<string, JSONValue>,
    otherSideItems: Record<string, JSONValue>[],
    searchKey: string
  ): FindedItem {
    if (!sideValue) return {index: -1, value: undefined};

    if (searchKey && sideValue[searchKey] !== undefined) {
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

  protected compareValues(panel: PanelEnum, sideValue?: JSONValue, otherSideValue?: JSONValue): CompareState {
    if (panel === PanelEnum.LEFT && otherSideValue === undefined) {
      return CompareState.REMOVED;
    }
    if (panel === PanelEnum.RIGHT && otherSideValue === undefined) {
      return CompareState.ADDED;
    }

    return TypeHelper.isEqual(sideValue, otherSideValue)
      ? CompareState.EQUAL
      : CompareState.UPDATED;
  }

  protected updateComparePanelIndex(panel: PanelEnum, sideValue: JSONValue | undefined, otherSideValue: JSONValue | undefined, path: JsonPath = new JsonPath())
    : void {
    const otherPanel = panel === PanelEnum.LEFT ? PanelEnum.RIGHT : PanelEnum.LEFT;

    const isArray = TypeHelper.isArray(sideValue);
    const isObject = !isArray && TypeHelper.isObject(sideValue);
    const isPrimitive = !isArray && !isObject;

    if (!isPrimitive) {
      this.arrayIndex[panel].set(path.join("/"), isArray);
    }

    const arrayDiffLevels = this.findArrayDiffLevels(panel, path);
    // console.log(`- [Next] ${path.join("/")}  : `, isArray ? "isArray" : "", isObject ? "isObject" : "",
    //  isPrimitive ? "isPrimitive" : "", ", with array diff level", arrayDiffLevels);

    let compareState = this.compareValues(panel, sideValue, otherSideValue);

    let currentRoot = this.jsonValues[panel];
    let currentOtherRoot = this.jsonValues[otherPanel];
    let currentPath = TypeHelper.deepClone(path);
    let currentSideValue = TypeHelper.deepClone(sideValue);
    let currentOtherSideValue = TypeHelper.deepClone(otherSideValue);

    arrayDiffLevels.forEach((arrayDiffLevel) => {
      // console.log("--- [Next] Array diff level : ", arrayDiffLevel);
      // console.log("--- Current side value", currentSideValue);
      // console.log("--- Current other side value", currentOtherSideValue);
      // console.log("--- Current root", currentRoot);
      // console.log("--- Current other root", currentOtherRoot);

      const arrayPath = currentPath.slice(0, currentPath.length - arrayDiffLevel);

      // console.log("--- Current path : ", currentPath.join("/"));
      // console.log("--- Array path : ", arrayPath.join("/"));

      const otherSideItems =
        ObjectHelper.getIn(currentOtherRoot, arrayPath) as JSONObject[];
      // console.log("-- Other side items : ", otherSideItems);

      if (otherSideItems) {
        if (arrayDiffLevel === 0) {
          // console.log("----- Compare array");
          compareState = this.compareValues(panel, currentSideValue, currentOtherSideValue);
        } else {
          const searchKey = this.determineArrayIndexFn ? this.determineArrayIndexFn(currentPath) : "";
          const objectPath = currentPath.slice(0, arrayPath.length + 1);
          // console.log("----- Object path : ", objectPath);

          const sideObject = ObjectHelper.getIn(currentRoot, objectPath) as JSONObject;
          // console.log("----- Side object : ", sideObject);

          const itemFinded = this.findCompareItem(sideObject, otherSideItems, searchKey);
          const otherSideObject = itemFinded.value;

          if (otherSideObject) {
            const propertyPath = currentPath.slice(objectPath.length);
            // console.log("------- Other side object : ", otherSideObject);

            if (arrayDiffLevel === 1) {
              const index = parseInt([...currentPath].pop() as string, 10);
              currentSideValue = ObjectHelper.getIn(sideObject, propertyPath);

              // console.log("------- Compare array item", index);

              const compareIndex = this.compareValues(panel, index, itemFinded.index);
              const compareValue = this.compareValues(panel, currentSideValue, itemFinded.value);

              // console.log("------- Compare index : ", index, itemFinded.index, compareIndex);
              // console.log("------- Compare value : ", currentSideValue, itemFinded.value, compareValue);

              compareState = compareIndex.isUpdated || compareValue.isUpdated
                ? CompareState.UPDATED : CompareState.EQUAL;
            } else {
              // console.log("------- Compare array item property", propertyPath);
              currentSideValue = ObjectHelper.getIn(sideObject, propertyPath);
              currentOtherSideValue = ObjectHelper.getIn(otherSideObject, propertyPath);

              // console.log("-- compare item value :", currentSideValue);
              // console.log("--- with :", currentOtherSideValue);

              compareState = this.compareValues(panel, currentSideValue, currentOtherSideValue);
            }

            currentPath = TypeHelper.deepClone(propertyPath);
            currentRoot = TypeHelper.deepClone(sideObject);
            currentSideValue = TypeHelper.deepClone(sideObject);
            currentOtherRoot = TypeHelper.deepClone(otherSideObject);
            currentOtherSideValue = TypeHelper.deepClone(otherSideObject);
          } else {
            // console.log("----- Object not finded ", objectPath);

            compareState = this.compareValues(panel);
          }
        }
      } else {
        compareState = this.compareValues(panel);
      }
    });

    // console.log("- Update compare state with : ", compareState);

    this.compareStateIndex[panel].set(path.join("/"), compareState);

    if (compareState.isUpdated && !isPrimitive) {
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

        // console.log("- Is array or object, next level");
        this.updateComparePanelIndex(panel, sideSubValue, otherSideSubValue, [...path, index.toString()]);
      });
    }
  }
}
