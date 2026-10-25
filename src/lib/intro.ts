const cbs: (() => void)[] = [];
export const intro = { done: false };
export function finishIntro() { intro.done = true; cbs.splice(0).forEach((f) => f()); }
export function onIntroDone(f: () => void) { if (intro.done) f(); else cbs.push(f); }
