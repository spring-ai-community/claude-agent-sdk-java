import { P as r } from "./copilot-BLh5wx96.js";
function i(e) {
  e.querySelectorAll(
    "vaadin-context-menu, vaadin-menu-bar, vaadin-menu-bar-submenu, vaadin-select, vaadin-combo-box, vaadin-tooltip, vaadin-dialog, vaadin-multi-select-combo-box, vaadin-popover"
  ).forEach((a) => {
    a?.$?.comboBox && (a = a.$.comboBox);
    let n = a.shadowRoot?.querySelector(
      `${a.localName}-overlay, ${a.localName}-submenu, vaadin-menu-bar-overlay`
    );
    n?.localName === "vaadin-menu-bar-submenu" && (n = n.shadowRoot.querySelector("vaadin-menu-bar-overlay")), n ? n._attachOverlay = o.bind(n) : a.$?.overlay && (a.$.overlay._attachOverlay = o.bind(a.$.overlay));
  });
}
function t() {
  return document.querySelector(`${r}main`).shadowRoot;
}
const l = () => Array.from(t().children).filter((a) => a._hasOverlayStackMixin && !a.hasAttribute("closing")).sort((a, n) => a.__zIndex - n.__zIndex || 0), c = (e) => e === l().pop();
function o() {
  const e = this;
  e._placeholder = document.createComment("vaadin-overlay-placeholder"), e.parentNode.insertBefore(e._placeholder, e), t().appendChild(e), e.hasOwnProperty("_last") || Object.defineProperty(e, "_last", {
    // Only returns odd die sides
    get() {
      return c(this);
    }
  }), e.bringToFront(), requestAnimationFrame(() => i(e));
}
export {
  i as m
};
