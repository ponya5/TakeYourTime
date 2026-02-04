export class ExtensionError extends Error {
    readonly code: string = 'EXTENSION_ERROR';

    constructor(
        message: string,
        public readonly context?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'ExtensionError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON(): { name: string; code: string; message: string; context?: Record<string, unknown> } {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context
        };
    }
}
