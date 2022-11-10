// =====================================================
// vid #83 Decorator pattern

interface IUserService {
  users: number;
  getUsersInDatabase(): number;
}

// @nullUser
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

class UserServiceFive implements IUserService {
  users: number = 1000;

  @Catch({ rethrow: true })
  getUsersInDatabase(): number {
    throw new Error('error');
  }
}

// its better to use an object as an argument here for readability
function Catch({ rethrow }: { rethrow: boolean } = { rethrow: true }) {
  return (
    target: Object,
    _: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ): TypedPropertyDescriptor<(...args: any[]) => any> | void => {
    const method = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      try {
        return await method?.apply(target, args);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
          if (rethrow) throw e;
        }
      }
    };
  };
}

// =====================================================
// vid #89 Property decorator

class UserServiceSix implements IUserService {
  @Max(100)
  users: number = 1000;

  getUsersInDatabase(): number {
    throw new Error('error');
  }
}

function Max(max: number) {
  return (target: Object, propertyKey: string | symbol) => {
    let value: number;
    const setter = function (newValue: number) {
      if (newValue > max) console.log(`Cant be more then ${max}`);
      else value = newValue;
    };
    const getter = function () {
      return value;
    };

    Object.defineProperty(target, propertyKey, {
      set: setter,
      get: getter,
    });
  };
}

// =====================================================
// vid #90 Accessor decorator

// =====================================================
// vid #91 Parameter decorator && #92 Metadata

import 'reflect-metadata';

// reflect-metadata is a package that is used under the hood in many frameworks
// for example nestjs - dependency injection relies on it

interface IUserServiceSeven {
  getUsersInDatabase(): number;
}

class UserServiceSeven implements IUserServiceSeven {
  private _users: number;

  getUsersInDatabase(): number {
    return this._users;
  }

  setUsersInDatabase(@Positive() num: number): void {
    this._users = num;
  }
}

function Positive() {
  return (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    console.log(Reflect.getOwnMetadata('design:type', target, propertyKey));
  };
}

// =====================================================
// vid #93 Order of decorators
