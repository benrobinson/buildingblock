;(function() {

  /* =================================================
   *
   * BuildingBlock
   * --------------
   * A tiny class for building DOM elements elegantly.
   *
  ** =============================================== */

  'use strict';

  /*
   * @function BuildingBlock
   * @params {string} type (tag name)
   * @params {object} attr (attributes object)
   * @params {string} text (value for text node)
   * @constructor
  **/
  var BuildingBlock = function(tag, attr, text) {
    this.tag = tag || "div";
    this.attr = attr || {};
    this.text = text || "";
    return this.init();
  }

  /*
   * @method init -- creates element from constructor data
  **/
  BuildingBlock.prototype.init = function() {

    // Element
    this.el = document.createElement(this.tag);

    // Attributes
    var attrName;
    for (var attr in this.attr) {
      if (attr == "class") {
        attrName = "className";
      } else {
        attrName = attr;
      }
      this.el[attrName] = this.attr[attr];
    }

    // Text Node
    if (this.text.trim() != "") {
      var text = document.createTextNode(this.text);
      this.el.appendChild(text);
    }

    return this;
  };

  /*
   * @method element
   * @returns created DOM element
  **/
  BuildingBlock.prototype.element = function() {
    return this.el;
  }

  /*
   * @method child -- appends an element to the current element
   * @params {object} element (DOM element)
  **/
  BuildingBlock.prototype.child = function(element) {
    if (typeof element.appendChild === "function") {
      this.el.appendChild(element); 
    } else {
      this.el.appendChild(element.el);
    }
    return this;
  }

  /*
   * @method parent -- sets the specified element as a parent for the current element
   * @params {object} element (DOM element)
  **/
  BuildingBlock.prototype.parent = function(element) {
    if (typeof element.appendChild === "function") {
      element.appendChild(this.el);
    } else {
      element.el.appendChild(this.el);
    }
    return this;
  }
  // Alias method attachTo
  BuildingBlock.prototype.attachTo = BuildingBlock.prototype.parent;

  /*
   * @method childrenFromJSON -- uses a JSON object to append children to this element
   * @params {string, object}
  **/
  BuildingBlock.prototype.childrenFromJSON = function(json, parent) {
    
    // Parse from JSON, or use a ready object
    if ( typeof json === "string" ) {
      var json = JSON.parse(json);
    } else {
      var json = json;
    }
    
    // If this object opens as an array, add each as a child
    if ( Object.prototype.toString.call(json) == "[object Array]" ) {
      var item, element;
      for ( var i = 0; i < json.length; ++i ) {
        item = json[i];
        element = new BuildingBlock(item.tag, item.attr, item.text);
        if ( parent !== undefined ) {
          element.parent(parent);
        } else {
          element.parent(this);
        }
        // Recursively add additional children of this array item
        if ( item.children !== undefined ) {
          this.childrenFromJSON(item.children, element);
        }
      }
      // If this object opens as an individual object, add it as a child
    } else if ( Object.prototype.toString.call(json) == "[object Object]" ) {
      var element = new BuildingBlock(json.tag, json.attr, json.text);
      if ( parent !== undefined ) {
        element.parent(parent);
      } else {
        element.parent(this);
      }
      // Recursively add additional children of this object
      if ( json.children !== undefined ) {
        this.childrenFromJSON(json.children, element);
      }
    } else {
      console.error("BuildingBlocks cannot be built! Invalid JSON.");
    }
  }
  
  /*
   * TODO methods: 
   * - jsonFromElements, to decompose DOM elements into JSON that can be re-used as children elsewhere.
   * - addStyles, to push styles to a master BuildingBlock stylesheet.
  **/
  
  window.BuildingBlock = window.BuildingBlock || BuildingBlock;
  
})();
