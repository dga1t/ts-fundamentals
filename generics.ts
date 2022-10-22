// =====================================================
// vid #59 Builtin generics

const a: Array<number> = [1, 2, 3];

// without generics there would have been no way to pass the type to promise
async function test() {
  const b = await new Promise<number>((resolve, reject) => {
    resolve(1);
  });
}

const check: Record<string, boolean> = {
  drive: true,
  kpp: false,
};

// =====================================================
// vid #60 Function with generic

function logMiddleware<T>(data: T): T {
  console.log(data);
  return data;
}

function getSplittedHalf<T>(data: Array<T>): Array<T> {
  const l = data.length / 2;
  return data.splice(0, l);
}

// =====================================================
// vid #61 Exercise

function stringify<T>(data: T): string | undefined {
  if (Array.isArray(data)) return data.toString();

  switch (typeof data) {
    case 'string':
      return data;
    case 'number':
    case 'symbol':
    case 'bigint':
    case 'boolean':
    case 'function':
      return data.toString();
    case 'object':
      return JSON.stringify(data);
    default:
      return undefined;
  }
}

// =====================================================
// vid #62 Generics use cases

// 'T' can be any other letter/word - its just a convention
const split: <T>(data: Array<T>) => Array<T> = getSplittedHalf;
const split2: <Y>(data: Array<Y>) => Array<Y> = getSplittedHalf;

interface ILogLine<T> {
  timeStamp: Date;
  data: T;
}

type LogLineType<T> = {
  timeStamp: Date;
  data: T;
};

const logLine: ILogLine<{ a: number }> = {
  timeStamp: new Date(),
  data: { a: 1 },
};

// =====================================================
// vid #63 Limitations

interface Vehicle {
  run: number;
}

function kmToMiles<T extends Vehicle>(vehicle: T): T {
  vehicle.run = vehicle.run / 0.62;
  return vehicle;
}

interface LCV extends Vehicle {
  capacity: number;
}

// const vehicle = kmToMiles(new Vehicle());
// const lcv = kmToMiles(new LCV());
kmToMiles({ run: 1 });

function logId<T extends string | number, Y>(
  id: T,
  someData: Y
): { id: T; data: Y } {
  console.log(id);
  console.log(someData);
  return { id, data: someData };
}

// =====================================================
// vid #64 Exercise

interface ID {
  id: number;
}

function sort<T extends ID>(data: T[], type: 'asc' | 'desc' = 'asc'): T[] {
  return data.sort((a, b) => {
    switch (type) {
      case 'asc':
        return a.id - b.id;
      case 'desc':
        return b.id - a.id;
    }
  });
}

// =====================================================
// vid #65 Generic classes

class Resp<D, E> {
  data?: D;
  error?: E;

  constructor(data?: D, error?: E) {
    this.data = data;
    this.error = error;
  }
}

const res = new Resp<string, number>('data', 0);

class HTTPResp<F> extends Resp<string, number> {
  code: F;

  setCode(code: F) {
    this.code = code;
  }
}

const res2 = new HTTPResp();

// =====================================================
// vid #66 Mixins

// basic & generis constructors
type Constructor = new (...args: any[]) => {};
type GConstructor<T = {}> = new (...args: any[]) => T;

class List {
  constructor(public items: string[]) {}
}

class Accordeon {
  isOpened: boolean;
}

type ListType = GConstructor<List>;
type AccordeonType = GConstructor<Accordeon>;

// we could achieve mixin functionality with class like this
class ExtendedListClass extends List {
  first() {
    return this.items[0];
  }
}

// and the actual mixin:
// we pass a class to a mixin function that returns another class
// that extends class that was passed in as an argument
function ExtendedList<TBase extends ListType & AccordeonType>(Base: TBase) {
  return class ExtendedList extends Base {
    first() {
      return this.items[0];
    }
  };
}

class AccordeonList {
  isOpened: boolean;
  constructor(public items: string[]) {}
}

const list = ExtendedList(AccordeonList);
const result = new list(['first', 'second']);
console.log(result.first());

// so a mixin allows us extend from multiple classes at the same time with typechecking
// mixins are widely used in DCI (data, context and interaction) paradigm
// and are usefull when you are building complex structures from small parts