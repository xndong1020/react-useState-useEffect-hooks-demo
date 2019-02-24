The motivation of adding react hooks can be found on this article [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html#motivation)

To sum up, the reasons are:
## 1. It’s hard to reuse stateful logic between components. 
You can use props render or hoc to achieve some levels of stateful code sharing, but the code becomes hard to understand/test if you nested several hoc/props-render together(aka “wrapper hell” of components surrounded by layers of providers, consumers, higher-order components, render props, and other abstractions.);
## 2. Complex components become hard to understand
Mutually related code that changes together gets split into different lifecycle methods, but completely unrelated code ends up combined in a single method. This makes it too easy to introduce bugs and inconsistencies.
## 3. Classes can be confusing and could easily be used incorrectly

## A quick look of React Hook syntax:
# useState()
useState() is a so-called Hook, The way it works is like this:
1. You pass in your initial state ([]). The initial state can have initial value, for example 
```
const [products, setProducts] = useState([])
const [user, setUser] = useState({ name: 'Jeremy', age: 18 })
```

Initial state can be object or array.
2. It returns an array with exactly 2 elements, which contains your current state and a state-setting function, and you can use array-destructuring to get them. (for example, [cart, setCart] => your current state and a state-setting function)
You access the state with the first element and set it with the second element (which is a function)

Each state will be independent of the other states and updating one state will therefore have no impact on the others.

# useEffect()
This Hook should be used for any side-effects you’re executing in your render cycle.

```
const Shop = props => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('my-backend.com/products')
      .then(res => res.json())
      .then(fetchedProducts => setProducts(fetchedProducts))
  })

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

useEffect() takes a function as an input and returns nothing. The function it takes will be executed for you **`after the render cycle, and after every render cycle`**.

Therefore, this code has some problems, eg:
1. The function inside of useEffect() gets executed unnecessarily (i.e. whenever the component re-renders)
2. **We have an infinite loop because setProducts() causes the function to re-render, and after every render cycle,  useEffect() will be executed again!**

Thankfully, useEffect() has a solution! It takes a second argument which allows us to control when the function that was passed in as the first argument will be executed.

```
useEffect(() => {
  fetch('my-backend.com/products')
    .then(res => res.json())
    .then(fetchedProducts => setProducts(fetchedProducts))
}, [])
```

This code will be executed when the component is rendered for the first time. Effectively, it now behaves like `componentDidMount`.

below code another use case. when `selectedId` changes, the useEffect() gets called again
```
useEffect(() => {
  fetch('my-backend.com/products/' + selectedId)
    .then(res => res.json())
    .then(fetchedProducts => setProducts(fetchedProducts))
}, [selectedId])
```
**This second argument (which always has to be an array) actually is simply a list of dependencies of your  useEffect() function.**

We are essentially telling React:

“Hey React, here’s an array of all dependencies of this function: The selectedId. When that changes, you should run the function again. Ignore any other changes to any other variable or constant.”

if the array is empty, then it means
“Hey React, here’s an array of all dependencies of this function - I got none. So please re-execute whenever any of these dependencies change. Since I have none, they can never change, so please `never execute the function again`”.

Now we can replicate componentDidMount and componentDidUpdate - the two most important lifecycle methods we used in class-based components.

componentDidMount
```
useEffect(() => { ... }, [])
```
componentDidUpdate
Limit execution to the change of certain dependencies (comparable to manual diffing/ if checks in  componentDidUpdate):
```
useEffect(() => { ... }, [dependency1, dependency2])
```
Alternatively, you run your effect on every re-render cycle:
```
useEffect(() => { ... })
```

Implementing constructor code into a functional component is easy.
If it should only execute once (when the component is created), use useEffect() like this:
```
const Shop = props => {
    useEffect(() => {
        // Initialization work
    }, [])
    return ...
}
```
So you’re basically using componentDidMount here - which often is the better place for initialization work anyways.

## Building your own Hooks
React Hooks also give you one additional powerful tool: You can write your own hooks and share them across components. The best thing is, that these custom Hooks can be stateful - i.e. you can use other Hooks (like  useState()) in them.

Here’s an example for a custom Hook that sends an Http request and returns the result as well as the loading state.
```
import { useState, useEffect } from 'react'

export const useHttp = (url, dependencies) => {
  const [isLoading, setIsLoading] = useState(false)
  const [fetchedData, setFetchedData] = useState(null)

  //   fetch('https://swapi.co/api/people')
  useEffect(() => {
    setIsLoading(true)
    console.log('Sending Http request to URL: ' + url)
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch.')
        }
        return response.json()
      })
      .then(data => {
        setIsLoading(false)
        setFetchedData(data)
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
      })
  }, dependencies)

  return [isLoading, fetchedData]
}
```

This allows us to use the Hook like this in functional components:
```
const MyComponent = props => {
  // second argument is empty, meaning only execute once
  const [isLoading, fetchedData] = useHttp('https://swapi.co/api/people', []);

  return isLoading ? <p>Loading...</p> : <DataOutput data={fetchedData} />;
}
```

What’s the advantage of building your own Hooks?

You can share and re-use code much easier than you could before! The code shared in this example includes a lifecycle method (or: something that would’ve been handled in a lifecycle method in the past) and some internally managed state. And yet, it can be used in any functional component you want.

Please also note that your custom Hooks can take arguments but they don’t have to. They also don’t have to return something but they can. Just as the built-in Hooks. You got full flexibility.


## The “Rules of Hooks”
The important rule is:  **`Only call Hooks at the top-level of your functional component!.`**

1. You can put hooks only at code top level, you can’t put it inside of another hook, if-else block or for-loop block.
2. inside your custom hook, you can use other hooks like useState, useEffect
3. when using useEffect, always give dependencies, otherwise it will re-render unnecessarily, or infinite-loop!!

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


