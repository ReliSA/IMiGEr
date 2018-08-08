//package cz.zcu.kiv.offscreen.graph.creator;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import org.apache.log4j.Logger;
//
//import cz.zcu.kiv.efps.comparator.result.EfpEvalResult.MatchingResult;
//import cz.zcu.kiv.offscreen.api.EdgeInterface;
//import cz.zcu.kiv.offscreen.api.GraphInterface;
//import cz.zcu.kiv.offscreen.api.VertexInterface;
//import cz.zcu.kiv.offscreen.data.efpportal.CocaexData;
//import cz.zcu.kiv.offscreen.data.efpportal.CocaexDataEfp;
//import cz.zcu.kiv.offscreen.data.efpportal.CocaexDataFeature;
//import cz.zcu.kiv.offscreen.data.efpportal.CocaexWrapper;
//import cz.zcu.kiv.offscreen.graph.EdgeEfp;
//import cz.zcu.kiv.offscreen.graph.GraphImpl;
//import cz.zcu.kiv.offscreen.graph.VertexEfp;
//import cz.zcu.kiv.offscreen.graph.efp.EfpComparison;
//import cz.zcu.kiv.offscreen.graph.efp.EfpFeature;
//
///**
// *
// * Transforms data obtained in form of Map<String, CocaexData> to
// * cz.zcu.kiv.offscreen.api.GraphInterface.
// *
// * @author Jiri Loudil
// *
// */
//public class EfpGraphTransfomer {
//
//	private final String DELIMITER = ";";
//
//	/**
//	 * Output data format.
//	 */
//	private GraphInterface graph = null;
//
//	/**
//	 * Input data format.
//	 */
//	private Map<String, CocaexData> resultData = null;
//
//	private Map<String, String> resultFeaturesMapping = null;
//
//	private Map<String, String> resultEfpsMapping = null;
//
//	/**
//	 * Already used vertices.
//	 */
//	private Map<String, VertexInterface> vertexMap;
//
//	/**
//	 * Already used features.
//	 */
//	private Map<String, EfpFeature> featureMap;
//
//	/**
//	 * Logging.
//	 */
//	private Logger logger = Logger.getLogger(EfpGraphTransfomer.class);
//
//	/**
//	 * New transformer from input data.
//	 *
//	 * @param efpportalResultsWrapper
//	 *            Input data in from of EfpPortal app.
//	 */
//	public EfpGraphTransfomer(CocaexWrapper efpportalResultsWrapper) {
//		logger.trace("ENTRY");
//		this.graph = new GraphImpl();
//
//		this.resultData = efpportalResultsWrapper.getData();
//		this.resultEfpsMapping = efpportalResultsWrapper.getEfpMappings();
//		this.resultFeaturesMapping = efpportalResultsWrapper
//				.getFeatureMappings();
//
//		this.vertexMap = new HashMap<String, VertexInterface>();
//		this.featureMap = new HashMap<String, EfpFeature>();
//
//		logger.trace("EXIT");
//	}
//
//	/**
//	 * Generates the graph with vertices and edges.
//	 *
//	 * @return graph
//	 */
//	public GraphInterface transform() {
//		logger.trace("ENTRY");
//		this.generateVertices();
//		this.generateEdges();
//
//		// set proper feature and efp names
//		this.setNamesInsteadOfNumbers();
//		logger.trace("EXIT");
//
//		return this.graph;
//	}
//
//	/**
//	 * Substitute ID for the proper name string.
//	 */
//	private void setNamesInsteadOfNumbers() {
//		logger.trace("ENTRY");
//
//		List<EdgeInterface> edges = graph.getEdges();
//
//		for (EdgeInterface edgeInterface : edges) {
//			ArrayList<EfpFeature> features = ((EdgeEfp) edgeInterface)
//					.getFeatures();
//
//			for (EfpFeature efpFeature : features) {
//				// substitute ID for the true name from the feature mapping
//				String tmpFeatureName = resultFeaturesMapping.get(efpFeature.getName());
//
//				efpFeature.setName(tmpFeatureName.split(DELIMITER)[1]);
//
//				ArrayList<EfpComparison> efps = efpFeature.getEfps();
//
//				for (EfpComparison efpComparison : efps) {
//					// substitute ID for the true name from the efps mapping
//					efpComparison.setEfpName(resultEfpsMapping
//							.get(efpComparison.getEfpName()));
//				}
//			}
//		}
//
//		logger.trace("EXIT");
//	}
//
//	/**
//	 * Generate vertices for this graph.
//	 */
//	private void generateVertices() {
//		logger.trace("ENTRY");
//
//		int id = 0;
//		VertexEfp vertex;
//
//		for (Map.Entry<String, CocaexData> tmpData : resultData.entrySet()) {
//			id++;
//
//			vertex = new VertexEfp(id, tmpData.getKey(), tmpData.getKey());
//
//			this.graph.addVertex(tmpData.getKey(), vertex);
//			this.vertexMap.put(tmpData.getKey(), vertex);
//		}
//
//		logger.trace("EXIT");
//	}
//
//	/**
//	 * Generate edges for this graph.
//	 */
//	private void generateEdges() {
//		logger.trace("ENTRY");
//
//		int id = 0;
//		String from, to;
//		CocaexData currentEvaluatedVertexData;
//
//		for (Map.Entry<String, VertexInterface> currentVertex : vertexMap
//				.entrySet()) {
//			currentEvaluatedVertexData = resultData.get(currentVertex.getKey());
//
//			to = currentVertex.getKey();
//
//			// all required features FROM
//			for (Map.Entry<String, CocaexDataFeature> tmpRequired : currentEvaluatedVertexData
//					.getRequiredFeatures().entrySet()) {
//
//				String requiredFeatureName = this.resultFeaturesMapping
//						.get(tmpRequired.getKey());
//
//				// get feature name, its first part is component name
//				String[] requiredSplits = requiredFeatureName.split(DELIMITER);
//
//				// not-connected ones are left over
//				if (!requiredSplits[0].isEmpty()) {
//
//					// vertex from == vertex to -> we dont want that...
//					if (requiredSplits[0].equals(currentVertex.getKey())) {
//						continue;
//					}
//
//					// find corresponding feature on the TO vertex
//					CocaexData otherVertexData = resultData
//							.get(requiredSplits[0]);
//					CocaexDataFeature otherVertexFeature = null;
//
//					// go through all features of the TO
//					for (Map.Entry<String, CocaexDataFeature> tmpProvided : otherVertexData
//							.getProvidedFeatures().entrySet()) {
//						String providedFeatureName = this.resultFeaturesMapping
//								.get(tmpProvided.getKey());
//
//						String[] providedSplits = providedFeatureName
//								.split(DELIMITER);
//
//						// not-connected ones are left over
//						if (providedSplits[0].isEmpty()) {
//							continue;
//						}
//
//						// found matching feature between TO and FROM
//						if (providedSplits[0].equals(currentVertex.getKey())
//								&& providedSplits[1].equals(requiredSplits[1])) {
//							otherVertexFeature = tmpProvided.getValue();
//						}
//					}
//
//					from = requiredSplits[0];
//
//					EdgeEfp edge = findEdgeInGraph(from, to);
//
//					// add new edge
//					if (edge == null) {
//						edge = new EdgeEfp(++id, from, to);
//						// from to
//						checkAddEdgeFeature(tmpRequired.getValue(),
//								otherVertexFeature, tmpRequired.getKey(), edge);
//
//						this.graph.addEdge(edge);
//					} else {
//						// add a feature to an old edge only
//						checkAddEdgeFeature(tmpRequired.getValue(),
//								otherVertexFeature, tmpRequired.getKey(), edge);
//					}
//				}
//
//			}
//		}
//
//		logger.trace("EXIT");
//	}
//
//	/**
//	 *
//	 * Find an existing edge in graph.
//	 *
//	 * @param from
//	 *            Name of start vertex.
//	 * @param to
//	 *            name of end vertex.
//	 * @return Null if not found, edge otherwise.
//	 */
//	private EdgeEfp findEdgeInGraph(String from, String to) {
//		logger.trace("ENTRY");
//		List<EdgeInterface> tmpEdges = this.graph.getEdges();
//
//		for (EdgeInterface edge : tmpEdges) {
//			// found old edge
//			if (edge.getFrom().equals(from) && edge.getTo().equals(to)) {
//				logger.trace("EXIT");
//				return (EdgeEfp) edge;
//			}
//		}
//
//		logger.trace("EXIT");
//		return null;
//	}
//
//	/**
//	 *
//	 * Check and add feature to edge.
//	 *
//	 * @param requiredFeature
//	 *            Required feature with EFPs.
//	 * @param providedFeature
//	 *            Provided feature with EFPs.
//	 * @param name
//	 *            Feature name.
//	 * @param edge
//	 *            Edge where the feature belongs.
//	 */
//	private void checkAddEdgeFeature(CocaexDataFeature requiredFeature,
//			CocaexDataFeature providedFeature, String name, EdgeEfp edge) {
//		logger.trace("ENTRY");
//		EfpFeature tmpFeature = null;
//
//		// find out if the edge already has a features like the added one
//		for (EfpFeature oldFeature : edge.getFeatures()) {
//			// the edge contains the feature already
//			if (oldFeature.getName().equals(name)) {
//				tmpFeature = oldFeature;
//				break;
//			}
//		}
//
//		// an old feature
//		if (tmpFeature != null) {
//			tmpFeature = featureMap.get(name);
//
//			processEfpsToFeature(requiredFeature, providedFeature, tmpFeature,
//					edge);
//		} else { // add new feature to edge
//			tmpFeature = new EfpFeature(name);
//
//			// preset the OK state
//			tmpFeature.setFeatureStatus(MatchingResult.OK.toString());
//
//			processEfpsToFeature(requiredFeature, providedFeature, tmpFeature,
//					edge);
//
//			edge.getFeatures().add(tmpFeature);
//			featureMap.put(name, tmpFeature);
//		}
//		logger.trace("EXIT");
//	}
//
//	/**
//	 *
//	 * Prepare process of adding EFP values to existing feature.
//	 *
//	 * @param requiredFeature
//	 *            Required feature with EFPs.
//	 * @param providedFeature
//	 *            Provided feature with EFPs.
//	 * @param feature
//	 *            Existing feature.
//	 * @param edge
//	 *            Edge where the EFPs with feature belong.
//	 */
//	private void processEfpsToFeature(CocaexDataFeature requiredFeature,
//			CocaexDataFeature providedFeature, EfpFeature feature, EdgeEfp edge) {
//		logger.trace("ENTRY");
//
//		MatchingResult result = checkAddFeatureEfp(requiredFeature,
//				providedFeature, feature);
//
//		if (!result.equals(MatchingResult.OK)) {
//			edge.setEdgeStatusOk(false);
//			feature.setFeatureStatus(result.toString());
//		}
//
//		logger.trace("EXIT");
//	}
//
//	/**
//	 *
//	 * Check and add EFPs to an existing feature.
//	 *
//	 * @param requiredFeature
//	 *            Required feature with EFPs.
//	 * @param providedFeature
//	 *            Provided feature with EFPs.
//	 * @param feature
//	 *            Existing feature.
//	 * @return Result of EFPs comparison. OK/MISSING/ERROR
//	 */
//	private MatchingResult checkAddFeatureEfp(
//			CocaexDataFeature requiredFeature,
//			CocaexDataFeature providedFeature, EfpFeature feature) {
//		logger.trace("ENTRY");
//		final String defaultValue = "No value";
//
//		MatchingResult output = MatchingResult.OK;
//
//		// all EFPs bound to this feature
//		for (int i = 0; i < requiredFeature.getEfps().size(); i++) {
//			EfpComparison efpCmp = new EfpComparison();
//
//			CocaexDataEfp firstEfp = requiredFeature.getEfps().get(i);
//			CocaexDataEfp secondEfp = providedFeature.getEfps().get(i);
//
//			// set real values
//			if (firstEfp.getEfpValue() != null) {
//				efpCmp.setLeftEfpValue(firstEfp.getEfpValue().toString());
//			} else {
//				efpCmp.setLeftEfpValue(defaultValue);
//			}
//
//			if (secondEfp.getEfpValue() != null) {
//				efpCmp.setRightEfpValue(secondEfp.getEfpValue().toString());
//			} else {
//				efpCmp.setRightEfpValue(defaultValue);
//			}
//
//			efpCmp.setTypeName(firstEfp.getEfpValueTypeName());
//			efpCmp.setEfpName(firstEfp.getEfpName());
//			efpCmp.setComparisonStatus(firstEfp.getTypeError().name());
//
//			// at least one efp is not OK
//			if (!firstEfp.getTypeError().equals(MatchingResult.OK)) {
//				output = firstEfp.getTypeError();
//			}
//
//			feature.getEfps().add(efpCmp);
//		}
//		logger.trace("EXIT");
//
//		return output;
//	}
//}
