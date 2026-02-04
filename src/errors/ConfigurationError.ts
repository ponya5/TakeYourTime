import { ExtensionError } from './ExtensionError';

export class ConfigurationError extends ExtensionError {
    readonly code: string = 'CONFIGURATION_ERROR';

    constructor(message: string, context?: Record<string, unknown>) {
        super(message, context);
        this.name = 'ConfigurationError';
    }
}
