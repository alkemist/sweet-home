import {describe, expect, it} from "@jest/globals";
import {CompareEngine} from "./compare-engine";
import {JSONValue} from "@tools";
import {CompareStateEnum} from "./compare-state";

describe("CompareEngine", () => {
  const jsonLeft: JSONValue = {
    longTree: {
      1: {
        2: [
          {
            id: "3",
            4: {
              5: {
                6: [
                  {
                    id: "7",
                    8: [
                      901
                    ]
                  }
                ]
              }
            }
          }
        ]
      }
    },
    findTheBall: [
      {
        id: "1",
        objects: [
          {
            id: "1-1",
            objects: [
              {
                id: "1-1-1"
              }
            ]
          },
          {
            id: "1-2",
            objects: [
              {
                id: "1-2-1"
              },
              {
                id: "1-2-2"
              }
            ]
          },
          {
            id: "1-3",
            objects: []
          }
        ]
      },
      {
        id: "2",
        objects: [
          {
            id: "2-1",
            objects: [
              {
                id: "2-1-1"
              }
            ]
          },
          {
            id: "2-2",
            objects: [
              {
                id: "2-2-1"
              },
              {
                id: "2-2-2"
              },
              {
                id: "2-2-3"
              }
            ]
          }
        ]
      },
      {
        id: "3",
        objects: []
      }
    ],
    objectArray: [
      {
        id: 1,
        label: "identique"
      },
      {
        id: 2,
        label: "index moved",
        array: [{value: 1}]
      },
      {
        id: 4,
        label: "removed"
      },
      {
        id: 5,
        label: "updated -"
      },
      {
        id: 6,
        label: "updated"
      },
      {
        id: 7,
        label: "index moved and updated",
        array: [{value: 2}, {value: 3}]
      },
      {
        id: 8,
        label: "index moved and updated",
        oldValue: false
      }
    ],
    objectWithArray: {
      identiqueArray: [{value: 1, valueArray: [1, 2]}],
      indexMoved: [{value: 1, valueArray: [1, 2]}, {value: 2, valueArray: [3, 4]}],
      elementsAddedOrRemoved: [{value: 1, valueArray: [1, 2]}, {value: 2, valueArray: [3, 4]}]
    }
  };

  const jsonRight: JSONValue = {
    longTree: {
      1: {
        2: [
          {
            id: "3",
            4: {
              5: {
                6: [
                  {
                    id: "7",
                    8: [
                      902
                    ]
                  }
                ]
              }
            }
          }
        ]
      }
    },
    findTheBall: [{
      id: "3",
      objects: []
    },
      {
        id: "4",
        objects: [
          {
            id: "4-1"
          }
        ]
      },
      {
        id: "1",
        objects: [
          {
            id: "1-3",
            objects: [
              {
                id: "1-3-1"
              }
            ]
          },
          {
            id: "1-2",
            objects: [
              {
                id: "1-2-1"
              },
              {
                id: "1-2-2"
              }
            ]
          },
          {
            id: "1-1",
            objects: [
              {
                id: "1-1-1"
              }
            ]
          }
        ]
      },
      {
        id: "2",
        objects: [
          {
            id: "2-2",
            objects: [
              {
                id: "2-2-3"
              },
              {
                id: "2-2-1"
              }
            ]
          }
        ]
      }
    ],
    objectArray: [
      {
        id: 1,
        label: "identique"
      },
      {
        id: 3,
        label: "added"
      },
      {
        id: 2,
        label: "index moved",
        array: [{value: 1}]
      },
      {
        id: 5,
        label: "updated"
      },
      {
        id: 6,
        label: "updated -"
      },
      {
        id: 8,
        label: "index moved and updated",
        array: [3, 4]
      },
      {
        id: 7,
        label: "index moved and updated",
        array: [{value: 3}, {value: 4}]
      }
    ],
    objectWithArray: {
      identiqueArray: [{value: 1, valueArray: [1, 2]}],
      indexMoved: [{value: 2, valueArray: [3, 4]}, {value: 1, valueArray: [1, 2]}],
      elementsAddedOrRemoved: [{value: 3, valueArray: [1, 2]}, {value: 2, valueArray: [3, 4]}]
    }
  };

  describe("Not same structure", () => {
    const compareEngine = new CompareEngine();

    it('should work if right structure is not the same', function () {
      compareEngine.updateLeft(jsonLeft);
      compareEngine.updateRight({});
      compareEngine.updateCompareIndex();

      expect(compareEngine.hasChange()).toBeTruthy();
    });

    it('should work if left structure is not the same', function () {
      compareEngine.updateLeft({});
      compareEngine.updateRight(jsonRight);
      compareEngine.updateCompareIndex();

      expect(compareEngine.hasChange()).toBeTruthy();
    });
  });

  describe("All configurations", () => {
    const compareEngine = new CompareEngine((_: string[]) => {
      return "id";
    });

    compareEngine.updateLeft(jsonLeft);
    compareEngine.updateRight(jsonRight);

    compareEngine.updateCompareIndex();


    it.each([
      {name: "root", path: "", expected: CompareStateEnum.UPDATED},

      {name: "longTree", path: "longTree", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1", path: "longTree/1", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2", path: "longTree/1/2", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0", path: "longTree/1/2/0", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/id", path: "longTree/1/2/0/id", expected: CompareStateEnum.EQUAL},
      {name: "longTree/1/2/0/4", path: "longTree/1/2/0/4", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/4/5", path: "longTree/1/2/0/4/5", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/4/5/6", path: "longTree/1/2/0/4/5/6", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/4/5/6/0", path: "longTree/1/2/0/4/5/6/0", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/4/5/6/0/id", path: "longTree/1/2/0/4/5/6/0/id", expected: CompareStateEnum.EQUAL},
      {name: "longTree/1/2/0/4/5/6/0/8", path: "longTree/1/2/0/4/5/6/0/8", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/4/5/6/0/8/0", path: "longTree/1/2/0/4/5/6/0/8/0", expected: CompareStateEnum.REMOVED},

      {name: "findTheBall", path: "findTheBall", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/0", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/0/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/0/objects", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/0/objects/0", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/0/objects/0/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/0/objects/0/objects", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/0/objects/0/objects/0", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/0/objects/0/objects/0/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/0/objects/1", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/0/objects/1/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/0/objects/1/objects", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/0/objects/1/objects/0", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/0/objects/1/objects/0/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/0/objects/1/objects/1", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/0/objects/1/objects/1/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/0/objects/2", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/0/objects/2/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/0/objects/2/objects", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/1", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/1/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/1/objects", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/1/objects/0", expected: CompareStateEnum.REMOVED},
      {name: "findTheBall", path: "findTheBall/1/objects/0/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/1/objects/0/objects", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/1/objects/0/objects/0", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/1/objects/0/objects/0/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/1/objects/1", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/1/objects/1/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/1/objects/1/objects", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/1/objects/1/objects/0", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/1/objects/1/objects/0/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/1/objects/1/objects/1", expected: CompareStateEnum.REMOVED},
      {name: "findTheBall", path: "findTheBall/1/objects/1/objects/1/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/1/objects/1/objects/2", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/1/objects/1/objects/2/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/2", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/2/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/2/objects", expected: CompareStateEnum.EQUAL},

      {name: "array of object", path: "objectArray", expected: CompareStateEnum.UPDATED},
      {name: "identique object", path: "objectArray/0", expected: CompareStateEnum.EQUAL},
      {name: "identique object id", path: "objectArray/0/id", expected: CompareStateEnum.NONE},
      {name: "identique object label", path: "objectArray/0/label", expected: CompareStateEnum.NONE},
      {name: "index moved object", path: "objectArray/1", expected: CompareStateEnum.UPDATED},
      {name: "index moved object id", path: "objectArray/1/id", expected: CompareStateEnum.EQUAL},
      {name: "index moved object label", path: "objectArray/1/label", expected: CompareStateEnum.EQUAL},
      {name: "index moved object label", path: "objectArray/1/array", expected: CompareStateEnum.EQUAL},
      {name: "index moved object label", path: "objectArray/1/array/0", expected: CompareStateEnum.NONE},
      {name: "index moved object label", path: "objectArray/1/array/0/value", expected: CompareStateEnum.NONE},
      {name: "removed object", path: "objectArray/2", expected: CompareStateEnum.REMOVED},
      {name: "removed object id", path: "objectArray/2/id", expected: CompareStateEnum.NONE},
      {name: "removed object label", path: "objectArray/2/label", expected: CompareStateEnum.NONE},
      {name: "update left object", path: "objectArray/3", expected: CompareStateEnum.UPDATED},
      {name: "update left object id", path: "objectArray/3/id", expected: CompareStateEnum.EQUAL},
      {name: "update left object label", path: "objectArray/3/label", expected: CompareStateEnum.UPDATED},
      {name: "update right object", path: "objectArray/4", expected: CompareStateEnum.UPDATED},
      {name: "update right object id", path: "objectArray/4/id", expected: CompareStateEnum.EQUAL},
      {name: "update right object label", path: "objectArray/4/label", expected: CompareStateEnum.UPDATED},
      {name: "index moved and update object", path: "objectArray/5", expected: CompareStateEnum.UPDATED},
      {name: "index moved and update object", path: "objectArray/5/id", expected: CompareStateEnum.EQUAL},
      {name: "index moved and update object", path: "objectArray/5/label", expected: CompareStateEnum.EQUAL},
      {name: "index moved and update object", path: "objectArray/5/array", expected: CompareStateEnum.UPDATED},
      {name: "index moved and update object", path: "objectArray/5/array/0", expected: CompareStateEnum.REMOVED},
      {name: "index moved and update object", path: "objectArray/5/array/0/value", expected: CompareStateEnum.NONE},
      {name: "index moved and update object", path: "objectArray/5/array/1", expected: CompareStateEnum.UPDATED},
      {name: "index moved and update object", path: "objectArray/5/array/1/value", expected: CompareStateEnum.EQUAL},
      {name: "index moved and update object", path: "objectArray/6", expected: CompareStateEnum.UPDATED},
      {name: "index moved and update object", path: "objectArray/6/id", expected: CompareStateEnum.EQUAL},
      {name: "index moved and update object", path: "objectArray/6/label", expected: CompareStateEnum.EQUAL},
      {name: "index moved and update object", path: "objectArray/6/oldValue", expected: CompareStateEnum.REMOVED},

      {name: "object with identique array", path: "objectWithArray", expected: CompareStateEnum.UPDATED},
      {name: "object with identique array", path: "objectWithArray/identiqueArray", expected: CompareStateEnum.EQUAL},
      {name: "object with identique array", path: "objectWithArray/identiqueArray/0", expected: CompareStateEnum.NONE},
      {
        name: "object with identique array",
        path: "objectWithArray/identiqueArray/0/value",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with identique array",
        path: "objectWithArray/identiqueArray/0/valueArray",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with identique array",
        path: "objectWithArray/identiqueArray/0/valueArray/0",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with identique array",
        path: "objectWithArray/identiqueArray/0/valueArray/1",
        expected: CompareStateEnum.NONE
      },
      {name: "object with moved items", path: "objectWithArray/indexMoved", expected: CompareStateEnum.UPDATED},
      {name: "object with moved items", path: "objectWithArray/indexMoved/0", expected: CompareStateEnum.UPDATED},
      {name: "object with moved items", path: "objectWithArray/indexMoved/0/value", expected: CompareStateEnum.EQUAL},
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/0/valueArray",
        expected: CompareStateEnum.EQUAL
      },
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/0/valueArray/0",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/0/valueArray/1",
        expected: CompareStateEnum.NONE
      },
      {name: "object with moved items", path: "objectWithArray/indexMoved/1", expected: CompareStateEnum.UPDATED},
      {name: "object with moved items", path: "objectWithArray/indexMoved/1/value", expected: CompareStateEnum.EQUAL},
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/1/valueArray",
        expected: CompareStateEnum.EQUAL
      },
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/1/valueArray/0",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/1/valueArray/1",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved",
        expected: CompareStateEnum.UPDATED
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/0",
        expected: CompareStateEnum.REMOVED
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/0/value",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/0/valueArray",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/0/valueArray/0",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/0/valueArray/1",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/1",
        expected: CompareStateEnum.EQUAL
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/1/value",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/1/valueArray",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/1/valueArray/0",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/1/valueArray/1",
        expected: CompareStateEnum.NONE
      }
    ] as CompareTest[])(
      "Get left compare state '$name' should return '$expected' for path '$path'",
      (compareTest) => {
        expect(
          compareEngine.getLeftState(
            compareTest.path.split("/")
          ).toString()
        ).toEqual(compareTest.expected);
      }
    );

    it.each([
      {name: "root", path: "", expected: CompareStateEnum.UPDATED},

      {name: "longTree/1", path: "longTree/1", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2", path: "longTree/1/2", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0", path: "longTree/1/2/0", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/id", path: "longTree/1/2/0/id", expected: CompareStateEnum.EQUAL},
      {name: "longTree/1/2/0/4", path: "longTree/1/2/0/4", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/4/5", path: "longTree/1/2/0/4/5", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/4/5/6", path: "longTree/1/2/0/4/5/6", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/4/5/6/0", path: "longTree/1/2/0/4/5/6/0", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/4/5/6/0/id", path: "longTree/1/2/0/4/5/6/0/id", expected: CompareStateEnum.EQUAL},
      {name: "longTree/1/2/0/4/5/6/0/8", path: "longTree/1/2/0/4/5/6/0/8", expected: CompareStateEnum.UPDATED},
      {name: "longTree/1/2/0/4/5/6/0/8/0", path: "longTree/1/2/0/4/5/6/0/8/0", expected: CompareStateEnum.ADDED},

      {name: "findTheBall", path: "findTheBall", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/0", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/0/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/0/objects", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/1", expected: CompareStateEnum.ADDED},
      {name: "findTheBall", path: "findTheBall/1/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/1/objects", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/1/objects/0", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/1/objects/0/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/2", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/2/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/2/objects", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/2/objects/0", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/2/objects/0/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/2/objects/0/objects", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/2/objects/0/objects/0", expected: CompareStateEnum.ADDED},
      {name: "findTheBall", path: "findTheBall/2/objects/0/objects/0/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/2/objects/1", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/2/objects/1/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/2/objects/1/objects", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/2/objects/1/objects/0", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/2/objects/1/objects/0/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/2/objects/1/objects/1", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/2/objects/1/objects/1/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/2/objects/2", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/2/objects/2/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/2/objects/2/objects", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/2/objects/2/objects/0", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/2/objects/2/objects/0/id", expected: CompareStateEnum.NONE},
      {name: "findTheBall", path: "findTheBall/3", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/3/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/3/objects", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/3/objects/0", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/3/objects/0/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/3/objects/0/objects", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/3/objects/0/objects/0", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/3/objects/0/objects/0/id", expected: CompareStateEnum.EQUAL},
      {name: "findTheBall", path: "findTheBall/3/objects/0/objects/1", expected: CompareStateEnum.UPDATED},
      {name: "findTheBall", path: "findTheBall/3/objects/0/objects/1/id", expected: CompareStateEnum.EQUAL},

      {name: "array of object", path: "objectArray", expected: CompareStateEnum.UPDATED},
      {name: "identique object", path: "objectArray/0", expected: CompareStateEnum.EQUAL},
      {name: "identique object id", path: "objectArray/0/id", expected: CompareStateEnum.NONE},
      {name: "identique object label", path: "objectArray/0/label", expected: CompareStateEnum.NONE},
      {name: "added object", path: "objectArray/1", expected: CompareStateEnum.ADDED},
      {name: "added object id", path: "objectArray/1/id", expected: CompareStateEnum.NONE},
      {name: "added object label", path: "objectArray/1/label", expected: CompareStateEnum.NONE},
      {name: "index moved object", path: "objectArray/2", expected: CompareStateEnum.UPDATED},
      {name: "index moved object id", path: "objectArray/2/id", expected: CompareStateEnum.EQUAL},
      {name: "index moved object label", path: "objectArray/2/label", expected: CompareStateEnum.EQUAL},
      {name: "index moved object label", path: "objectArray/2/array", expected: CompareStateEnum.EQUAL},
      {name: "index moved object label", path: "objectArray/2/array/0", expected: CompareStateEnum.NONE},
      {name: "index moved object label", path: "objectArray/2/array/0/value", expected: CompareStateEnum.NONE},
      {name: "update left object", path: "objectArray/3", expected: CompareStateEnum.UPDATED},
      {name: "update left object id", path: "objectArray/3/id", expected: CompareStateEnum.EQUAL},
      {name: "update left object label", path: "objectArray/3/label", expected: CompareStateEnum.UPDATED},
      {name: "update right object", path: "objectArray/4", expected: CompareStateEnum.UPDATED},
      {name: "update right object id", path: "objectArray/4/id", expected: CompareStateEnum.EQUAL},
      {name: "update right object label", path: "objectArray/4/label", expected: CompareStateEnum.UPDATED},
      {name: "index moved and update object", path: "objectArray/5", expected: CompareStateEnum.UPDATED},
      {name: "index moved and update object", path: "objectArray/5/id", expected: CompareStateEnum.EQUAL},
      {name: "index moved and update object", path: "objectArray/5/label", expected: CompareStateEnum.EQUAL},
      {name: "index moved and update object", path: "objectArray/5/array", expected: CompareStateEnum.ADDED},
      {name: "index moved and update object", path: "objectArray/5/array/0", expected: CompareStateEnum.NONE},
      {name: "index moved and update object", path: "objectArray/5/array/1", expected: CompareStateEnum.NONE},
      {name: "index moved and update object", path: "objectArray/6", expected: CompareStateEnum.UPDATED},
      {name: "index moved and update object", path: "objectArray/6/id", expected: CompareStateEnum.EQUAL},
      {name: "index moved and update object", path: "objectArray/6/label", expected: CompareStateEnum.EQUAL},
      {name: "index moved and update object", path: "objectArray/6/array", expected: CompareStateEnum.UPDATED},
      {name: "index moved and update object", path: "objectArray/6/array/0", expected: CompareStateEnum.UPDATED},
      {name: "index moved and update object", path: "objectArray/6/array/0/value", expected: CompareStateEnum.EQUAL},
      {name: "index moved and update object", path: "objectArray/6/array/1", expected: CompareStateEnum.ADDED},
      {name: "index moved and update object", path: "objectArray/6/array/1/value", expected: CompareStateEnum.NONE},

      {name: "object with identique array", path: "objectWithArray", expected: CompareStateEnum.UPDATED},
      {name: "object with identique array", path: "objectWithArray/identiqueArray", expected: CompareStateEnum.EQUAL},
      {name: "object with identique array", path: "objectWithArray/identiqueArray/0", expected: CompareStateEnum.NONE},
      {
        name: "object with identique array",
        path: "objectWithArray/identiqueArray/0/value",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with identique array",
        path: "objectWithArray/identiqueArray/0/valueArray",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with identique array",
        path: "objectWithArray/identiqueArray/0/valueArray/0",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with identique array",
        path: "objectWithArray/identiqueArray/0/valueArray/1",
        expected: CompareStateEnum.NONE
      },
      {name: "object with moved items", path: "objectWithArray/indexMoved", expected: CompareStateEnum.UPDATED},
      {name: "object with moved items", path: "objectWithArray/indexMoved/0", expected: CompareStateEnum.UPDATED},
      {name: "object with moved items", path: "objectWithArray/indexMoved/0/value", expected: CompareStateEnum.EQUAL},
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/0/valueArray",
        expected: CompareStateEnum.EQUAL
      },
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/0/valueArray/0",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/0/valueArray/1",
        expected: CompareStateEnum.NONE
      },
      {name: "object with moved items", path: "objectWithArray/indexMoved/1", expected: CompareStateEnum.UPDATED},
      {name: "object with moved items", path: "objectWithArray/indexMoved/1/value", expected: CompareStateEnum.EQUAL},
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/1/valueArray",
        expected: CompareStateEnum.EQUAL
      },
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/1/valueArray/0",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with moved items",
        path: "objectWithArray/indexMoved/1/valueArray/1",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved",
        expected: CompareStateEnum.UPDATED
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/0",
        expected: CompareStateEnum.ADDED
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/0/value",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/0/valueArray",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/0/valueArray/0",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/0/valueArray/1",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/1",
        expected: CompareStateEnum.EQUAL
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/1/value",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/1/valueArray",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/1/valueArray/0",
        expected: CompareStateEnum.NONE
      },
      {
        name: "object with added/removed items",
        path: "objectWithArray/elementsAddedOrRemoved/1/valueArray/1",
        expected: CompareStateEnum.NONE
      }
    ] as CompareTest[])(
      "Get right compare state '$name' should return '$expected' for path '$path'",
      (compareTest) => {
        expect(
          compareEngine.getRightState(
            compareTest.path.split("/")
          ).toString()
        ).toEqual(compareTest.expected);
      }
    );
  })

});

interface CompareTest {
  name: string,
  path: string,
  expected: CompareStateEnum | ""
}
