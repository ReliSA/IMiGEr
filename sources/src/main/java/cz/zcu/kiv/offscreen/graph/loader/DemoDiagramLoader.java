package cz.zcu.kiv.offscreen.graph.loader;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.log4j.Logger;

public class DemoDiagramLoader {

	private Logger logger = Logger.getLogger(DemoDiagramLoader.class);

	/**
	 * 
	 * Reads an input file specified by request.
	 * 
	 * @param in
	 *            Input stream with JSON data.
	 * @return JSON string
	 */
	public String readDemoJSONFromFile(InputStream in) {

		BufferedReader reader = new BufferedReader(new InputStreamReader(in));

		StringBuffer buffer = new StringBuffer();
		String line = null;

		try {
			while ((line = reader.readLine()) != null) {
				buffer.append(line);
			}

		} catch (Exception e) {
			logger.error("ERROR at file reading");
		} finally {
			closeQuietly(in);
			closeQuietly(reader);
		}

		return buffer.toString();
	}

	/**
	 * 
	 * Closes quietly a stream.
	 * 
	 * @param stream
	 *            Input stream to close.
	 */
	private void closeQuietly(Closeable stream) {
		if (stream != null)
			try {
				stream.close();
			} catch (Exception e) {
				// ignore
			}
	}

}
