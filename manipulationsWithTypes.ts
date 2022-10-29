// =====================================================
// vid #67 Intro

// this section is worth revisiting because its a more advanced concepts

// =====================================================
// vid #68 Keyof

interface IUserTwo {
  name: string;
  age: number;
}

type KeysOfUserTwo = keyof IUserTwo;

const key: KeysOfUserTwo = 'age'; // can be only age || name

function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

// =====================================================
// vid #69 Exercise

interface Data {
  group: number;
  name: string;
}

interface IGroup<T> {
  [key: string]: T[];
}

type key = string | number | symbol;

// so we need to group by some property that necessarily exists in the objects that we group
function group<T extends Record<key, any>>(
  array: T[],
  key: keyof T
): IGroup<T> {
  return array.reduce<IGroup<T>>((map: IGroup<T>, item) => {
    const itemKey = item[key];
    let curEl = map[itemKey];

    if (Array.isArray(curEl)) curEl.push(item);
    else curEl = [item];
    map[itemKey] = curEl;
    return map;
  }, {});
}

// =====================================================
// vid #70 Typeof

