package beans;

import java.io.FileWriter;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
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

public class Comments {
	
	private HashMap<String, Comment> comments = new HashMap<String, Comment>();
	
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
	
	public void writeComments(HashMap<String, Comment> comments) throws Exception
    {
		FileWriter writer = new FileWriter("./static/data/comments.json");
		g.toJson(comments, writer);
		writer.flush();
		writer.close();
    }

	public Collection<Comment> getValues() {
		HashMap<String, Comment> filtered = new HashMap<String, Comment>(comments);
		filtered.keySet().removeAll(comments.entrySet().stream().filter(a->a.getValue().isDeleted()).map(e -> e.getKey()).collect(Collectors.toList()));
		return filtered.values();
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
		try {
			writeComments(comments);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void edit(String id, Comment comment) {
		comments.put(id, comment);
		try {
			writeComments(comments);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void delete(String id) {
		comments.get(id).setDeleted(true);
		try {
			writeComments(comments);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
