// =====================================================
// #105 Intro

// =====================================================
// #106 Bridge

interface IProvider {
  sendMessage(message: string): void;
  connect(confit: unknown): void;
  disconnect(): void;
}

class TelegramProvider implements IProvider {
  sendMessage(message: string): void {
    console.log(message);
  }
  connect(confit: string): void {
    console.log(confit);
  }
  disconnect(): void {
    console.log('disonnected tg');
  }
}

class WhatsupProvider implements IProvider {
  sendMessage(message: string): void {
    console.log(message);
  }
  connect(confit: string): void {
    console.log(confit);
  }
  disconnect(): void {
    console.log('disonnected wu');
  }
}

// so the bridge pattern here is implemented between NotificationSender and IProvider
// it allows us to work with basicaly any providers and easy extension
// which wouldn't be possible if we would be using separate classes and inheritance

class NotificationSender {
  constructor(private provider: IProvider) {}

  send() {
    this.provider.connect('connect');
    this.provider.sendMessage('message');
    this.provider.disconnect();
  }
}

const sender = new NotificationSender(new TelegramProvider());
sender.send();

// =====================================================
// #107 Facade