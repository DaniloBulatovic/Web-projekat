package repository;

import java.io.FileWriter;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.HashMap;
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

import beans.Training;

public class Trainings {
	
	private HashMap<String, Training> trainings = new HashMap<String, Training>();
	
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
	
	public void writeTrainings(HashMap<String, Training> trainings) throws Exception
    {
		FileWriter writer = new FileWriter("./static/data/trainings.json");
		g.toJson(trainings, writer);
		writer.flush();
		writer.close();
    }

	public Collection<Training> getValues() {
		HashMap<String, Training> filtered = new HashMap<String, Training>(trainings);
		filtered.keySet().removeAll(trainings.entrySet().stream().filter(a->a.getValue().isDeleted()).map(e -> e.getKey()).collect(Collectors.toList()));
		return filtered.values();
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
		try {
			writeTrainings(trainings);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void edit(String id, Training training) {
		trainings.put(id, training);
		try {
			writeTrainings(trainings);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void delete(String id) {
		trainings.remove(id);
		try {
			writeTrainings(trainings);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
