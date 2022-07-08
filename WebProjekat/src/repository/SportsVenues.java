package repository;

import java.io.FileWriter;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
import java.util.stream.Collectors;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.reflect.TypeToken;

import beans.SportsVenue;

public class SportsVenues {
	
	private HashMap<String, SportsVenue> sportsVenues = new HashMap<String, SportsVenue>();
	
	private static Gson g = new GsonBuilder().registerTypeAdapter(LocalDateTime.class, new JsonDeserializer<LocalDateTime>() {
        @Override
        public LocalDateTime deserialize(JsonElement json, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
            return LocalDateTime.parse(json.getAsJsonPrimitive().getAsString());
        }
    }).registerTypeAdapter(LocalDateTime.class, new JsonSerializer<LocalDateTime>() {
    	@Override
    	public JsonElement serialize(LocalDateTime date, Type typeOfSrc, JsonSerializationContext context) {
	        return new JsonPrimitive(date.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
	    }
    }).setPrettyPrinting().create();
	
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
		sportsVenues = g.fromJson(json, type);
		sportsVenues = sortValues(sportsVenues);
    }

	public void writeSportVenues(HashMap<String, SportsVenue> venues) throws Exception
    {
		FileWriter writer = new FileWriter("./static/data/sportsVenues.json");
		g.toJson(venues, writer);
		writer.flush();
		writer.close();
    }
	
	public void writeSportVenues() throws Exception
    {
		FileWriter writer = new FileWriter("./static/data/sportsVenues.json");
		g.toJson(sportsVenues, writer);
		writer.flush();
		writer.close();
    }
	
	public Collection<SportsVenue> getValues() {
		HashMap<String, SportsVenue> filtered = new HashMap<String, SportsVenue>(sportsVenues);
		filtered.keySet().removeAll(sportsVenues.entrySet().stream().filter(a->a.getValue().isDeleted()).map(e -> e.getKey()).collect(Collectors.toList()));
		filtered = sortValues(filtered);
		return filtered.values();
	}

	public SportsVenue getSportsVenue(String id) {
		if (sportsVenues.get(id).isDeleted())
			return null;
		return sportsVenues.get(id);
	}

	public SportsVenue addSportsVenue(SportsVenue sportsVenue) {
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
		try {
			writeSportVenues(sportsVenues);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return sportsVenue;
	}

	public void edit(String id, SportsVenue venue) {
		sportsVenues.put(id, venue);
		try {
			writeSportVenues(sportsVenues);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void delete(String id) {
		sportsVenues.get(id).setDeleted(true);
		try {
			writeSportVenues(sportsVenues);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
