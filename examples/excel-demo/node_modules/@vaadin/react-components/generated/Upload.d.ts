import type { EventName } from "@lit/react";
import { Upload as UploadElement, type UploadEventMap as _UploadEventMap } from "@vaadin/upload/vaadin-upload.js";
import * as React from "react";
import { type WebComponentProps } from "../utils/createComponent.js";
export * from "@vaadin/upload/vaadin-upload.js";
export { UploadElement, };
export type UploadEventMap = Readonly<{
    onFileReject: EventName<_UploadEventMap["file-reject"]>;
    onUploadAbort: EventName<_UploadEventMap["upload-abort"]>;
    onUploadBefore: EventName<_UploadEventMap["upload-before"]>;
    onUploadError: EventName<_UploadEventMap["upload-error"]>;
    onUploadProgress: EventName<_UploadEventMap["upload-progress"]>;
    onUploadRequest: EventName<_UploadEventMap["upload-request"]>;
    onUploadResponse: EventName<_UploadEventMap["upload-response"]>;
    onUploadRetry: EventName<_UploadEventMap["upload-retry"]>;
    onUploadStart: EventName<_UploadEventMap["upload-start"]>;
    onUploadSuccess: EventName<_UploadEventMap["upload-success"]>;
    onFilesChanged: EventName<_UploadEventMap["files-changed"]>;
    onMaxFilesReachedChanged: EventName<_UploadEventMap["max-files-reached-changed"]>;
}>;
export type UploadProps = WebComponentProps<UploadElement, UploadEventMap>;
export declare const Upload: (props: Partial<import("../utils/createComponent.js").ThemedWebComponentProps<UploadElement, Readonly<{
    onFileReject: EventName<_UploadEventMap["file-reject"]>;
    onUploadAbort: EventName<_UploadEventMap["upload-abort"]>;
    onUploadBefore: EventName<_UploadEventMap["upload-before"]>;
    onUploadError: EventName<_UploadEventMap["upload-error"]>;
    onUploadProgress: EventName<_UploadEventMap["upload-progress"]>;
    onUploadRequest: EventName<_UploadEventMap["upload-request"]>;
    onUploadResponse: EventName<_UploadEventMap["upload-response"]>;
    onUploadRetry: EventName<_UploadEventMap["upload-retry"]>;
    onUploadStart: EventName<_UploadEventMap["upload-start"]>;
    onUploadSuccess: EventName<_UploadEventMap["upload-success"]>;
    onFilesChanged: EventName<_UploadEventMap["files-changed"]>;
    onMaxFilesReachedChanged: EventName<_UploadEventMap["max-files-reached-changed"]>;
}>>> & React.RefAttributes<UploadElement>) => React.ReactElement | null;
//# sourceMappingURL=Upload.d.ts.map