package cz.zcu.kiv.offscreen.api;

/**
 * Class represents vertex. Class contains attributes which are common for input JSON format and for
 * output JSON format (JSON between frontend and backend)
 */
public class BaseVertex {

    /** New generated identification number. */
    private int id;
    /** Identification number which is in input file. */
    private int originalId;
    /** Title of vertex. */
    private String title;
    /** Index of vertex archetype. */
    private int archetypeIndex;
    /** Additional info. */
    private String text;

    public BaseVertex(int id, int originalId, String title, int archetypeIndex, String text) {
        this.id = id;
        this.originalId = originalId;
        this.title = title;
        this.archetypeIndex = archetypeIndex;
        this.text = text;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getOriginalId() {
        return originalId;
    }

    public void setOriginalId(int originalId) {
        this.originalId = originalId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getArchetype() {
        return archetypeIndex;
    }

    public void setArchetype(int archetypeIndex) {
        this.archetypeIndex = archetypeIndex;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    /**
     * Generate hash code which is based on {@code originalId}.
     * @return generated has code
     */
    @Override
    public int hashCode() {
        return originalId;
    }

    /**
     * Two vertices are equals when their {@code originalId} is equals.
     * @param edge which will be compared with this instance
     * @return true if vertices are equal, false otherwise
     */
    @Override
    public boolean equals(Object edge) {
        if (!(edge instanceof BaseVertex)) return false;
        return originalId == ((BaseVertex) edge).originalId;
    }
}