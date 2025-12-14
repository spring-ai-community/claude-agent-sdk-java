import { as as u, at as l } from "./copilot-BLh5wx96.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const p = { attribute: !0, type: String, converter: l, reflect: !1, hasChanged: u }, d = (t = p, n, e) => {
  const { kind: o, metadata: i } = e;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), o === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(e.name, t), o === "accessor") {
    const { name: a } = e;
    return { set(s) {
      const c = n.get.call(this);
      n.set.call(this, s), this.requestUpdate(a, c, t);
    }, init(s) {
      return s !== void 0 && this.C(a, void 0, t, s), s;
    } };
  }
  if (o === "setter") {
    const { name: a } = e;
    return function(s) {
      const c = this[a];
      n.call(this, s), this.requestUpdate(a, c, t);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function h(t) {
  return (n, e) => typeof e == "object" ? d(t, n, e) : ((o, i, r) => {
    const a = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, o), a ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(t, n, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(t) {
  return h({ ...t, state: !0, attribute: !1 });
}
export {
  h as n,
  b as r
};
