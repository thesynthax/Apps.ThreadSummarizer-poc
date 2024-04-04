import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { QuickSummary } from './slashcommands/QuickSummary';

export class AppsThreadSummarizerPoCApp extends App {
    private readonly appLogger: ILogger;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        this.appLogger = this.getLogger();
    }

    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        configuration.slashCommands.provideSlashCommand(new QuickSummary());
    }
}

