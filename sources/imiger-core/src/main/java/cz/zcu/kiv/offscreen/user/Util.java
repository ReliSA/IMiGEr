package cz.zcu.kiv.offscreen.user;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

class Util {


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
