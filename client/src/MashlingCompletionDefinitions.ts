import { CompletionItemKind, CompletionItem } from 'vscode';
import * as vscode from 'vscode';

export const suggestionsObject:CompletionItem[] = [
	{
		label: 'gateway',
		kind: CompletionItemKind.Property,
		detail: "0gateway",
		insertText: 'gateway:\n  ',
		documentation: 'Gateway Object',
		filterText: 'gateway'
	},
	{
		label: 'name',
		kind: CompletionItemKind.Property,
		detail: "name",
		insertText: 'name: microgateway\n',
		documentation: 'name of the gateway',
		filterText: '1',
		sortText: '1'
	},
	{
		label: 'version',
		kind: CompletionItemKind.Property,
		detail: "version",
		insertText: 'version: 0.0.1\n',
		documentation: 'version number',
		filterText: '1',
		sortText: '2'
	},
	{
		label: 'description',
		kind: CompletionItemKind.Property,
		detail: "description",
		insertText: 'description: gateway description\n',
		documentation: 'description of the gateway',
		filterText: '1',
		sortText: '3'
	},
	{
		label: 'configurations',
		kind: CompletionItemKind.Property,
		detail: "1configurations",
		insertText: 'configurations: \n- ',
		documentation: 'configurations',
		filterText: '1',
		sortText: '4'
	},
	{
		label: 'name',
		kind: CompletionItemKind.Property,
		detail: "configuration name",
		insertText: 'name: kafkaConfig',
		documentation: 'configuration name',
		filterText: 'configurations',
		sortText: '1'
	},
	{
		label: 'type',
		kind: CompletionItemKind.Property,
		detail: "configuration type",
		insertText: 'type: github.com/TIBCOSoftware/flogo-contrib/config/kafkaConfig',
		documentation: 'configuration type',
		filterText: 'configurations',
		sortText: '3'
	},
	{
		label: 'description',
		kind: CompletionItemKind.Property,
		detail: "configuration description",
		insertText: 'description: Configuration for kafka cluster',
		documentation: 'configuration description',
		filterText: 'configurations',
		sortText: '2'
	},
	{
		label: 'settings',
		kind: CompletionItemKind.Property,
		detail: "configuration settings",
		insertText: 'settings:\n  ',
		documentation: 'configuration description',
		filterText: 'configurations',
		sortText: '4'
	},
	{
		label: 'BrokerUrl',
		kind: CompletionItemKind.Property,
		detail: "configuration settings BrokerUrl",
		insertText: 'BrokerUrl: localhost:9092\n',
		documentation: 'configuration settings BrokerUrl',
		filterText: 'configurations settings',
		sortText: '1'
	},
	{
		label: 'username',
		kind: CompletionItemKind.Property,
		detail: "configuration settings username",
		insertText: 'username: xyz',
		documentation: 'configuration settings username',
		filterText: 'configurations settings',
		sortText: '2'
	},
	{
		label: 'password',
		kind: CompletionItemKind.Property,
		detail: "configuration settings password",
		insertText: 'password: abc',
		documentation: 'configuration settings password',
		filterText: 'configurations settings',
		sortText: '3'
	},
	{
		label: 'triggers',
		kind: CompletionItemKind.Property,
		detail: "triggers",
		insertText: 'triggers: \n- ',
		documentation: 'triggers',
		filterText: '1',
		sortText: '5'
	},
	{
		label: 'name',
		kind: CompletionItemKind.Property,
		detail: "triggers",
		insertText: 'name: OrdersTrigger',
		documentation: 'name of the trigger',
		filterText: 'triggers',
		sortText: '1'
	},
	{
		label: 'description',
		kind: CompletionItemKind.Property,
		detail: "description",
		insertText: 'description: The trigger on \'orders\' topic',
		documentation: 'description of the trigger',
		filterText: 'triggers',
		sortText: '2'
	},
	{
		label: 'type',
		kind: CompletionItemKind.Property,
		detail: "type",
		insertText: 'type: github.com/TIBCOSoftware/flogo-contrib/trigger/kafkaConsumer',
		documentation: 'type of the trigger',
		filterText: 'triggers',
		sortText: '3'
	},
	{
		label: 'settings',
		kind: CompletionItemKind.Property,
		detail: "settings",
		insertText: 'settings: \n  ',
		documentation: 'settings of the trigger',
		filterText: 'triggers',
		sortText: '4'
	},
	{
		label: 'event_links',
		kind: CompletionItemKind.Property,
		detail: "event_links",
		insertText: 'event_links: \n- ',
		documentation: 'event_links',
		filterText: '1',
		sortText: '6'
	},
	{
		label: 'triggers',
		kind: CompletionItemKind.Property,
		detail: "event_links triggers",
		insertText: 'triggers: OrdersTrigger',
		documentation: 'event_links triggers',
		filterText: 'event_links',
		sortText: '1'
	},
	{
		label: 'if',
		kind: CompletionItemKind.Property,
		detail: "dispatches if condition",
		insertText: 'if: ${condition}',
		documentation: 'dispatches if condition',
		filterText: 'event_links dispatches',
		sortText: '1'
	},
	{
		label: 'dispatches',
		kind: CompletionItemKind.Property,
		detail: "event_links dispatches",
		insertText: 'dispatches: \n  ',
		documentation: 'event_links dispatches',
		filterText: 'event_links',
		sortText: '2'
	},
	{
		label: 'handler',
		kind: CompletionItemKind.Property,
		detail: "dispatches handler",
		insertText: 'handler: successHandler',
		documentation: 'dispatches handler',
		filterText: 'event_links dispatches',
		sortText: '2'
	},
	{
		label: 'event_handlers',
		kind: CompletionItemKind.Property,
		detail: "event_handlers",
		insertText: 'event_handlers: \n- ',
		documentation: 'event_handlers',
		filterText: '1',
		sortText: '7'
	},
	{
		label: 'name',
		kind: CompletionItemKind.Property,
		detail: "name",
		insertText: 'name: OrderSuccessHandler',
		documentation: 'name',
		filterText: 'event_handlers',
		sortText: '1'
	},
	{
		label: 'params',
		kind: CompletionItemKind.Property,
		detail: "params",
		insertText: 'params:\n  ',
		documentation: 'Event Handlers params',
		filterText: 'event_handlers',
		sortText: '4'
	},
	{
		label: 'uri',
		kind: CompletionItemKind.Property,
		detail: "Event Handlers params uri",
		insertText: 'uri: Event Handlers params uri',
		documentation: 'Event Handlers params uri',
		filterText: 'event_handlers params'
	},
	{
		label: 'description',
		kind: CompletionItemKind.Property,
		detail: "description",
		insertText: 'description: Handle the order processing\n',
		documentation: 'Event Handlers description',
		filterText: 'event_handlers',
		sortText: '2'
	},
	{
		label: 'reference',
		kind: CompletionItemKind.Property,
		detail: "Event Handlers reference",
		insertText: 'reference: github.com/TIBCOSoftware/mashling/flows/OrdersSuccessHandler/flow.json\n',
		documentation: 'Event Handlers reference',
		filterText: 'event_handlers',
		sortText: '3'
	}
];