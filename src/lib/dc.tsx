// @ts-nocheck
/**
 * Tiny runtime that lets each page keep the structure it had in Claude Design:
 *
 *   class Component extends DCLogic {        // state + handlers (a normal React class component)
 *     renderVals() { return { ... } }        // every value the markup needs
 *   }
 *   defineTemplate(Component, (v) => <JSX/>) // markup reads values as v.something
 */
import React from 'react';

export class DCLogic extends React.Component<any, any> {
  renderVals(): Record<string, any> {
    return {};
  }
  render() {
    const tpl = (this as any).__template;
    return tpl ? tpl(this.renderVals() || {}) : null;
  }
}

export function defineTemplate(C: any, template: (v: any) => React.ReactNode) {
  C.prototype.__template = template;
}

/** Stringify a value for use inside text/attributes (null/undefined → ''). */
export const s = (x: unknown) => (x == null ? '' : String(x));
