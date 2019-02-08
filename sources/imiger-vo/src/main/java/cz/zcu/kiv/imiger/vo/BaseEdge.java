package cz.zcu.kiv.imiger.vo;

/**
 * Class represents edge. Class contains attributes which are common for input JSON format and for
 * output JSON format (JSON between frontend and backend)
 */
public class BaseEdge {
    /** identification number of edge */
    private int id;
    /** original ID of vertex from edge leads */
    private int from;
    /** original ID of vertex where edge leads */
    private int to;
    /** additional info */
    private String text;

    public BaseEdge(int id, int from, int to, String text) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.text = text;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getFrom() {
        return from;
    }

    public void setFrom(int from) {
        this.from = from;
    }

    public int getTo() {
        return to;
    }

    public void setTo(int to) {
        this.to = to;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    /**
     * Generate hash code based on attributes {@code from} and {@code to}.
     * @return generated hash code.
     */
    @Override
    public int hashCode() {
        return from * 100000 + to;
    }

    /**
     * Two edges are equals where their {@code from} and {@code to} are equals.
     *
     * @param edge which will be compared with this instance
     * @return tru if edges are equal, false otherwise
     */
    @Override
    public boolean equals(Object edge) {
        if (!(edge instanceof BaseEdge)) return false;

        BaseEdge cmpEdge = (BaseEdge) edge;
        return from == cmpEdge.from && to == cmpEdge.to;
    }
}
