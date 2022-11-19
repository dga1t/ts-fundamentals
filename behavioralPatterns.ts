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
