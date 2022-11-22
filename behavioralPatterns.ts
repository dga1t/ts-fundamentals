// =====================================================
// vid #111 Intro

// =====================================================
// vid #112 Chain of Command

interface IMiddleware {
  next(mid: IMiddleware): IMiddleware;
  handle(request: any): any;
}

abstract class AbstractMiddleware implements IMiddleware {
  private nextMiddleware: IMiddleware;

  next(mid: IMiddleware) {
    this.nextMiddleware = mid;
    return mid;
  }

  handle(request: any) {
    if (this.nextMiddleware) return this.nextMiddleware.handle(request);
    return;
  }
}

class AuthMiddleware extends AbstractMiddleware {
  override handle(request: any) {
    console.log('AuthMiddleware');
    if (request.userId === 1) return super.handle(request);
    return { error: 'not authorized' };
  }
}

class ValidateMiddleware extends AbstractMiddleware {
  override handle(request: any) {
    console.log('ValidateMiddleware');
    if (request.body) return super.handle(request);
    return { error: 'ze body iz missing :E' };
  }
}

class FinalController extends AbstractMiddleware {
  override handle(request: any) {
    console.log('Controller');
    return { success: request };
  }
}

const controller = new FinalController();
const validate = new ValidateMiddleware();
const auth = new AuthMiddleware();

auth.next(validate).next(controller);

console.log(auth.handle({ userId: 1, body: 'I are' }));

// =====================================================
// vid #113 Mediator

// mediator is more often used on a frontend but also can be seen on a backend
// it usually 'links together' separated components or classes
// that don't know about eath other and 'orcestrates' them

interface Mediator {
  notify(sender: string, event: string): void;
}

abstract class Mediated {
  mediator: Mediator;
  setMediator(mediator: Mediator) {
    this.mediator = mediator;
  }
}

class Notifications {
  send() {
    console.log('notification sent');
  }
}

class LogTwo {
  log(message: string) {
    console.log(message);
  }
}

class EventHandler extends Mediated {
  myEvent() {
    this.mediator.notify('EventHandler', 'myEvent');
  }
}

// so all the business logic is concentrated in mediator
class NotificationMediator implements Mediator {
  constructor(
    public notifications: Notifications,
    public logger: LogTwo,
    public handler: EventHandler
  ) {}

  notify(sender: string, event: string): void {
    switch (event) {
      case 'meEvent':
        this.notifications.send();
        this.logger.log('has been sent');
        break;
    }
  }
}

const handler = new EventHandler();
const logger = new LogTwo();
const notifications = new Notifications();

const m = new NotificationMediator(notifications, logger, handler);
handler.setMediator(m);
handler.myEvent();

// =====================================================
// vid #114 Command

// on the frontend its is often used in state management
// on the backend in cqrs pattern (command-query responsibility segregation)

class UserSeven {
  constructor(public userId: number) {}
}

class CommandHistory {
  public commands: Command[] = [];
  push(command: Command) {
    this.commands.push(command);
  }
  remove(command: Command) {
    this.commands = this.commands.filter(
      (c) => c.commandId !== command.commandId
    );
  }
}

// abstract command can have various logic in it
abstract class Command {
  public commandId: number;

  abstract execute(): void;

  constructor(public history: CommandHistory) {
    this.commandId = Math.random();
  }
}

// the concrete actual realization of command
class AddUserCommand extends Command {
  constructor(
    private user: UserSeven,
    private receiver: UserServiceTwo,
    history: CommandHistory
  ) {
    super(history);
  }

  execute(): void {
    this.receiver.saveUser(this.user);
    this.history.push(this);
  }

  undo() {
    this.receiver.deleteUser(this.user.userId);
    this.history.remove(this);
  }
}

class UserServiceTwo {
  saveUser(user: UserSeven) {}
  deleteUser(userId: number) {}
}

class ControllerTwo {
  receiver: UserServiceTwo;
  history: CommandHistory = new CommandHistory();

  addReceiver(receiver: UserServiceTwo) {
    this.receiver = receiver;
  }

  run() {
    const addUserCommand = new AddUserCommand(
      new UserSeven(1),
      this.receiver,
      this.history
    );
    addUserCommand.execute();
    addUserCommand.undo();
  }
}

const controllerTwo = new ControllerTwo();
controllerTwo.addReceiver(new UserServiceTwo());
controllerTwo.run();

