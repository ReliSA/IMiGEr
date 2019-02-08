package cz.zcu.kiv.offscreen.api;

/**
 * Class is used for storing information about vertex/group relative position.
 */
public class Position {

    /** Relative X position. */
    private float x;
    /** Relative Y position */
    private float y;

    public Position(float x, float y) {
        this.x = x;
        this.y = y;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }
}
