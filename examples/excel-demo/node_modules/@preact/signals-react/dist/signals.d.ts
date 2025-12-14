import { signal, computed, batch, effect, Signal, type ReadonlySignal, untracked } from "@preact/signals-core";
import type { ReactElement } from "react";
import { useSignal, useComputed, useSignalEffect } from "@preact/signals-react/runtime";
export { signal, computed, batch, effect, Signal, type ReadonlySignal, useSignal, useComputed, useSignalEffect, untracked, };
declare module "@preact/signals-core" {
    interface Signal extends ReactElement {
    }
    interface ReadonlySignal extends ReactElement {
    }
}