// =====================================================
// vid #115 State

class DocumentItem {
  public text: string;
  private state: DocumentItemState;

  constructor() {
    this.setState(new DraftDocumentItemState());
  }
  getState() {
    return this.state;
  }
  setState(state: DocumentItemState) {
    this.state = state;
    this.state.setContext(this);
  }
  publishDoc() {
    this.state.publish();
  }
  deleteDoc() {
    this.state.delete();
  }
}

abstract class DocumentItemState {
  public name: string;
  public item: DocumentItem;

  public setContext(item: DocumentItem) {
    this.item = item;
  }

  public abstract publish(): void;
  public abstract delete(): void;
}

class DraftDocumentItemState extends DocumentItemState {
  constructor() {
    super();
    this.name = 'DraftDocument';
  }
  public publish(): void {
    this.item.setState(new PublishDocumentItemState());
  }
  public delete(): void {
    console.log('deleted');
  }
}
class PublishDocumentItemState extends DocumentItemState {
  constructor() {
    super();
    this.name = 'PublishDocument';
  }
  public publish(): void {
    console.log('cant publish doc again');
  }
  public delete(): void {
    this.item.setState(new DraftDocumentItemState());
  }
}

const item = new DocumentItem();
item.text = 'som text';
console.log(item.getState());
item.publishDoc();
item.deleteDoc();

// =====================================================
// vid #116 Strategy

// its an algoritm where we pick similar patterns/algorithms in our system,
// create a class for them and can swap/change these strategies on the fly

// is often used for authorization (jwt/google/or other auths)
// nest.js and passport.js use strategy pattern for authorization

class UserEight {
  gitHubToken: string;
  jwtToken: string;
}

interface IAuthStrategy {
  auth(user: UserEight): boolean;
}

class Auth {
  constructor(private strategy: IAuthStrategy) {}

  setStrategy(strategy: IAuthStrategy) {
    this.strategy = strategy;
  }

  public authUser(user: UserEight): boolean {
    return this.strategy.auth(user);
  }
}

class JWTStrategy implements IAuthStrategy {
  auth(user: UserEight): boolean {
    if (user.jwtToken) return true;
    return false;
  }
}

class GitHubStrategy implements IAuthStrategy {
  auth(user: UserEight): boolean {
    if (user.gitHubToken) return true;
    return false;
  }
}

const userEight = new UserEight();
userEight.jwtToken = 'token';
const authTwo = new Auth(new JWTStrategy());
console.log(authTwo.authUser(userEight));
authTwo.setStrategy(new GitHubStrategy());

// =====================================================
// vid #117 Iterator

class Task {
  constructor(public priority: number) {}
}

class TaskList {
  private tasks: Task[] = [];

  public sortByPriority() {
    this.tasks = this.tasks.sort((a, b) => {
      if (a.priority > b.priority) return 1;
      else if (a.priority == b.priority) return 0;
      else return -1;
    });
  }

  public addTask(task: Task) {
    this.tasks.push(task);
  }

  public getTasks() {
    return this.tasks;
  }

  public count() {
    return this.tasks.length;
  }

  public getIterator() {
    // can be changed on the go - PriorityTaskIterator is hardcoded as example
    return new PriorityTaskIterator(this);
  }
}

interface IIterator<T> {
  current(): T | undefined;
  next(): T | undefined;
  prev(): T | undefined;
  index(): number;
}

class PriorityTaskIterator implements IIterator<Task> {
  private position: number = 0;
  private taskList: TaskList;

  constructor(taskLikst: TaskList) {
    taskLikst.sortByPriority();
    this.taskList = taskLikst;
  }

  current(): Task | undefined {
    return this.taskList.getTasks()[this.position];
  }
  next(): Task | undefined {
    this.position += 1;
    return this.taskList.getTasks()[this.position];
  }
  prev(): Task | undefined {
    this.position -= 1;
    return this.taskList.getTasks()[this.position];
  }
  index(): number {
    return this.position;
  }
}

const taskList = new TaskList();
taskList.addTask(new Task(8));
taskList.addTask(new Task(1));
taskList.addTask(new Task(4));
const iterator = taskList.getIterator();
console.log(iterator.current());
console.log(iterator.next());
console.log(iterator.index());

// so important is that with help of iterator we can navigate over our list easyly
// iterator is especially usefull when we have not just an array but a tree

// =====================================================
// vid #118 Template Method

