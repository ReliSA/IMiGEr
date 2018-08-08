package cz.zcu.kiv.offscreen.graph.creator;

import cz.zcu.kiv.ccu.ApiCmpStateResult;
import cz.zcu.kiv.ccu.ApiInterCompatibilityResult;
import cz.zcu.kiv.jacc.cmp.JComparator;
import cz.zcu.kiv.jacc.javatypes.*;
import cz.zcu.kiv.offscreen.api.GraphInterface;
import cz.zcu.kiv.offscreen.api.VertexInterface;
import cz.zcu.kiv.offscreen.graph.EdgeImpl;
import cz.zcu.kiv.offscreen.graph.GraphImpl;
import cz.zcu.kiv.offscreen.graph.VertexImpl;
import cz.zcu.kiv.typescmp.CmpResult;
import cz.zcu.kiv.typescmp.CmpResultNode;
import cz.zcu.kiv.typescmp.CorrectionStrategy;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

/**
 * This class provides creation graph of the loaded bundle.
 *
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class GraphMaker {

    private GraphInterface graph;
    private Logger logger = Logger.getLogger(GraphMaker.class);
    private Map<String, VertexInterface> vertexMap;
    private String fileLocation;
    private int level;

    private ApiInterCompatibilityResult comparisonResult;
    private File[] uploadedFiles;
    private Properties jaccMessages;

    private static final String NOT_FOUND = "NOT_FOUND";

    public GraphMaker(String fileLocation, ApiInterCompatibilityResult comparisonResult, File[] uploadedFiles) throws IOException {
        logger.trace("ENTRY");
        this.graph = new GraphImpl();
        this.fileLocation = fileLocation;

        this.uploadedFiles = uploadedFiles;
        this.comparisonResult = comparisonResult;
        logger.trace("EXIT");

        jaccMessages = new Properties();
        InputStream in = null;
        try {
            in = JComparator.class.getResourceAsStream("messages.properties");
            jaccMessages.load(in);
        } catch (IOException e) {
            logger.trace(e);
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    logger.trace(e);
                }
            }
        }
    }

    /**
     * This method creates the vertices and adds them to the graph.
     */
    private void generateVertices() {
        logger.trace("ENTRY");

        VertexImpl vertex;
        String name;
        String symbolicName;
        int id = 0;
        this.vertexMap = new HashMap<>();

        for (File origin : this.uploadedFiles) {
            id++;
            symbolicName = createSymbolicName(origin.toString()); 
            name = origin.getName();
            vertex = new VertexImpl(id, name, symbolicName);

            this.vertexMap.put(symbolicName, vertex);
            this.graph.addVertex(symbolicName, vertex);
        }

        symbolicName = createSymbolicName(NOT_FOUND);
        vertex = new VertexImpl(++id, NOT_FOUND, symbolicName);

        this.vertexMap.put(symbolicName, vertex);
        this.graph.addVertex(symbolicName, vertex);

        logger.trace("EXIT");
    }

    /**
     * This method creates the edges and adds them to the graph. Currently, only incompatible edges are created.
     */
    private void generateEdges() {
        logger.trace("ENTRY");

        int id = 0;

        // cyklus pres nekompatibilni komponenty (komponenta = jar soubor)
        Set<String> components = comparisonResult.getOriginsImportingIncompatibilities();
        for (String component : components) {
            String firstOrigin = "";
            String secondOrigin = "";
            String firstOriginNF = "";
            String secondOriginNF = "";

            JSONArray incompatibleInfoJSON = new JSONArray();
            JSONArray notFoundInfoJSON = new JSONArray();

            // cyklus pres nekompatibilni tridy
            Set<JClass> incompatibleClasses = comparisonResult.getClassesImportingIncompatibilities(component);
            for (JClass incompatibleClass : incompatibleClasses) {
                JSONArray incompatibilitiesJson = new JSONArray();
                JSONArray missingClassesJson = new JSONArray();

                // cyklus pres samotne nekompatibility
                Set<ApiCmpStateResult> apiCmpResults = comparisonResult.getIncompatibleResults(incompatibleClass, component);
                for (ApiCmpStateResult apiCmpResult : apiCmpResults) {
                    this.level = 0;

                    CmpResult<File> cmpResult = apiCmpResult.getResult();

                    if (cmpResult.getSecondObject() != null) {
                        List<CmpResultNode> children = cmpResult.getChildren();
                        for (CmpResultNode child : children) {
                            incompatibilitiesJson.put(findIncompatibilityCause(child, ""));
                        }

                        if (firstOrigin.equals("") && secondOrigin.equals("")) {
                            firstOrigin = cmpResult.getFirstObject().getName();
                            secondOrigin = cmpResult.getSecondObject().getName();
                        }

                    } else {
                        List<CmpResultNode> children = cmpResult.getChildren();
                        for (CmpResultNode child : children) {
                            missingClassesJson.put(findIncompatibilityCause(child, ""));
                        }

                        if (firstOriginNF.equals("") && secondOriginNF.equals("")) {
                            firstOriginNF = cmpResult.getFirstObject().getName();
                            secondOriginNF = NOT_FOUND;
                        }
                    }
                }

                // incompatible class
                JSONObject incompatibleClassJson = new JSONObject();
                incompatibleClassJson.put("causedBy", incompatibleClass.getName());
                incompatibleClassJson.put("incomps", incompatibilitiesJson);

                incompatibleInfoJSON.put(incompatibleClassJson);

                // not found class
                JSONObject notFoundClassJson = new JSONObject();
                notFoundClassJson.put("causedBy", incompatibleClass.getName());
                notFoundClassJson.put("incomps", missingClassesJson);

                notFoundInfoJSON.put(notFoundClassJson);
            }

            if (!firstOrigin.equals("")) {
                id++;
                EdgeImpl edge = new EdgeImpl(id, createSymbolicName(firstOrigin), createSymbolicName(secondOrigin), false, incompatibleInfoJSON.toString());
                this.graph.addEdge(edge);
            }

            if (!firstOriginNF.equals("")) {
                id++;
                EdgeImpl edge = new EdgeImpl(id, createSymbolicName(secondOriginNF), createSymbolicName(firstOriginNF), false, notFoundInfoJSON.toString());
                this.graph.addEdge(edge);
            }
        }

        logger.trace("EXIT");
    }

    /**
     * Create symbolic name.
     *
     * @param origin
     * @return Symbolic name.
     */
    private String createSymbolicName(String origin) {
        String location = this.fileLocation.replace("/", File.separator) + File.separator;

        return "vertex_" + origin.replace(location, "");
    }

    /**
     * Generates the graph with vertices and edges.
     *
     * @return graph
     */
    public GraphInterface generate() {
        logger.trace("ENTRY");

        this.generateVertices();
        this.generateEdges();

        logger.trace("EXIT");

        return this.graph;
    }

    /**
     * Recursive function for traversing tree with incompatibility information. Creates object serializable to JSON.
     *
     * @param cmpResultNode
     * @param corrStrategy
     */
    public JSONObject findIncompatibilityCause(CmpResultNode cmpResultNode, String corrStrategy) {
        Object o = cmpResultNode.getResult().getFirstObject();

        // cause description
        JSONObject descriptionJson = new JSONObject();
        descriptionJson.put("level", this.level);

        if (o instanceof JMethod) {
            descriptionJson.put("name", "M " + getMethodDeclaration(o));
        } else if (o instanceof JField) {
            descriptionJson.put("name", "F " + getFieldDeclaration(o));
        } else if (o instanceof HasName) {
            descriptionJson.put("name", this.jaccMessages.getProperty(cmpResultNode.getContentCode()) + ": " + ((HasName) o).getName());
        } else {
            descriptionJson.put("name", this.jaccMessages.getProperty(cmpResultNode.getContentCode()));
        }

        descriptionJson.put("contentCode", cmpResultNode.getContentCode());
        descriptionJson.put("propertyName", this.jaccMessages.getProperty(cmpResultNode.getContentCode()));
        descriptionJson.put("isIncompCause", cmpResultNode.isIncompatibilityCause());

        if (o instanceof JPackage) {
            descriptionJson.put("type", "package");
            descriptionJson.put("details", getPackageDetails((JPackage) o));
        } else if (o instanceof JClass) {
            descriptionJson.put("type", "class");
            descriptionJson.put("details", getClassDetails((JClass) o));
        } else if (o instanceof JMethod) {
            descriptionJson.put("type", "method");
            descriptionJson.put("details", getMethodDetails((JMethod) o));
        } else if (o instanceof JField) {
            descriptionJson.put("type", "field");
            descriptionJson.put("details", getFieldDetails((JField) o));
        }

        // incompatibility details
        if (cmpResultNode.isIncompatibilityCause()) {
            if (!cmpResultNode.getResult().getInherentDiff().name().equals("DEL")) {
                if (o instanceof HasName) {
                    descriptionJson.put("objectNameFirst", ((HasName) o).getName());
                    descriptionJson.put("objectNameSecond", ((HasName) cmpResultNode.getResult().getSecondObject()).getName());
                } else {
                    descriptionJson.put("objectNameFirst", o.toString());
                    descriptionJson.put("objectNameSecond", cmpResultNode.getResult().getSecondObject().toString());
                }
            }

            String incompName = this.getIncompatibilityName(cmpResultNode, corrStrategy);
            if (incompName.equals("")) {
                descriptionJson.put("incompName", "Incompatible " + this.jaccMessages.getProperty(cmpResultNode.getContentCode()) + " -> " + corrStrategy); //child.getResult().getStrategy().name();
            } else {
                descriptionJson.put("incompName", incompName + (cmpResultNode.getResult().getInherentDiff().name().equals("DEL") ? " is missing -> " + cmpResultNode.getResult().getStrategy().name() : ""));
            }

            descriptionJson.put("strategy", cmpResultNode.getResult().getStrategy().name());
            descriptionJson.put("difference", cmpResultNode.getResult().getInherentDiff().name());
        }

        // subtree
        JSONArray subtreeJson = new JSONArray();
        if (!cmpResultNode.getResult().childrenCompatible()) {
            this.level++;

            List<CmpResultNode> children = cmpResultNode.getResult().getChildren();
            for (CmpResultNode child : children) {
                CorrectionStrategy strategy = this.level == 1 ? cmpResultNode.getResult().getStrategy() : child.getResult().getStrategy();

                subtreeJson.put(findIncompatibilityCause(child, strategy.name()));
            }

            this.level--;
        }


        JSONObject causeJson = new JSONObject();
        causeJson.put("desc", descriptionJson);
        causeJson.put("subtree", subtreeJson);

        return causeJson;
    }

    private JSONObject getPackageDetails(JPackage pakkage) {
        JSONObject detailsJson = new JSONObject();
        detailsJson.put("name", pakkage.getName());

        return detailsJson;
    }

    private JSONObject getClassDetails(JClass clazz) {
        JSONObject detailsJson = new JSONObject();

        detailsJson.put("name", clazz.getShortName());
        detailsJson.put("package", clazz.getPackage().getName());

        detailsJson.put("enum", clazz.isEnum());
        detailsJson.put("interface", clazz.isInterface());
        detailsJson.put("annotation", clazz.isAnnotation());

        detailsJson.put("abstract", clazz.getModifiers().isAbstract());
        detailsJson.put("final", clazz.getModifiers().isFinal());
        detailsJson.put("static", clazz.getModifiers().isStatic());

        return detailsJson;
    }

    private JSONObject getMethodDetails(JMethod method) {
        JSONObject detailsJson = new JSONObject();

        detailsJson.put("name", method.getName());
        detailsJson.put("returnType", method.getReturnType().getName());
        detailsJson.put("constructor", method.isConstructor());

        List<JType> exceptionTypes = method.getExceptionTypes();
        JSONArray exceptionTypeNames = new JSONArray();
        for (JType type : exceptionTypes) {
            exceptionTypeNames.put(type.getName());
        }
        detailsJson.put("exceptions", exceptionTypeNames);

        List<JType> parameterTypes = method.getParameterTypes();
        JSONArray parameterTypeNames = new JSONArray();
        for (JType type : parameterTypes) {
            parameterTypeNames.put(type.getName());
        }
        detailsJson.put("paramTypes", parameterTypeNames);

        detailsJson.put("abstract", method.getModifiers().isAbstract());
        detailsJson.put("final", method.getModifiers().isFinal());
        detailsJson.put("static", method.getModifiers().isStatic());
        detailsJson.put("synchronized", method.getModifiers().isSynchronized());

        return detailsJson;
    }

    private JSONObject getFieldDetails(JField field) {
        JSONObject detailsJson = new JSONObject();

        detailsJson.put("name", field.getName());
        detailsJson.put("type", field.getType().getName());
        detailsJson.put("initialValue", field.getInitialValue());

        detailsJson.put("abstract", field.getModifiers().isAbstract());
        detailsJson.put("final", field.getModifiers().isFinal());
        detailsJson.put("static", field.getModifiers().isStatic());

        return detailsJson;
    }

    private String getShortName(String longName) {
        return longName.substring(longName.lastIndexOf('.') + 1);
    }

    private String getMethodDeclaration(Object o) {
        String methodName = "";
        methodName += getShortName(((JMethod) o).getReturnType().getName());
        methodName += " " + ((JMethod) o).getName();
        methodName += "(";
        for (JType type : ((JMethod) o).getParameterTypes()) {
            methodName += getShortName(type.getName()) + ", ";
        }
        methodName = methodName.replaceAll(", $", "");
        methodName += ")";
        return methodName;
    }

    private String getFieldDeclaration(Object o) {
        String fieldDeclaration = "";
        fieldDeclaration += getShortName(((JField) o).getType().getName());
        fieldDeclaration += " " + ((JField) o).getName();
        return fieldDeclaration;
    }

    private String getIncompatibilityName(CmpResultNode child, String corrStrategy) {
        Object o = child.getResult().getFirstObject();

        String incompName;
        switch (child.getContentCode()) {
            case "cmp.child.class":
                if (o instanceof HasName) {
                    incompName = "Class " + ((HasName) o).getName();
                } else {
                    incompName = "Class " + o.toString();
                }
                break;
            case "cmp.child.method.return.type":
                incompName = this.jaccMessages.getProperty(child.getContentCode()) + " different -> " + corrStrategy; 
                break;
            case "cmp.child.method.param.type":
                if (o instanceof HasName) {
                    incompName = "Parameter " + getShortName(((HasName) o).getName()) + " different -> " + corrStrategy; 
                } else {
                    incompName = "Parameter " + getShortName(o.toString()) + " different -> " + corrStrategy;
                }
                break;
            case "cmp.child.method.invocation":
                incompName = "Invoke Virtual" + " -> " + child.getResult().getStrategy().name();
                break;
            case "cmp.child.method":
                incompName = "<span class='entity'>M</span> " + getMethodDeclaration(o);
                break;
            case "cmp.child.constructor":
                incompName = "<span class='entity'>C</span> " + getMethodDeclaration(o);
                break;
            case "cmp.child.field":
                incompName = "<span class='entity'>F</span> " + getFieldDeclaration(o);
                break;
            case "cmp.child.modifier":
                incompName = "<span class='entity'>P</span> " + o.toString() + " -> " + corrStrategy; 
                break;
            default:
                incompName = "";
                break;
        }
        return incompName;
    }

}
