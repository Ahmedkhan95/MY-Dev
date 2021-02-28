var dest = $.net.http.readDestination("WebETL.services", "test");
var client = new $.net.http.Client();
var req = new $.net.http.Request($.net.http.GET, "/module/eadsXmlFeed.html");
client.request(req, dest);
var response = client.getResponse();
var xmlString = response.body.asString();

var parser = new $.util.SAXParser();
var xml = xmlString;
var rootElement;
var characterData = [];
var elementStack = [];

parser.startElementHandler = function(name, attrs) {
	var data = attrs;
	data.name = name;
	if (!rootElement) {
		rootElement = data;
	} else {
		var currentElement = elementStack[elementStack.length - 1];
		if (!currentElement.children) {
			currentElement.children = [data];
		} else {
			currentElement.children.push(data);
		}
	}
	elementStack.push(data);
};

parser.endElementHandler = function(name) {
	elementStack.pop();
};

parser.characterDataHandler = function(s) {
	var currentElement = elementStack[elementStack.length - 1];
	if (!currentElement.characterData) {
		currentElement.characterData = s;
	} else if (!Array.isArray(currentElement.characterData)) {
		currentElement.characterData = [currentElement.characterData, s];
	} else {
		currentElement.characterData.push(s);
	}
};

parser.parse(xml);

var TRDPRC_1 = rootElement.children[0].children[0].characterData;
var ACVOL_1 = rootElement.children[0].children[1].characterData;
var PCTCHNG = rootElement.children[0].children[2].characterData;

    $.response.status = $.net.http.OK;

	$.response.contentType = "application/json";

	$.response.setBody(JSON.stringify(TRDPRC_1));
