// =====================================================
// vid #83 Decorator pattern

interface IUserService {
  users: number;
  getUsersInDatabase(): number;
}

@nullUser
class UserServiceOmg implements IUserService {
  users: number = 1000;

  getUsersInDatabase(): number {
    return this.users;
  }
}

// decorator is a pattern and under the hood is just a function that wraps classes, functions, etc..
// @decorator - is a declarative syntactic sugar

// here are two basic decorator functions:
function nullUser(obj: IUserService) {
  obj.users = 0;
  return obj;
}

function logUsers(obj: IUserService) {
  console.log('Users: ', obj.users);
  return obj;
}

// decorators can be combined and stacked together
console.log(new UserServiceOmg().getUsersInDatabase());
console.log(nullUser(new UserServiceOmg()).getUsersInDatabase());
console.log(logUsers(nullUser(new UserServiceOmg())).getUsersInDatabase());

// =====================================================
// vid #84 Class decorator

function nullUserOMG(target: Function) {
  target.prototype.users = 0;
}

function threeUserAdvanced<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    users = 3;
  };
}

// @nullUserOMG
@threeUserAdvanced
class UserServiceOMG implements IUserService {
  users: number = 1000;

  getUsersInDatabase(): number {
    return this.users;
  }
}

// =====================================================
// vid #85 Decorator fabric

function setUsers(users: number) {
  return (target: Function) => {
    target.prototype.users = users;
  };
}

function setUserAdvanced(users: number) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      users = users;
    };
  };
}

// the order of decorators is important - they get initialized in the same oreder top to bottom
// but actually executed in reverse order - from bottom to top
@nullUserOMG
@setUsers(5)
@threeUserAdvanced
@setUserAdvanced(4)
class UserServiceThree implements IUserService {
  users: number = 1000;

  getUsersInDatabase(): number {
    return this.users;
  }
}

// =====================================================
// vid #86 Exercise

function CreatedAt<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    createdAt = new Date();
  };
}

// =====================================================
// vid #87 Method decorator

class UserServiceFour implements IUserService {
  users: number = 1000;

  @Log
  getUsersInDatabase(): number {
    throw new Error('error');
  }
}

// can also be a factory/fabric like in vid 85
function Log(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
): TypedPropertyDescriptor<(...args: any[]) => any> | void {
  console.log(target);
  console.log(propertyKey);
  console.log(descriptor);
  descriptor.value = () => {
    console.log('no error');
  };
}

// =====================================================
// vid #88 Exercise

