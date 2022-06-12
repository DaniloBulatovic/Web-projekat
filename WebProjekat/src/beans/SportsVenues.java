package beans;

import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;

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
	
	public void readSportVenues() throws Exception
    {
		String json = new String(Files.readAllBytes(Paths.get("./static/sportsVenues.json")));
		Type type = new TypeToken<HashMap<String, SportsVenue>>(){}.getType();
		sportsVenues = new Gson().fromJson(json, type);
    }

	/** Vraca kolekciju proizvoda. */
	public Collection<SportsVenue> getValues() {
		return sportsVenues.values();
	}

	/** Vraca proizvod na osnovu njegovog id-a. */
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

	public void edit(String id, SportsVenue pd) {
		sportsVenues.put(id, pd);
	}

	public void delete(String id) {
		sportsVenues.remove(id);
	}
}
