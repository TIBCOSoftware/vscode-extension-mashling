import { CompletionItemKind, CompletionItem } from 'vscode';

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
		filterText: '1'
	},
	{
		label: 'version',
		kind: CompletionItemKind.Property,
		detail: "version",
		insertText: 'version: 0.0.1\n',
		documentation: 'version number',
		filterText: '1'
	},
	{
		label: 'description',
		kind: CompletionItemKind.Property,
		detail: "description",
		insertText: 'description: gateway description\n',
		documentation: 'description of the gateway',
		filterText: '1'
	},
	{
		label: 'configurations',
		kind: CompletionItemKind.Property,
		detail: "1configurations",
		insertText: 'configurations: \n- name: kafkaConfig\n  type: github.com/TIBCOSoftware/flogo-contrib/config/kafkaConfig\n  description: Configuration for kafka cluster\n  settings:\n  brokers:\n  - localhost:9092\n  - localhost:9093\n  userName: admin\n  password: admin',
		documentation: 'configurations',
		filterText: '1'
	},
	{
		label: 'name',
		kind: CompletionItemKind.Property,
		detail: "configuration name",
		insertText: 'name: kafkaConfig\n',
		documentation: 'configuration name',
		filterText: 'configurations'
	},
	{
		label: 'type',
		kind: CompletionItemKind.Property,
		detail: "configuration type",
		insertText: 'type: github.com/TIBCOSoftware/flogo-contrib/config/kafkaConfig\n',
		documentation: 'configuration type',
		filterText: 'configurations'
	},
	{
		label: 'description',
		kind: CompletionItemKind.Property,
		detail: "configuration description",
		insertText: 'description: Configuration for kafka cluster\n',
		documentation: 'configuration description',
		filterText: 'configurations'
	},
	{
		label: 'settings',
		kind: CompletionItemKind.Property,
		detail: "configuration settings",
		insertText: 'settings:\n  ',
		documentation: 'configuration description',
		filterText: 'configurations'
	},
	{
		label: 'BrokerUrl',
		kind: CompletionItemKind.Property,
		detail: "configuration settings BrokerUrl",
		insertText: 'BrokerUrl:localhost:9092\n  ',
		documentation: 'configuration settings BrokerUrl',
		filterText: 'configurations>settings'
	},
	{
		label: 'username',
		kind: CompletionItemKind.Property,
		detail: "configuration settings username",
		insertText: 'username:\n  ',
		documentation: 'configuration settings username',
		filterText: 'configurations>settings'
	},
	{
		label: 'password',
		kind: CompletionItemKind.Property,
		detail: "configuration settings password",
		insertText: 'password:\n  ',
		documentation: 'configuration settings password',
		filterText: 'configurations>settings'
	},
	{
		label: 'triggers',
		kind: CompletionItemKind.Property,
		detail: "triggers",
		insertText: 'triggers: \n- ',
		documentation: 'triggers',
		filterText: '1'
	},
	{
		label: 'name',
		kind: CompletionItemKind.Property,
		detail: "2triggers",
		insertText: 'name: OrdersTrigger\n',
		documentation: 'name of the trigger',
		filterText: 'triggers'
	},
	{
		label: 'type',
		kind: CompletionItemKind.Property,
		detail: "type",
		insertText: 'type: github.com/TIBCOSoftware/flogo-contrib/trigger/kafkaConsumer\n',
		documentation: 'type of the trigger',
		filterText: 'triggers'
	},
	{
		label: 'description',
		kind: CompletionItemKind.Property,
		detail: "description",
		insertText: 'description: The trigger on \'orders\' topic\n',
		documentation: 'description of the trigger',
		filterText: 'triggers'
	},
	{
		label: 'settings',
		kind: CompletionItemKind.Property,
		detail: "settings",
		insertText: 'settings: \n  topic: orders\n  config: ""',
		documentation: 'settings of the trigger',
		filterText: 'triggers'
	},
	{
		label: 'event_links',
		kind: CompletionItemKind.Property,
		detail: "event_links",
		insertText: 'event_links: \n- ',
		documentation: 'event_links',
		filterText: '1'
	},
	{
		label: 'triggers',
		kind: CompletionItemKind.Property,
		detail: "event_links triggers",
		insertText: 'triggers: OrdersTrigger\n',
		documentation: 'event_links triggers',
		filterText: 'event_links'
	},
	{
		label: 'dispatches',
		kind: CompletionItemKind.Property,
		detail: "event_links dispatches",
		insertText: 'dispatches:\n- ',
		documentation: 'event_links dispatches',
		filterText: 'event_links'
	},
	{
		label: 'if',
		kind: CompletionItemKind.Property,
		detail: "dispatches if condition",
		insertText: 'if:\n ',
		documentation: 'dispatches if condition',
		filterText: 'event_links>dispatches'
	},
	{
		label: 'handler',
		kind: CompletionItemKind.Property,
		detail: "dispatches handler",
		insertText: 'handler:\n ',
		documentation: 'dispatches handler',
		filterText: 'event_links>dispatches'
	},
	{
		label: 'event_handlers',
		kind: CompletionItemKind.Property,
		detail: "event_handlers",
		insertText: 'event_handlers: \n- ',
		documentation: 'event_handlers',
		filterText: '1'
	},
	{
		label: 'name',
		kind: CompletionItemKind.Property,
		detail: "name",
		insertText: 'name: OrderSuccessHandler\n',
		documentation: 'name',
		filterText: 'event_handlers'
	},
	{
		label: 'params',
		kind: CompletionItemKind.Property,
		detail: "params",
		insertText: 'params:\n  ',
		documentation: 'Event Handlers params',
		filterText: 'event_handlers'
	},
	{
		label: 'description',
		kind: CompletionItemKind.Property,
		detail: "description",
		insertText: 'description: Handle the order processing\n',
		documentation: 'Event Handlers description',
		filterText: 'event_handlers'
	},
	{
		label: 'reference',
		kind: CompletionItemKind.Property,
		detail: "Event Handlers reference",
		insertText: 'reference: github.com/TIBCOSoftware/mashling/flows/OrdersSuccessHandler/flow.json\n  ',
		documentation: 'Event Handlers reference',
		filterText: 'event_handlers'
	}
];