package cz.zcu.kiv.offscreen.graph.loader;

import cz.zcu.kiv.comav.core.export.loaders.ComponentLoader;
import cz.zcu.kiv.comav.core.export.utils.ComAVException;
import cz.zcu.kiv.comav.loaders.ejb3.Ejb3ComponentLoader;
import cz.zcu.kiv.comav.loaders.osgi.OSGiComponentLoader;
import java.io.IOException;
import java.net.URI;
import org.apache.log4j.Logger;

/**
 *
 * @author Jindra Pavlíková <jindra.pav2@seznam.cz>
 */
public class GenericComponentLoader extends ComponentLoader {
    
    public static final String OSGI = "osgi";
    public static final String SOFA2 = "sofa2";
    public static final String EJB3 = "ejb3";
    
    private ComponentLoader loader;
    
    private Logger logger = Logger.getLogger(GenericComponentLoader.class);
    
    public GenericComponentLoader(String framework) {
        logger.trace("ENTRY");
        setComponentLoader(framework);
        logger.trace("EXIT");
    }
    
    private void setComponentLoader(String framework){
        logger.trace("ENTRY");
        if(OSGI.equalsIgnoreCase(framework)){
            this.loader = new OSGiComponentLoader();
        } else if (EJB3.equalsIgnoreCase(framework)){
            this.loader = new Ejb3ComponentLoader();
        } else if(SOFA2.equalsIgnoreCase(framework)){
           // this.loader = new Sofa2LocalComponentLoader();
        } else {
            logger.error("Unsupported framework " + framework);
            throw new IllegalStateException("Unsupported framework " + framework);
        }
        
        logger.trace("EXIT");
    }
    
    @Override
    public void load(URI[] uris) throws IOException {
        logger.trace("ENTRY");
        
        try {
            loader.load(uris);
        } catch (IOException e) {
            try {
                throw new ComAVException("Could not load data.", e);
            } catch (ComAVException ex) {
                System.out.println("ComAVException");
                //Logger.getLogger(MyLoader.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        model = loader.getModel();
        componentList = loader.getComponents();
        logger.trace("EXIT");
    }
    
}
