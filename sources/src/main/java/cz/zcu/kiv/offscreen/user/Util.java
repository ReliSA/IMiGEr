package cz.zcu.kiv.offscreen.user;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

class Util {

	/**
	 *	Method do a hash code from string.
	 *
	 * @param md5 - String to hash
	 * @return String - hashcode 
	 */
	static String MD5(String md5) {
		   try {
		        java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
		        byte[] array = md.digest(md5.getBytes());
		        StringBuffer sb = new StringBuffer();
		        for (int i = 0; i < array.length; ++i) {
		          sb.append(Integer.toHexString((array[i] & 0xFF) | 0x100).substring(1,3));
		       }
		        return sb.toString();
		    } catch (java.security.NoSuchAlgorithmException e) {
		    }
		    return null;
	}

	static String formatDate(String date){
		String pattern = "(\\d{4})-(\\d{2})-(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2}).*";
		Pattern pat = Pattern.compile(pattern);
		Matcher matches = pat.matcher(date);
		String formatedDate = "";
		
		if(matches.find()){			
			formatedDate = matches.group(3) + "." + matches.group(2) + "." +  matches.group(1) + " " + matches.group(4) + ":" +  matches.group(5);			
		}
		
		return formatedDate;
	}
}
