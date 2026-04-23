# JavaScript · React · Redux — Tricky Interview Questions

> Questions are crisp. Answers are detailed. Jump to any section using the TOC.

---

## Table of Contents

1. [JavaScript — Core & Tricky](#1-javascript--core--tricky)
   - [Types & Coercion](#11-types--coercion)
   - [Scope, Closures & Hoisting](#12-scope-closures--hoisting)
   - [this & Execution Context](#13-this--execution-context)
   - [Prototypes & Inheritance](#14-prototypes--inheritance)
   - [Async — Promises, async/await, Event Loop](#15-async--promises-asyncawait-event-loop)
   - [Functions & Patterns](#16-functions--patterns)
   - [Arrays & Objects](#17-arrays--objects)
   - [Modules & Memory](#18-modules--memory)
2. [React — Core & Tricky](#2-react--core--tricky)
   - [Rendering & Reconciliation](#21-rendering--reconciliation)
   - [Hooks — Deep Dive](#22-hooks--deep-dive)
   - [State & Props](#23-state--props)
   - [Performance](#24-performance)
   - [Patterns & Architecture](#25-patterns--architecture)
3. [React — Follow-up Questions](#3-react--follow-up-questions)
4. [Redux — Core & Tricky](#4-redux--core--tricky)
   - [Fundamentals](#41-fundamentals)
   - [Middleware & Side Effects](#42-middleware--side-effects)
   - [Redux Toolkit (RTK)](#43-redux-toolkit-rtk)
   - [RTK Query](#44-rtk-query)
   - [Performance & Patterns](#45-performance--patterns)

---

---

## 1. JavaScript — Core & Tricky

---

### 1.1 Types & Coercion

---

**Q1. What does `[] + []` evaluate to?**

**A:** `""` (empty string).
Both arrays are coerced to strings (`""`) via `.toString()`, and `"" + ""` is `""`.

---

**Q2. What does `[] + {}` evaluate to?**

**A:** `"[object Object]"`.
`[]` → `""`, `{}` → `"[object Object]"`, concatenated gives `"[object Object]"`.

**Twist:** `{} + []` (as a *statement*, not expression) evaluates to `0` because `{}` is treated as an empty block, leaving `+[]` which is `0`.

---

**Q3. Why is `0.1 + 0.2 !== 0.3`?**

**A:** IEEE 754 double-precision floating-point cannot represent `0.1` and `0.2` exactly. The result is `0.30000000000000004`.
Fix: `Math.abs(a - b) < Number.EPSILON`.

---

**Q4. What is `typeof null`?**

**A:** `"object"` — a historical bug in JS kept for backward compatibility. `null` is not an object; check with `value === null`.

---

**Q5. What is `NaN === NaN`?**

**A:** `false`. `NaN` is the only value not equal to itself. Use `Number.isNaN(x)` (not the legacy `isNaN` which coerces first).

---

**Q6. `==` vs `===` — when does `==` surprise you?**

**A:** Classic traps:
```js
null == undefined  // true
null === undefined // false
0 == false         // true
"" == false        // true
[] == false        // true
[] == ![]          // true  (! converts [] to false, then [] == false)
```
Always prefer `===`.

---

**Q7. What is the result of `+[]`, `+{}`, `+""`, `+null`, `+undefined`?**

**A:**
```js
+[]        // 0   ([] → "" → 0)
+{}        // NaN ({} → "[object Object]" → NaN)
+""        // 0
+null      // 0
+undefined // NaN
```

---

### 1.2 Scope, Closures & Hoisting

---

**Q8. What prints?**
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**A:** `3 3 3`. `var` is function-scoped, so all callbacks close over the same `i` which is `3` by the time they run.
Fix: use `let` (block-scoped) or `setTimeout(() => console.log(i), 0, i)`.

---

**Q9. What is a closure and why does it "remember"?**

**A:** A closure is a function bundled with its lexical environment. Even after the outer function returns, the inner function retains a *live reference* (not a copy) to outer variables — so mutations are reflected.

```js
function counter() {
  let n = 0;
  return () => ++n;
}
const c = counter();
c(); // 1
c(); // 2
```

---

**Q10. What is the TDZ (Temporal Dead Zone)?**

**A:** `let` and `const` are hoisted but NOT initialized. Accessing them before their declaration throws a `ReferenceError`. The period between the start of the block and the declaration is the TDZ.

```js
console.log(x); // ReferenceError
let x = 5;
```

---

**Q11. Does `const` make an object immutable?**

**A:** No. `const` prevents *rebinding* the variable. The object's properties can still be mutated. Use `Object.freeze()` for shallow immutability.

---

**Q12. What prints?**
```js
console.log(foo);
var foo = 1;
console.log(foo);
function foo() {}
console.log(foo);
```

**A:** `[Function: foo]`, `1`, `1`.
Function declarations are hoisted above `var`. After the assignment `foo = 1`, it's `1`.

---

### 1.3 `this` & Execution Context

---

**Q13. What is `this` in an arrow function?**

**A:** Arrow functions do not have their own `this`. They inherit `this` from their enclosing lexical scope at definition time. `call`/`apply`/`bind` cannot override it.

---

**Q14. What prints?**
```js
const obj = {
  name: "A",
  greet: function() { return () => this.name; }
};
const fn = obj.greet();
console.log(fn()); // ?
```

**A:** `"A"`. The arrow inherits `this` from `greet`, which was called as `obj.greet()`, so `this` is `obj`.

---

**Q15. What is the output?**
```js
function foo() { console.log(this); }
foo();            // (1)
foo.call(null);   // (2)
```

**A:**
(1) `globalThis` (or `undefined` in strict mode).
(2) `globalThis` in sloppy mode (null is ignored), `null` in strict mode.

---

**Q16. Difference between `call`, `apply`, and `bind`?**

**A:**
- `call(ctx, a, b)` — invokes immediately, args passed individually.
- `apply(ctx, [a, b])` — invokes immediately, args as array.
- `bind(ctx, a)` — returns a new function with `this` pre-set; does not invoke.

---

### 1.4 Prototypes & Inheritance

---

**Q17. What is the prototype chain?**

**A:** Every object has an internal `[[Prototype]]` link. Property lookup walks this chain until it hits `null`. `Object.prototype` is the root.

---

**Q18. What is the difference between `__proto__` and `prototype`?**

**A:**
- `__proto__` — the actual prototype link of an *instance* (deprecated; use `Object.getPrototypeOf()`).
- `prototype` — a property on *constructor functions* used to set `[[Prototype]]` of instances created with `new`.

---

**Q19. What does `Object.create(null)` give you?**

**A:** An object with no prototype at all — no `toString`, `hasOwnProperty`, etc. Useful as a pure hash map.

---

**Q20. What is the output?**
```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name; };
const a = new Animal("Cat");
console.log(a.hasOwnProperty("name"));  // ?
console.log(a.hasOwnProperty("speak")); // ?
```

**A:** `true`, `false`. `name` is own property; `speak` lives on the prototype.

---

### 1.5 Async — Promises, async/await, Event Loop

---

**Q21. What is the Event Loop?**

**A:** JS is single-threaded. The event loop picks tasks from:
1. **Call stack** (synchronous code)
2. **Microtask queue** (Promises, `queueMicrotask`) — drained completely after each task
3. **Macrotask queue** (`setTimeout`, `setInterval`, I/O)

Microtasks always run before the next macrotask.

---

**Q22. What is the output order?**
```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

**A:** `1`, `4`, `3`, `2`.
Sync runs first (1, 4), then microtask (3), then macrotask (2).

---

**Q23. What is the difference between `Promise.all`, `Promise.allSettled`, `Promise.race`, `Promise.any`?**

**A:**
| Method | Resolves when | Rejects when |
|---|---|---|
| `Promise.all` | ALL fulfill | ANY rejects |
| `Promise.allSettled` | ALL settle (never rejects) | — |
| `Promise.race` | FIRST settles | FIRST rejects |
| `Promise.any` | FIRST fulfills | ALL reject (AggregateError) |

---

**Q24. What is unhandled promise rejection?**

**A:** A Promise that rejects without a `.catch()` or `try/catch` in async functions. In Node.js it terminates the process by default. Always handle rejections.

---

**Q25. Can `async/await` cause memory leaks?**

**A:** Yes, if you `await` inside a loop on large arrays or hold references alive in closures. Prefer `Promise.all` for parallel work and avoid capturing large objects in long-lived async closures.

---

**Q26. What is the output?**
```js
async function foo() {
  return 1;
}
foo().then(console.log); // ?
```

**A:** `1`. `async` functions always return a Promise that wraps the returned value.

---

**Q27. What happens with `await` outside `async`?**

**A:** Syntax error in classic scripts. Top-level `await` is valid in ES Modules (`type="module"` or `.mjs` files).

---

### 1.6 Functions & Patterns

---

**Q28. What is currying?**

**A:** Transforming a function `f(a, b, c)` into `f(a)(b)(c)`. Enables partial application.

```js
const add = a => b => a + b;
const add5 = add(5);
add5(3); // 8
```

---

**Q29. What is memoization?**

**A:** Caching function results by input. Trades memory for speed.

```js
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

---

**Q30. What is the difference between a generator and an async function?**

**A:**
- **Generator** (`function*`): pauses with `yield`, returns an iterator. Synchronous by default.
- **Async function**: pauses with `await`, always returns a Promise. Built on generators + Promises internally.

---

**Q31. What is `Function.prototype.toString()`?**

**A:** Returns the source code of the function as a string, including comments and whitespace as written.

---

### 1.7 Arrays & Objects

---

**Q32. What is the difference between `map`, `filter`, `reduce`, and `forEach`?**

**A:**
- `map` — returns new array of same length, transformed.
- `filter` — returns new array with items passing predicate.
- `reduce` — reduces to a single value (accumulator).
- `forEach` — side effects only; returns `undefined`.

---

**Q33. Does `Array.prototype.sort` mutate the original array?**

**A:** Yes. It sorts in place and also returns the same array. Always clone first if you need immutability: `[...arr].sort(...)`.

---

**Q34. What is the default sort behavior and when does it fail?**

**A:** Default converts elements to strings and sorts lexicographically. `[10, 9, 2].sort()` gives `[10, 2, 9]`. Always provide a comparator: `.sort((a, b) => a - b)`.

---

**Q35. Difference between shallow copy and deep copy?**

**A:**
- **Shallow**: copies top-level properties; nested objects are still references. (`{...obj}`, `Object.assign`)
- **Deep**: recursively copies all levels. (`structuredClone(obj)`, `JSON.parse(JSON.stringify(obj))` — but loses functions, `undefined`, `Date` objects → use `structuredClone`).

---

**Q36. What is `WeakMap` and when do you use it?**

**A:** Like `Map` but keys must be objects and are *weakly* held — if the key object is garbage collected, the entry is automatically removed. Ideal for private data or caching without preventing GC.

---

### 1.8 Modules & Memory

---

**Q37. CommonJS vs ES Modules?**

**A:**
| | CJS (`require`) | ESM (`import`) |
|---|---|---|
| Loading | Dynamic, synchronous | Static, async |
| Binding | Value copy | Live binding |
| Tree-shaking | Hard | Native |
| Top-level `await` | No | Yes |

---

**Q38. What is a memory leak in JavaScript?**

**A:** When objects are no longer needed but still referenced, preventing GC. Common causes:
- Forgotten event listeners
- Global variables
- Closures holding large objects
- Detached DOM nodes still referenced in JS
- Timers not cleared

---

**Q39. What is the difference between `Map` and a plain object as a dictionary?**

**A:** `Map` allows any type as key, maintains insertion order, has O(1) `.size`, no prototype key pollution, and is iterable directly. Plain objects coerce keys to strings and inherit prototype properties.

---

---

## 2. React — Core & Tricky

---

### 2.1 Rendering & Reconciliation

---

**Q1. When does React re-render a component?**

**A:** When:
1. Its own state changes (`setState` / `useState` setter)
2. Its props change (shallow comparison by default)
3. Its parent re-renders (and it's not wrapped in `React.memo`)
4. A consumed context value changes

---

**Q2. What is the virtual DOM and how does reconciliation work?**

**A:** React keeps a virtual DOM (a lightweight JS object tree). On state change:
1. A new virtual DOM is built.
2. React diffs it against the previous tree (the "diffing" algorithm).
3. Only the minimal set of actual DOM mutations is applied.

Key heuristics: same type = update, different type = unmount + remount; `key` prop is used for lists.

---

**Q3. Why is `key` important in lists? What happens if you use index as key?**

**A:** `key` lets React identify which items changed, added, or removed. Using index as key causes bugs when items are reordered or deleted because React matches by position, not identity — leading to incorrect state retention and unnecessary re-renders.

---

**Q4. What is React Fiber?**

**A:** Fiber is React's reconciliation engine (introduced in React 16). It breaks rendering into units of work that can be paused, aborted, or prioritized — enabling Concurrent Mode features like `useTransition`, `Suspense`, and time-slicing.

---

**Q5. What is the difference between controlled and uncontrolled components?**

**A:**
- **Controlled**: React state is the single source of truth. Every change goes through `onChange` → state update → re-render.
- **Uncontrolled**: DOM manages its own state; accessed via `ref`. Simpler but less predictable.

---

### 2.2 Hooks — Deep Dive

---

**Q6. What are the rules of Hooks?**

**A:**
1. Only call Hooks at the top level — never inside loops, conditions, or nested functions.
2. Only call Hooks from React function components or custom Hooks.

React uses call order to match Hook state to the correct Hook across renders.

---

**Q7. What is the difference between `useEffect` and `useLayoutEffect`?**

**A:**
- `useEffect` — runs *after* the browser has painted. Non-blocking, good for data fetching, subscriptions.
- `useLayoutEffect` — runs synchronously *after* DOM mutations but *before* the browser paints. Use for DOM measurements / animations to avoid flicker.

---

**Q8. Why can `useEffect` return only a function?**

**A:** The cleanup function allows React to cancel subscriptions, clear timers, etc., before the next effect runs or on unmount. If you pass an `async` function, it returns a Promise, not a cleanup function — so wrap async logic inside.

```js
useEffect(() => {
  let active = true;
  fetchData().then(d => { if (active) setData(d); });
  return () => { active = false; };
}, [dep]);
```

---

**Q9. What is `useRef` used for beyond DOM access?**

**A:**
- Persist a mutable value across renders without causing re-render (like an instance variable).
- Store previous state values.
- Hold timer IDs.
- Avoid stale closures in event handlers.

---

**Q10. What is a stale closure in React?**

**A:** When a `useEffect` or event handler captures an old value of state/prop because it closed over it at a previous render. Fix:
- Include the value in the dependency array.
- Use `useRef` to always have the latest value.
- Use functional updates: `setState(prev => prev + 1)`.

---

**Q11. What does `useCallback` actually do?**

**A:** Returns a memoized version of a callback. The function is only re-created if its dependencies change. Useful to prevent child re-renders when passing callbacks as props — but only when the child is wrapped in `React.memo`.

---

**Q12. What is the difference between `useMemo` and `useCallback`?**

**A:**
- `useMemo(() => compute(a, b), [a, b])` — memoizes the *result* of a function.
- `useCallback(fn, deps)` — memoizes the *function itself*. Equivalent to `useMemo(() => fn, deps)`.

---

**Q13. What is `useReducer` and when is it better than `useState`?**

**A:** `useReducer(reducer, initialState)` is preferable when:
- Next state depends on complex logic involving the previous state.
- Multiple sub-values are updated together.
- State transitions are easier to describe as actions (testable, predictable).

---

**Q14. What is `useContext` and what's its performance pitfall?**

**A:** `useContext` subscribes to a context. The pitfall: every consumer re-renders whenever *any* part of the context value changes, even if the consuming component only uses a slice. Split contexts or use selector libraries (`use-context-selector`) to avoid this.

---

### 2.3 State & Props

---

**Q15. Does `setState` in React always trigger a re-render?**

**A:** No. If the new state is shallowly equal to the old state (for `useState`), React bails out and skips re-render. But the check is shallow — if you mutate and return the same object reference, React won't re-render.

---

**Q16. What happens if you mutate state directly?**

**A:** React uses reference equality to detect changes. Direct mutation doesn't change the reference, so React skips re-render. The UI goes stale. Always return new objects/arrays.

---

**Q17. What is prop drilling and how do you avoid it?**

**A:** Passing props through many intermediate components that don't use them. Avoid with:
- React Context
- State management (Redux, Zustand, Jotai)
- Component composition / render props

---

### 2.4 Performance

---

**Q18. What is `React.memo`?**

**A:** A HOC that memoizes a component. If props haven't changed (shallow equality), React skips re-rendering. Does NOT prevent re-renders due to internal state or context changes.

---

**Q19. What is the difference between `React.memo` and `useMemo`?**

**A:**
- `React.memo` — memoizes a *component* (prevents re-render).
- `useMemo` — memoizes a *value* inside a component.

---

**Q20. What is `useTransition`?**

**A:** Marks a state update as non-urgent (low priority). React can interrupt it to handle urgent updates (typing, clicking) first. Returns `[isPending, startTransition]`.

---

**Q21. What is code splitting in React?**

**A:** Splitting the bundle into chunks loaded on demand. Use `React.lazy(() => import('./Component'))` with `<Suspense fallback={...}>`. Combined with route-based splitting for optimal loading.

---

### 2.5 Patterns & Architecture

---

**Q22. What is a custom Hook?**

**A:** A function starting with `use` that calls other Hooks. Extracts stateful logic for reuse without changing component hierarchy. Not a pattern enforced by React — purely a convention.

---

**Q23. What is the render props pattern?**

**A:** A component accepts a function as a `render` prop (or `children`) and calls it to determine what to render. Shares stateful logic without HOCs.

```tsx
<Mouse render={({ x, y }) => <Cursor x={x} y={y} />} />
```

---

**Q24. What is a Higher-Order Component (HOC)?**

**A:** A function that takes a component and returns a new component with added behavior. Drawbacks: prop name collisions, wrapper hell. Custom Hooks are now preferred.

---

**Q25. What is `Suspense` used for?**

**A:**
- Lazy loading components (`React.lazy`).
- Data fetching in frameworks like Next.js or React 18's `use()` hook.
- Shows a fallback while children are "suspended" (async work pending).

---

---

## 3. React — Follow-up Questions

---

**Q1. You used `useEffect` with an empty array. Could it run more than once?**

**A:** In React 18 Strict Mode (development), effects run twice on mount to help detect side effects. In production, they run once.

---

**Q2. If `React.memo` does a shallow comparison, how do you handle complex prop changes?**

**A:** Pass a custom comparison function as the second argument:
```tsx
React.memo(Component, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id;
});
```

---

**Q3. Can you call hooks conditionally with a workaround?**

**A:** No. The rules prohibit it. Workaround: put the condition *inside* the hook or split into separate components where each component always calls the hook.

---

**Q4. How do you share logic between class and function components?**

**A:** Use utility functions or render props / HOCs (both work with class components). Custom Hooks only work in function components.

---

**Q5. How do you avoid infinite loops in `useEffect`?**

**A:**
- Ensure dependencies don't change every render (memoize objects/functions passed as deps).
- Don't put the setter result of `useState` in the dependency array.
- Use `useRef` for values that shouldn't trigger re-runs.

---

**Q6. What is `flushSync` in React 18?**

**A:** Forces React to flush state updates synchronously inside the callback, bypassing batching. Used when you need the DOM updated immediately (e.g., before reading layout).

---

**Q7. What is automatic batching in React 18?**

**A:** React 18 batches *all* state updates (including inside `setTimeout`, `fetch` callbacks, native event handlers) into a single re-render by default. React 17 only batched inside React event handlers.

---

**Q8. How does React handle errors? What is an Error Boundary?**

**A:** Error Boundaries are class components implementing `componentDidCatch` and `getDerivedStateFromError`. They catch errors in their subtree during render, lifecycle methods, and constructors. Hooks do not support error boundaries yet — use a library like `react-error-boundary`.

---

**Q9. Can you use async functions directly inside JSX?**

**A:** No. JSX renders synchronously. Async functions return Promises, not React elements. Use `useEffect` for async side effects; for async rendering, use React Server Components or Suspense-compatible data sources.

---

**Q10. What is the difference between React 17 and React 18 root APIs?**

**A:**
```js
// React 17
ReactDOM.render(<App />, document.getElementById("root"));

// React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```
`createRoot` enables Concurrent Mode features.

---

---

## 4. Redux — Core & Tricky

---

### 4.1 Fundamentals

---

**Q1. What are the three core principles of Redux?**

**A:**
1. **Single source of truth** — the entire app state lives in one store.
2. **State is read-only** — only actions can describe state changes.
3. **Changes via pure functions** — reducers must be pure (no side effects, no mutation).

---

**Q2. What is an action creator?**

**A:** A function that returns an action object. Ensures consistency and makes actions reusable/testable.

```js
const increment = (amount) => ({ type: "counter/increment", payload: amount });
```

---

**Q3. What is the difference between an action and a thunk?**

**A:**
- **Action**: plain object with `{ type, payload }`.
- **Thunk**: a function that takes `(dispatch, getState)` — returned by an action creator to handle async work before dispatching real actions.

---

**Q4. What makes a reducer "pure"?**

**A:**
- Given the same inputs, always returns the same output.
- No side effects: no API calls, no mutations, no `Date.now()`, no `Math.random()`.
- Never mutates the existing state — returns new references.

---

**Q5. What happens if a reducer returns `undefined`?**

**A:** Redux throws an error. Reducers must always return a valid state. Use a default parameter: `(state = initialState, action)`.

---

**Q6. Can you have multiple reducers?**

**A:** Yes. `combineReducers({ a: reducerA, b: reducerB })` creates a root reducer where each slice manages its own subtree of state.

---

**Q7. What is the `@@INIT` action?**

**A:** Redux dispatches `@@redux/INIT` when the store is created. This causes reducers to return their initial state (via the default parameter), populating the store.

---

### 4.2 Middleware & Side Effects

---

**Q8. What is Redux middleware?**

**A:** A composable layer between `dispatch` and the reducer. Middleware can intercept, transform, delay, or log actions.

Signature:
```js
const myMiddleware = store => next => action => {
  // do something
  return next(action);
};
```

---

**Q9. What is Redux Thunk?**

**A:** Middleware that checks if the dispatched value is a function. If so, it calls it with `(dispatch, getState)` instead of passing it to the reducer. Enables async action creators.

---

**Q10. What is Redux Saga vs Redux Thunk?**

**A:**
| | Thunk | Saga |
|---|---|---|
| Approach | Function-based | Generator-based |
| Testing | Harder (mock dispatch) | Easier (test effect descriptions) |
| Complexity | Simple | High |
| Features | Basic async | Channels, race, debounce, retry |

Use Thunk for simple async; Saga for complex workflows.

---

**Q11. What is `redux-observable`?**

**A:** Middleware using RxJS Observables (Epics). Actions in → actions out. Better for complex event streams, WebSockets, debounce/throttle chains.

---

**Q12. How do you handle errors in a thunk?**

**A:**
```js
export const fetchData = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await api.get("/data");
    dispatch(setData(data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
```

---

### 4.3 Redux Toolkit (RTK)

---

**Q13. What problems does Redux Toolkit solve?**

**A:**
- Eliminates boilerplate (no manual action types/creators).
- Enables "mutating" syntax in reducers via Immer (produces new state safely).
- Ships with `createSlice`, `createAsyncThunk`, `configureStore` with sensible defaults.
- Includes `redux-thunk` and Redux DevTools Extension by default.

---

**Q14. What is `createSlice`?**

**A:** Generates action types, action creators, and a reducer in one call.

```js
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; }, // Immer allows this
    incrementBy: (state, action) => { state.value += action.payload; },
  },
});
export const { increment, incrementBy } = counterSlice.actions;
export default counterSlice.reducer;
```

---

**Q15. Can you mutate state in RTK reducers? Why?**

**A:** Yes, because RTK uses **Immer** under the hood. Immer wraps the state in a Proxy, records mutations, and produces a new immutable state. You must either mutate the draft OR return a new value — not both.

---

**Q16. What is `createAsyncThunk`?**

**A:** Generates a thunk + three action types (`pending`, `fulfilled`, `rejected`). Handle them with `extraReducers`.

```js
export const fetchUser = createAsyncThunk("user/fetch", async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});

// In slice:
builder.addCase(fetchUser.fulfilled, (state, action) => {
  state.user = action.payload;
});
```

---

**Q17. What is `extraReducers` in `createSlice`?**

**A:** Handles actions from outside the slice (e.g., from `createAsyncThunk` or other slices). Uses the `builder` callback API for type safety.

---

**Q18. What is `createEntityAdapter`?**

**A:** Provides normalized state management utilities: `addOne`, `upsertMany`, `removeOne`, `selectAll`, `selectById`, etc. Keeps entities in a `{ ids: [], entities: {} }` shape for O(1) lookups.

---

### 4.4 RTK Query

---

**Q19. What is RTK Query?**

**A:** A powerful data fetching and caching layer built into RTK. Eliminates manual loading/error/data state management. Auto-generates hooks.

```js
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (build) => ({
    getUser: build.query({ query: (id) => `/users/${id}` }),
    createUser: build.mutation({ query: (body) => ({ url: "/users", method: "POST", body }) }),
  }),
});
export const { useGetUserQuery, useCreateUserMutation } = api;
```

---

**Q20. How does RTK Query handle caching?**

**A:** Each endpoint + arg combination is a cache entry with a configurable `keepUnusedDataFor` TTL. Multiple components subscribing to the same query share one request. When all subscribers unmount, the cache entry starts its TTL countdown before removal.

---

**Q21. What is a `providesTags` / `invalidatesTags` pattern?**

**A:** Declarative cache invalidation. A query `providesTags: ["User"]`; a mutation `invalidatesTags: ["User"]` triggers a refetch of all queries providing that tag.

---

**Q22. What is the difference between `useQuery` and `useLazyQuery` in RTK Query?**

**A:**
- `useQuery` — fetches immediately on mount.
- `useLazyQuery` — returns a trigger function; fetch happens only when called explicitly (e.g., on button click or search).

---

### 4.5 Performance & Patterns

---

**Q23. What is the Reselect library and what problem does it solve?**

**A:** Provides `createSelector` for memoized selectors. Derived data is recomputed only when inputs change — prevents unnecessary re-renders caused by computing new object references on every `useSelector` call.

```js
const selectTotal = createSelector(
  state => state.items,
  items => items.reduce((sum, i) => sum + i.price, 0)
);
```

---

**Q24. What is the `shallowEqual` option in `useSelector`?**

**A:** By default `useSelector` uses `===`. If your selector returns a new object/array each time, pass `shallowEqual` (from `react-redux`) as the equality function to avoid spurious re-renders.

```js
const { a, b } = useSelector(state => ({ a: state.a, b: state.b }), shallowEqual);
```

---

**Q25. How do you normalize state in Redux?**

**A:** Store entities as a lookup by ID instead of an array:
```js
// Instead of: [{ id: 1, name: "A" }, ...]
// Store as:
{ ids: [1, 2], entities: { 1: { id: 1, name: "A" }, 2: {...} } }
```
Use `createEntityAdapter` from RTK for built-in helpers.

---

**Q26. What is the "ducks" pattern?**

**A:** Co-locating action types, action creators, and the reducer for a feature in a single file. RTK's `createSlice` is effectively the modern, enforced version of ducks.

---

**Q27. When should you NOT use Redux?**

**A:**
- Local UI state (open/closed modal, form input) — use `useState`.
- Server data you fetch and cache — use RTK Query, React Query, or SWR.
- Global state with simple structure — Zustand or Jotai may be simpler.

Use Redux when: large teams, complex state logic, need time-travel debugging, or sharing state across distant parts of the tree.

---

*End of document.*
