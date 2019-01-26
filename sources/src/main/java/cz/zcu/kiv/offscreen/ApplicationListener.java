package cz.zcu.kiv.offscreen;

import cz.zcu.kiv.offscreen.modularization.ModuleProvider;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class ApplicationListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        ModuleProvider.getInstance().stopWatcher();
    }
}
