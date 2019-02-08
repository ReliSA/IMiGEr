package cz.zcu.kiv.offscreen.modularization;

/**
 * Exception thrown when a jar file which is not a valid IMiGEr plugin is loaded.
 */
class NotModuleException extends Exception {
    NotModuleException() {
        super("Jar file is not a valid IMiGEr plugin!");
    }
}
