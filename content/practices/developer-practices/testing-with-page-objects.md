---
dev_practice: true
title: "Front End Component Testing with Page Objects"
lastmod: 2021-02-24T16:38:10-05:00
draft: false
tags: ["Delivery", "Developer", "Testing", "Front End"]
description: "Frontend component testing with page objects"
image: "default-cover-dev.jpg"
length: "As needed"
---
Brought to Labs By: [Dmitriy Dubson](https://www.linkedin.com/in/ddubson1/)

Written By: [Dmitriy Dubson](https://www.linkedin.com/in/ddubson1/) & [Erica Dohring](https://www.linkedin.com/in/erica-dohring-11ba0937/)

## Problems This Solves

> Difficult to Read tests cluttered with framework details

When writing tests for front end components, the task often comes with a slew of initial set up tasks and internal component querying that might make your tests less and less readable as time goes by. The complexity of the code only increases as more and more functionality is added to a component or a tree of components. Too much framework implementation details (mounting, rendering, lifecycle methods, etc.) are presented to the developer, leading to higher and higher cognitive load to understanding what is actually being asserted on.

One of the main goals in writing tests is to consistently strive for **test readability**. By writing tests that are clear and expressive to you and your teammates, you are allowing yourself the opportunity to quickly and easily interpret the system that is implemented and easily add functionality by adding new test cases where they fit.

## Solution

Say you are writing a recipe app (how meta!). You might have a test that looks like this ...

### Before

```typescript
// This example uses React with Jest and @testing-library/react
test("recipe is added when user fills out form and clicks 'Add Recipe'", async () => {
  const goToSceneSpy = jest.fn()
  const saveRecipeSpy = jest.fn().mockResolvedValue({});
  const renderResult = render(
    buildComponent(<AddRecipeScene goToScene={goToSceneSpy} saveRecipe={saveRecipeSpy} />))
    
  fireEvent.change(renderResult.getByLabelText("Recipe name",
    {selector: "input"}),
    {target: {value: "Garlic Lime Shrimp"}});
        
  fireEvent.click(renderResult.getByLabelText("Add recipe"));
  
  await waitFor(() => {
    expect(saveRecipeSpy).toHaveBeenCalledWith({
      name: "Garlic Lime Shrimp",
      ingredients: [], steps: []
    });
    expect(goToSceneSpy).toHaveBeenCalledWith("/");
  })
});
```

### After

Here is a snippet from Dmitriy's [extended example](https://github.com/ddubson/feast/blob/main/packages/web/src/scenes/add-recipe/AddRecipeScene.spec.tsx).

```typescript
// This example uses React with Jest and @testing-library/react
test("recipe is added when user fills out form and clicks 'Add Recipe'", async () => {
  const goToSceneSpy = jest.fn()
  const saveRecipeSpy = jest.fn().mockResolvedValue({});
  const page = AddRecipeScenePage(goToSceneSpy, saveRecipeSpy);

  page.type("Recipe name", "Garlic Lime Shrimp");
  page.clickAddRecipe();
  await waitFor(() => {
    expect(saveRecipeSpy).toHaveBeenCalledWith({
      name: "Garlic Lime Shrimp",
      ingredients: [], steps: []
    });
    expect(goToSceneSpy).toHaveBeenCalledWith("/");
  })
});

const AddRecipeScenePage = (goToSceneSpy: (location: string) => void, saveRecipeSpy: SaveRecipe) => {
  const renderResult = render(
    buildComponent(<AddRecipeScene goToScene={goToSceneSpy} saveRecipe={saveRecipeSpy} />))
  return ({
    type: (ariaLabel: string, text: string | number) => {
      fireEvent.change(renderResult.getByLabelText(ariaLabel,
        {selector: "input"}),
        {target: {value: text}});
    },
    clickAddRecipe: () => {
      fireEvent.click(renderResult.getByLabelText("Add recipe"));
    }
  });
};
```

### Notice
- How much easier that after test is to read. It takes you out of framework land and allows you to think more like the user. We think it reads more behaviorally like a [Cypress](https://www.cypress.io/)-style test than a React Testing Library one.
- How all framework specific logic goes inside the `AddRecipeScenePage` function. If you swapped this out for a different framework (say, [Vue](https://vuejs.org/)) only this section and underlying helper functions would change. This makes our code more [Open-closed](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle) to the rapidly changing frontend world. Caveat: this isn't perfect. For example await waitFor is React Testing Library specific. It's not perfect, but definitely an improvement.


### Pros
- Make tests more readable and easier to understand
- Quarantine framework details to one spot - abstract away the low-level framework noise
- Allow for developer to be creative in how to query the component under test, leading to test readability, reducing cognitive load.
- Allow building components with a single invocation
- Allow overriding default inputs into the component
- Reduces a component under test to be a "unit" with inputs and outputs that can be observed, even though the machinery is complex.

### Cons
- Keep cohesion and coupling in mind. As you implement this pattern in your codebase, you may end up differnt naming for the same concepts across different components. For example, you might have `page.fillInTextField("hi")` and `page.fillInTextBox("hello")` in 2 seperate test files, when you may want to make a unified spot from both to draw from.

## Further reading

- [PageObject - Martin Fowler](https://martinfowler.com/bliki/PageObject.html)
- [Test Precisely and Concretely - Kevlin Henney](https://medium.com/analytics-vidhya/test-precisely-and-concretely-810a83f6309a)