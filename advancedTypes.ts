// vid #20 Union - type narrowing
function logId(id: string | number | boolean) {
  if (typeof id === 'string') console.log(id);
  else if (typeof id === 'number') console.log(id);
  else console.log(id);
}

function logError(err: string | string[]) {
  if (Array.isArray(err)) console.log(err);
  else console.log(err);
}

function logObject(obj: { a: number } | { b: number }) {
  if ('a' in obj) console.log(obj.a);
  else console.log(obj.b);
}

// =====================================================
// vid #21 Literal Types

function fetchWithAuth(url: string, method: 'post' | 'get'): 1 | -1 {
  return 1;
}

// =====================================================
// vid #22 Type Aliases

type httpMethod = 'post' | 'get';

function fetchWithAuth2(url: string, method: httpMethod): 1 | -1 {
  return 1;
}

type User = {
  name: string;
  age: number;
  skills: string[];
};

type Role = {
  id: number;
};

type UserWithRole = User & Role;

let user: UserWithRole = {
  name: 'asd',
  age: 33,
  skills: ['1', '2'],
  id: 1,
};

// =====================================================
// vid #23 Interfaces
