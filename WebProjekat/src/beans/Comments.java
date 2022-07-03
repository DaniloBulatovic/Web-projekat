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

public class Comments {
	
	private HashMap<String, Comment> comments = new HashMap<String, Comment>();
	
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
	
	public Comments(){
		try {
			readComments();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void readComments() throws Exception
    {
		String json = new String(Files.readAllBytes(Paths.get("./static/data/comments.json")));
		Type type = new TypeToken<HashMap<String, Comment>>(){}.getType();
		comments = g.fromJson(json, type);
    }

	public Collection<Comment> getValues() {
		return comments.values();
	}

	public Comment getComment(String id) {
		return comments.get(id);
	}

	public void addComment(Comment comment) {
		Integer maxId = -1;
		for (String id : comments.keySet()) {
			int idNum = Integer.parseInt(id);
			if (idNum > maxId) {
				maxId = idNum;
			}
		}
		maxId++;
		comment.setId(maxId.toString());
		comments.put(comment.getId(), comment);
	}

	public void edit(String id, Comment comment) {
		comments.put(id, comment);
	}

	public void delete(String id) {
		comments.remove(id);
	}
}