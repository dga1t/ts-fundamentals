// =====================================================
// vid #59 Builtin generics

const a: Array<number> = [1, 2, 3];

// without generics there would have been no way to pass the type to promise
async function test() {
  const b = await new Promise<number>((resolve, reject) => {
    resolve(1);
  });
}

const check: Record<string, boolean> = {
  drive: true,
  kpp: false,
};

// =====================================================
// vid #60 Function with generic
