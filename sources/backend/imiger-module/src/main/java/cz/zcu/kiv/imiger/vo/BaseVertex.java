package cz.zcu.kiv.imiger.vo;

/**
 * Class represents vertex. Class contains attributes which are common for input JSON format and for
 * output JSON format (JSON between frontend and backend)
 */
public abstract class BaseVertex {

    /** New generated identification number. */
    private int id;
    /** Name of vertex. */
    private String name;
    /** Index of vertex archetype. */
    private int archetype;
    /** Additional info. */
    private String text;

    public BaseVertex(int id, String name, int archetype, String text) {
        this.id = id;
        this.name = name;
        this.archetype = archetype;
        this.text = text;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getArchetype() {
        return archetype;
    }

    public void setArchetype(int archetypeIndex) {
        this.archetype = archetypeIndex;
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
        return id;
    }

    /**
     * Two vertices are equals when their {@code originalId} is equals.
     * @param vertex which will be compared with this instance
     * @return true if vertices are equal, false otherwise
     */
    @Override
    public boolean equals(Object vertex) {
        if (!(vertex instanceof BaseVertex)) return false;
        return id == ((BaseVertex) vertex).id;
    }
}