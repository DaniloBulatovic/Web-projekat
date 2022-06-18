package beans;

import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class SportsVenues {
	
	private HashMap<String, SportsVenue> sportsVenues = new HashMap<String, SportsVenue>();
	
	public SportsVenues(){
		try {
			readSportVenues();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private static HashMap<String, SportsVenue> sortValues(HashMap<String, SportsVenue> map)   
	{   
		List<Map.Entry<String, SportsVenue>> list = new LinkedList<Map.Entry<String, SportsVenue>>(map.entrySet());  
		Collections.sort(list, new Comparator<Map.Entry<String, SportsVenue>>() {  
			public int compare(Map.Entry<String, SportsVenue> o1, Map.Entry<String, SportsVenue> o2)   
			{  
				return (-1 * Boolean.compare(((Map.Entry<String, SportsVenue>) o1).getValue().isWorking(),((Map.Entry<String, SportsVenue>) o2).getValue().isWorking()));  
			}  
		});
		HashMap<String, SportsVenue> sortedHashMap = new LinkedHashMap<String, SportsVenue>();  
		for (Iterator<Entry<String, SportsVenue>> it = list.iterator(); it.hasNext();)   
		{  
			 Map.Entry<String, SportsVenue> entry = (Map.Entry<String, SportsVenue>) it.next();  
			 sortedHashMap.put(entry.getKey(), entry.getValue());  
		}   
		return sortedHashMap;  
	}  
	
	public void readSportVenues() throws Exception
    {
		String json = new String(Files.readAllBytes(Paths.get("./static/data/sportsVenues.json")));
		Type type = new TypeToken<HashMap<String, SportsVenue>>(){}.getType();
		sportsVenues = new Gson().fromJson(json, type);
		sportsVenues = sortValues(sportsVenues);
    }

	public Collection<SportsVenue> getValues() {
		return sportsVenues.values();
	}

	public SportsVenue getSportsVenue(String id) {
		return sportsVenues.get(id);
	}

	public void addSportsVenue(SportsVenue sportsVenue) {
		Integer maxId = -1;
		for (String id : sportsVenues.keySet()) {
			int idNum = Integer.parseInt(id);
			if (idNum > maxId) {
				maxId = idNum;
			}
		}
		maxId++;
		sportsVenue.setId(maxId.toString());
		sportsVenues.put(sportsVenue.getId(), sportsVenue);
	}

	public void edit(String id, SportsVenue venue) {
		sportsVenues.put(id, venue);
	}

	public void delete(String id) {
		sportsVenues.remove(id);
	}
}
