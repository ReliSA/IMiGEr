/**
 * @constructor
 */
function JavaComponentChanger() {
	var javaClasses = {
		boolean: 'java.lang.Boolean',
		string: 'java.lang.String',
		list: 'java.util.List',
		set: 'java.util.Set',
	};

	var crceClasses = {
		package: 'crce.api.java.package',
		class: 'crce.api.java.class',
		method: 'crce.api.java.method',
		property: 'crce.api.java.property',
	};

	var ns = '';	// http://relisa.kiv.zcu.cz
	var xsi = 'http://www.w3.org/2001/XMLSchema-instance';
	var xsd = 'crce.xsd';

	var xmlDocument;
	var nodeCounter;

	var xmlParser = new DOMParser();
	var xmlSerializer = new XMLSerializer();

	/**
	 * Sends change requirements to CRCE.
	 * @param {array} components Components to be changed.
	 * @param {boolean} includeNotFound True if not found classes should be added as change requirements, otherwise false.
	 */
	this.run = function(components, includeNotFound) {
		if (components.length === 0) return;

		// initialize requirements XML to be sent to CRCE
		xmlDocument = constructXmlDocument(components, includeNotFound);

		console.log('CRCE request:', xmlDocument);

		// trigger change
		return $.ajax({
			type: 'POST',	// jQuery docs tells to use "method" but it doesn't work and always sends GET -> use "type" instead
			url: app.constants.crceApiBase + '/metadata/catalogue/',
			data: xmlSerializer.serializeToString(xmlDocument),
			contentType: 'application/xml',
			timeout: 180 * 1000,	// in milliseconds

		}).then(function(data, textStatus, jqXHR) {
			console.log('CRCE response:', data);

			var resourcesEl = data.childNodes[0];
			if (resourcesEl.childNodes.length === 0) {
				return $.Deferred().reject('CRCE did not find any resources fitting your requirements.').promise();
			}

			var proposals = [];

			resourcesEl.childNodes.forEach(function(resourceEl, index) {
				var proposal = {
					uuid: resourceEl.getAttribute('uuid'),
				};

				var capabilityEl = resourceEl.childNodes[0];
				capabilityEl.childNodes.forEach(function(attributeEl) {
					if (['name', 'external-id', 'version'].includes(attributeEl.getAttribute('name'))) {
						proposal[attributeEl.getAttribute('name')] = attributeEl.getAttribute('value');
					}
				});
				proposals.push(proposal);
			});

			return proposals;
		});
	};

	function constructXmlDocument(components, includeNotFound) {
		// initialize requirements XML to be sent to CRCE
		xmlDocument = document.implementation.createDocument(ns, 'requirements', null);
		//xmlDocument.documentElement.setAttributeNS(xsi, 'xsi:schemaLocation', ns + ' ' + xsd);

		nodeCounter = 0;

		// optimize returned results
		var optimizeByRequirementEl = xmlDocument.createElementNS(ns, 'requirement');
		optimizeByRequirementEl.setAttribute('namespace', 'result.optimize-by');

		var optimizeByFunctionAttributeEl = xmlDocument.createElementNS(ns, 'attribute');
		optimizeByFunctionAttributeEl.setAttribute('name', 'function-ID');
		optimizeByFunctionAttributeEl.setAttribute('type', javaClasses.string);
		optimizeByFunctionAttributeEl.setAttribute('value', 'cf-equal-cost');

		var optimizeByMethodAttributeEl = xmlDocument.createElementNS(ns, 'attribute');
		optimizeByMethodAttributeEl.setAttribute('name', 'method-ID');
		optimizeByMethodAttributeEl.setAttribute('type', javaClasses.string);
		optimizeByMethodAttributeEl.setAttribute('value', 'ro-ilp-direct-dependencies');

		optimizeByRequirementEl.appendChild(optimizeByFunctionAttributeEl);
		optimizeByRequirementEl.appendChild(optimizeByMethodAttributeEl);

		xmlDocument.documentElement.appendChild(optimizeByRequirementEl);

		// component does not have to fulfill all requirements
		var directiveEl = xmlDocument.createElementNS(ns, 'directive');
		directiveEl.setAttribute('name', 'operator');
		directiveEl.setAttribute('value', 'or');

		xmlDocument.documentElement.appendChild(directiveEl);

		// component requirements
		components.forEach(function(component) {
			var inEdgeList = component.getInEdgeList();
			if (!includeNotFound) {
				inEdgeList = inEdgeList.filter(function(edge) {
					return edge.getFrom().name !== app.constants.notFoundVertexName;
				});
			}

			if (inEdgeList.length === 0) return;

			// construct functionality requirements tree
			inEdgeList.forEach(function(edge) {
				var compatibilityInfoList = edge.getCompatibilityInfo();

				compatibilityInfoList.forEach(function(compatibilityInfo) {
					compatibilityInfo.incomps.forEach(function(incompatibility) {
						appendRequirementTree(xmlDocument.documentElement, incompatibility);
					});
				});
			});
		});

		return xmlDocument;
	}

	function appendRequirementTree(element, incompatibility) {
		var type = incompatibility.desc.type;

		if (app.utils.isUndefined(type)) {
			incompatibility.subtree.forEach(function(incompatibility) {
				appendRequirementTree(element, incompatibility);
			});

		} else {
			// add package for classes
			if (type === 'class') {
				var packageRequirementEl = xmlDocument.createElementNS(ns, 'requirement');
				packageRequirementEl.setAttribute('uuid', nodeCounter++);
				packageRequirementEl.setAttribute('namespace', crceClasses['package']);

				var packageAttributeEl = xmlDocument.createElementNS(ns, 'attribute');
				packageAttributeEl.setAttribute('name', 'name');
				packageAttributeEl.setAttribute('type', javaClasses.string);
				packageAttributeEl.setAttribute('value', incompatibility.desc.details.package);

				packageRequirementEl.appendChild(packageAttributeEl);
			}

			var requirementEl = xmlDocument.createElementNS(ns, 'requirement');
			requirementEl.setAttribute('uuid', nodeCounter++);
			requirementEl.setAttribute('namespace', crceClasses[type]);

			// attributes
			var details = incompatibility.desc.details;
			for (var key in details) {
				if (!details.hasOwnProperty(key)) continue;
				if (key === 'package') continue;

				var value = details[key];

				// TODO: fix for JaCC not returning correct values for abstract classes and interfaces
				if (key === 'abstract' || key === 'interface') continue;

				var attributeType;
				switch (typeof value) {
					case 'boolean':
						attributeType = javaClasses.boolean;
						break;
					case 'object':
						if (value.constructor.name === 'Array') {
							attributeType = javaClasses.list;
							break;
						}
					default:
						attributeType = javaClasses.string;
				}

				var attributeEl = xmlDocument.createElementNS(ns, 'attribute');
				attributeEl.setAttribute('name', key);
				attributeEl.setAttribute('type', attributeType);
				attributeEl.setAttribute('value', value);
	
				requirementEl.appendChild(attributeEl);
			}

			// children
			incompatibility.subtree.forEach(function(incompatibility) {
				appendRequirementTree(requirementEl, incompatibility);
			});

			// add package for classes
			if (type === 'class') {
				packageRequirementEl.appendChild(requirementEl);
				element.appendChild(packageRequirementEl);
			} else {
				element.appendChild(requirementEl);
			}
		}
	}
}