# BuildingBlock

A tiny class for building DOM elements.

## Why?

I've been working on small embeddable components that need to be self contained, dependency-free (no large libraries or frameworks) and easy to install. I wanted a slightly more elegant, yet unobtrusive way to construct DOM elements in JavaScript.  

This is really just a tiny syntactical wrapper for the native DOM API.  It's also a work in progress!

## Creating a Block

```javascript
new BuildingBlock(tag, attr, text);
```

In other words, this native code:

```javascript
var block = document.createElement("div");
block.className = "block";
var text = document.createTextNode("This is a block");
block.appendChild(text);
```
    
Becomes this:

```javascript
var block = new BuildingBlock("div", {class: "block"}, "This is a block");
```

## Attaching to parent elements or the page

To append it to another element on the page (either a `DOMElement` or `BuildingBlock`), use the `.parent(element)` method:

Appending a block to the body:

```javascript
block.parent(document.body);
```

Appending a block as a child to an existing block:

```javascript
var child = new BuildingBlock("div", {class: "child"}, "This is a child block");
child.parent(block);
```

## Adding individual children

To add individual children, use the `.child(element)` method:

```javascript
var child = new BuildingBlock("div", {class: "child"}, "This is a child block");
block.child(child);
```

You can string creation of children together like this:

```javascript
var block = new BuildingBlock("div", {class: "block"}, "This is a block").child( 
              new BuildingBlock("div", {class: "child"}, "This is a child block").child(
                new BuildingBlock("div", {class: "second-level-child"}, "This is a child's child")
              ).child(
                new BuildingBlock("div", {class: "second-level-sibling"}, "This is the child's child's sibling")
              )
            );
```

But that can get messy, so instead, you can use the `.childrenFromJSON(JSON)` method to write your children as objects:

```javascript
var block = new BuildingBlock("div", {class: "block"}, "This is a block");

var children = {
  tag: "div",
  attr: {
    class: "child"
  },
  text: "This is a child block",
  children: [
    {
      tag: "div",
      attr: {
        class: "second-level-child"
      },
      text: "This is a child's child"
    },
    {
      tag: "div",
      attr: {
        class: "second-level-sibling"
      },
      text: "This is the child's child's sibling"
    }
  ]
};

block.childrenFromJSON(children);
```

## Functionality through attributes

Since "attr" literally refers to native element attributes, you can populate each element's native event listeners to set up simple functionality:

```javascript
var button = new BuildingBlock("button",{
                onclick: function(e) {
                  e.preventDefault();
                  alert("The Button was Clicked.");
                }
              }, "Click Me");
```
