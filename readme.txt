

Complete Recoil State Mangement 


useRecoilState:

This hook is used to read and write the value of an atom.
It returns an array with two elements: the current state and a setter function to update that state.
Example:
const [count, setCount] = useRecoilState(countAtom);


useRecoilValue:

This hook is used to read the value of an atom or a selector without subscribing to changes.
It’s useful when you only want to read the state and don’t need to update it.
Example:
const count = useRecoilValue(countAtom);

useSetRecoilState:

This hook provides a setter function for an atom, allowing you to update the atom's value without reading it.
Useful when you want to update state in a callback but don’t need to read the current value.
Example:
const setCount = useSetRecoilState(countAtom)


useRecoilCallback:

This hook allows you to create a callback that can read and write Recoil state without creating a component.
Useful for performing complex state updates or side effects.
Example:
const callback = useRecoilCallback(({ snapshot, set }) => async () => {
    const data = await fetchData();
    set(dataAtom, data);
});


useRecoilValueLoadable:

This hook returns a loadable object that represents the state of an atom or selector, indicating whether it's loading, has an error, or has a value.
Useful for handling asynchronous data.
Example:
const loadable = useRecoilValueLoadable(dataSelector);


Atoms and Selectors:

Atoms: These are units of state. Any component that subscribes to an atom will re-render when that atom's state changes.
Selectors: These are pure functions that derive state from atoms or other selectors. They can compute derived state or perform asynchronous queries.

Example Usage:

import { atom, useRecoilState } from 'recoil';

const countAtom = atom({
  key: 'countState',
  default: 0,
});

function Counter() {
  const [count, setCount] = useRecoilState(countAtom);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}



Selectors :
a selector is a function that can compute derived state or transform the state of one or 
more atoms. Selectors are useful for encapsulating logic and creating reusable pieces of state 
derived from other state values.

A selector acts as a layer that performs additional logic or 
transformations on the data provided by existing atoms.


const ageAtom = atom({
  key: 'ageState',
  default: 0,
});

const isAdultSelector = selector({
  key: 'isAdultState',
  get: ({ get }) => {
    const age = get(ageAtom);
    return age >= 18;
  },
});