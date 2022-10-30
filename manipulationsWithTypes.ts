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

let strOrNum: string | number;

if (Math.random() > 0.5) strOrNum = 5;
else strOrNum = 'str';

let strOrNum2: typeof strOrNum;

// keyof typeof example 1
const userTwo = { name: 'vasya' };
type keyOfUser = keyof typeof userTwo;

// keyof typeof example 2
enum Direction {
  Up,
  Down,
}
type d = keyof typeof Direction;

// so typeof also allows us to get the type of an object and use it

// =====================================================
// vid #71 Indexed Access Types

interface Role2 {
  name: string;
}

interface Permission {
  endDate: Date;
}

interface User2 {
  name: string;
  roles: Role2[];
  permission: Permission;
}

type rolesType = User2['roles'];
type roleType = User2['roles'][number];
type dateType = User2['permission']['endDate']

// this is a usefull hack if you want to 'convert' some runtime strings
// to types that you can use later on
const roles = ['admin', 'user', 'superuser'] as const;
type roleTypes = typeof roles[number];

