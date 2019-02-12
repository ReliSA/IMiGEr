package cz.zcu.kiv.imiger.spi;

/**
 * Service Provider Interface (SPI) that must be implemented by all modules.
 */
public interface IModule {
    /**
     * @return Display name of the module.
     */
    String getModuleName();

    /**
     * Converts input string in any format to raw JSON processable by IMiGEr.
     *
     * @param stringToConvert String to be converted to raw JSON.
     * @return Raw JSON.
     */
    String getRawJson(String stringToConvert);
}