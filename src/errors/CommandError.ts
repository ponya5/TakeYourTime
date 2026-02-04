import { ExtensionError } from './ExtensionError';

export class CommandError extends ExtensionError {
    readonly code: string = 'COMMAND_ERROR';

    constructor(
        message: string,
        public readonly commandId: string,
        context?: Record<string, unknown>
    ) {
        super(message, { ...context, commandId });
        this.name = 'CommandError';
    }
}
