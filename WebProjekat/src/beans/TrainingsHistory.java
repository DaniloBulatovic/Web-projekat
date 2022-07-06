package beans;

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

public class TrainingsHistory {
	
	private HashMap<String, TrainingHistory> trainingsHistory = new HashMap<String, TrainingHistory>();
	
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
	
	public TrainingsHistory(){
		try {
			readTrainingsHistory();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void readTrainingsHistory() throws Exception
    {
		String json = new String(Files.readAllBytes(Paths.get("./static/data/trainingsHistory.json")));
		Type type = new TypeToken<HashMap<String, TrainingHistory>>(){}.getType();
		trainingsHistory = g.fromJson(json, type);
    }
	
	public void writeTrainingsHistory(HashMap<String, TrainingHistory> trainingsHistory) throws Exception
    {
		FileWriter writer = new FileWriter("./static/data/trainingsHistory.json");
		g.toJson(trainingsHistory, writer);
		writer.flush();
		writer.close();
    }

	public Collection<TrainingHistory> getValues() {
		HashMap<String, TrainingHistory> filtered = new HashMap<String, TrainingHistory>(trainingsHistory);
		filtered.keySet().removeAll(trainingsHistory.entrySet().stream().filter(a->a.getValue().isDeleted()).map(e -> e.getKey()).collect(Collectors.toList()));
		return filtered.values();
	}

	public TrainingHistory getTrainingHistory(String id) {
		return trainingsHistory.get(id);
	}

	public void addTrainingHistory(TrainingHistory trainingHistory) {
		Integer maxId = -1;
		for (String id : trainingsHistory.keySet()) {
			int idNum = Integer.parseInt(id);
			if (idNum > maxId) {
				maxId = idNum;
			}
		}
		maxId++;
		trainingHistory.setId(maxId.toString());
		trainingsHistory.put(trainingHistory.getId(), trainingHistory);
		try {
			writeTrainingsHistory(trainingsHistory);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void edit(String id, TrainingHistory trainingHistory) {
		trainingsHistory.put(id, trainingHistory);
		try {
			writeTrainingsHistory(trainingsHistory);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void delete(String id) {
		trainingsHistory.get(id).setDeleted(true);
		try {
			writeTrainingsHistory(trainingsHistory);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
