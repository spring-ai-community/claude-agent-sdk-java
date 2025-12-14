/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const c = (r, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(r, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(r, t) {
  return (e, o, l) => {
    const n = (u) => u.renderRoot?.querySelector(r) ?? null;
    return c(e, o, { get() {
      return n(this);
    } });
  };
}
export {
  f as e
};
