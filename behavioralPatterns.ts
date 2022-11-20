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
