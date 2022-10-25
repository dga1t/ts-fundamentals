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