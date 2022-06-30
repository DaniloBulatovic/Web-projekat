package beans;

import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.HashMap;

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

public class Trainings {
	
	private HashMap<String, Training> trainings = new HashMap<String, Training>();
	
	private Gson g = new GsonBuilder().registerTypeAdapter(LocalDate.class, new JsonDeserializer<LocalDate>() {
		@Override
        public LocalDate deserialize(JsonElement json, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
            return LocalDate.parse(json.getAsJsonPrimitive().getAsString());
        }
    }).registerTypeAdapter(LocalDate.class, new JsonSerializer<LocalDate>() {
    	@Override
    	public JsonElement serialize(LocalDate date, Type typeOfSrc, JsonSerializationContext context) {
	        return new JsonPrimitive(date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
	    }
    }).setPrettyPrinting().create();
	
	public Trainings(){
		try {
			readTrainings();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void readTrainings() throws Exception
    {
		String json = new String(Files.readAllBytes(Paths.get("./static/data/trainings.json")));
		Type type = new TypeToken<HashMap<String, Training>>(){}.getType();
		trainings = g.fromJson(json, type);
    }

	public Collection<Training> getValues() {
		return trainings.values();
	}

	public Training getTraining(String id) {
		return trainings.get(id);
	}

	public void addTraining(Training training) {
		Integer maxId = -1;
		for (String id : trainings.keySet()) {
			int idNum = Integer.parseInt(id);
			if (idNum > maxId) {
				maxId = idNum;
			}
		}
		maxId++;
		training.setId(maxId.toString());
		trainings.put(training.getId(), training);
	}

	public void edit(String id, Training venue) {
		trainings.put(id, venue);
	}

	public void delete(String id) {
		trainings.remove(id);
	}
}
