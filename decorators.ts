// =====================================================
// vid #83 Decorator pattern

interface IUserService {
  users: number;
  getUsersInDatabase(): number;
}

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

