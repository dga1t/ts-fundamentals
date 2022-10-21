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
