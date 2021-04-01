---
draft: false
dev_practice: true
title: "Mutation-free Frontend Testing"
lastmod: 2021-02-24T16:43:09-05:00
tags: ["Delivery", "Developer", "Front End", "Testing"]
description: "Ignore the tutorial defaults and have a much better time"
image: "default-cover-dev.jpg"
length: "As needed"
---

_[Ignore the tutorial defaults](https://reactjs.org/docs/testing-recipes.html#setup--teardown) and have a much better time_

Brought to Labs by: VMware alumni [Simon Parker](https://www.linkedin.com/in/simon-parker-33823a25/)

Written By: [Dmitriy Dubson](https://www.linkedin.com/in/ddubson1/) & [Erica Dohring](https://www.linkedin.com/in/erica-dohring-11ba0937/)

## Problem This Solves

> Tests that are hard to read and add to:
> - Test setup far away from the actual test case and assertion
> - Mutated variables, making it unclear what value it is by the time it gets to your test block

A long, deeply nested test suite with globally scoped variables is an easy piece of technical debt to spot. The lead time and cognitive effort to add or edit an existing test case grows ~exponentially relative to the codebase scale.

## Solution

The following is generic pseudo-code demonstrating before and after of a test suite with mutation and mutation-free approaches.

### Before

```typescript
// Using Jest
describe("CheckoutPage", () => {
    let mockState, wrapper;
    
    beforeEach(() => {
        mockState = new State();
        mockState.user = createUserFixture();
        mockState.product = createProductFixture();
        mockState.paymentMethod = {
            type: 'credit',
            number: '1234567890'
        }
        wrapper = mount({ state: mockState });
    });
    

    describe("When the user is paying with a credit card", () => {
        describe("When the user enters an invalid credit card", () => {
            beforeEach(() => {
                mockState.invalidCreditCard = {
                    type: "credit",
                    number: "BOO"
                } 
            });
            
            it("Will throw an error", () => {
                // State has been updated in beforeEach
                wrapper.submit(); 
                wrapper.find("[data-error-tag]").toEqual("'BOO is not a valid credit card number.'")
            })
        });
        
        describe("When the user enters an valid credit card", () => {
            it("will allow the user to checkout", () => {
                // State has set in root beforeEach, this causes readability issues!
                wrapper.submit(); 
                wrapper.find("[data-success]").toBeTruthy();
            });
        });
    });
    
    describe("When the user is paying by debit card", () => {
        beforeEach(() => {
            mockState.paymentMethod = {
                type: "debit",
                number: "987654321"
            }
        });
        
        describe("When the user enters an valid debit card", () => {
            it("will allow the user to checkout", () => {
                // State has been updated in beforeEach
                wrapper.submit();
                wrapper.find("[data-success]").toBeTruthy();
            });
        });
    });
})
```

### After

```typescript
// Using Jest
describe("CheckoutPage", () => {
    const user = createUserFixture();
    const product = createProductFixture();
    
    describe("When the user is paying with a credit card", () => {
        describe("When the user enters an invalid credit card", () => {
            it("Will throw an error", () => {
                const mockState = createStateFixture({
                    paymentMethod: {
                        type: "credit",
                        number: "BOO"
                    }
                });
                const wrapper = mount({ state: mockState});
                wrapper.submit();
                wrapper.find("[data-error-tag]").toEqual("'BOO is not a valid credit card number.'")
            })
        });
        
        describe("When the user enters an valid credit card", () => {
            it("will allow the user to checkout", () => {
                const mockState = createStateFixture({
                    paymentMethod: {
                        type: "credit",
                        number: "1234567890"
                    }
                })
                const wrapper = mount({ state: mockState });
                wrapper.submit();
                wrapper.find("[data-success]").toBeTruthy();
            });
        });
    });
    
    describe("When the user is paying by debit card", () => {
        describe("When the user enters an valid debit card", () => {
            it("will allow the user to checkout", () => {
                const mockState = createStateFixture({
                    paymentMethod: {
                        type: "debit",
                        number: "987654321"
                    }
                })
                const wrapper = mount({ state: mockState});
                
                wrapper.submit();
                wrapper.find("[data-success]").toBeTruthy();
            });
        });
    });
})
```

Notice how the `After` is *much* easier to read and reason about. The `Before` good credit card example wasn't clear that the setup for the `paymentMethod` was happening in the top level `beforeEach`. Now all the test setup is right inside the `it` relevant block - no scrolling!

#### Bonus Option: Flatten Your Tests

**Pros:**
 
Super easy to add a new test (you don't have to wonder which describe block to fit into)

**Cons:**

Your test names can get quite long:

```typescript
// Using Jest
describe("CheckoutPage", () => {
    const user = createUserFixture();
    const product = createProductFixture();

    it("Throws an error when the user tries to pay with an invalid credit card", ()=> {
        const mockState = createStateFixture({
            paymentMethod: {
                type: "credit",
                number: "BOO"
            } 
        })
        const wrapper = mount({state: mockState});
        wrapper.submit();
        wrapper.find("[data-error-tag]").toEqual("'BOO is not a valid credit card number.'");
    });

    it("Allows the user to check out with a valid credit card", ()=> {
        const mockState = createStateFixture({
            paymentMethod: {
                type: "credit",
                number: "1234567890"
            } 
        })
        const wrapper = mount({ state: mockState });
        wrapper.submit();
        wrapper.find("[data-success]").toBeTruthy();
    });

    it("Allows the user to check out with a valid debit card", ()=> {
        const mockState = {
            paymentMethod: {
                type: "debit",
                number: "987654321"
            }
        }
        const wrapper = mount({ state: mockState });

        wrapper.submit();
        wrapper.find("[data-success]").toBeTruthy();
    });
});
```

#### Pros

- Each test case is easier to reason about, no longer need to hunt down the path of the test setup up the nested tree of `describe` blocks
- Removal of the [mutation code smell](https://blog.jetbrains.com/idea/2017/08/code-smells-mutation/) - no more `let`s

#### Cons

- There may be some repetition in test setup. You can abstract this (where appropriate) into functions. This recipe pairs nicely with [page functions](/practices/developer-practices/testing/testing-with-page-objects).
- Folks (us included) have felt concerned this would slow down our tests, however, in Vue projects we have not seen any significant latency drag and even see a speed increase at times. 

## Further reading

- [Avoid nesting when you're testing - Kent C. Dodds](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing)
