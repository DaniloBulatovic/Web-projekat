package controller;

import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import java.io.InputStream;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import beans.Training;
import services.TrainingService;

public class TrainingController {
	
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
	private static TrainingService trainingService = new TrainingService();
	
	public static void initializeController() {
		getTrainings();
		getTraining();
		getTrainingsByVenue();
		addTraining();
		editTraining();
		deleteTraining();
		uploadLogo();
	}
	
	public static void getTrainings() {
		get("rest/trainings/", (req, res) -> {
			res.type("application/json");
			return g.toJson(trainingService.getTrainings());
		});
	}
	
	public static void getTraining() {
		get("rest/trainings/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(trainingService.getTraining(id));
		});
	}
	
	public static void getTrainingsByVenue() {
		get("rest/trainings/venue/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(trainingService.getTrainingsByVenue(id));
		});
	}
	
	public static void addTraining() {
		post("rest/trainings/add", (req, res) -> {
			res.type("application/json");
			Training training = g.fromJson(req.body(), Training.class);
			trainingService.addTraining(training);
			return "SUCCESS";
		});
	}
	
	public static void editTraining() {
		put("rest/trainings/edit/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			Training training = g.fromJson(req.body(), Training.class);
			trainingService.editTraining(id, training);
			return "SUCCESS";
		});
	}
	
	public static void deleteTraining() {
		delete("rest/trainings/delete/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			trainingService.deleteTraining(id);
			return "SUCCESS";
		});
	}
	
	public static void uploadLogo() {
		post("rest/trainings/upload", "multipart/form-data", (request, response) -> {
			String location = "./static/images";  // the directory location where files will be stored
			long maxFileSize = 100000000;  // the maximum size allowed for uploaded files
			long maxRequestSize = 100000000;  // the maximum size allowed for multipart/form-data requests
			int fileSizeThreshold = 1024;  // the size threshold after which files will be written to disk
			MultipartConfigElement multipartConfigElement = new MultipartConfigElement(location, maxFileSize, maxRequestSize, fileSizeThreshold);
			request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);
			
			String fName = request.raw().getPart("uploaded_file").getSubmittedFileName();
			
			
			Part uploadedFile = request.raw().getPart("uploaded_file");
			Path out = Paths.get("./static/images/trainings/"+fName);
			
			int i = 0;
			String[] fname = fName.split("\\.");
			while(out.toFile().exists()) {
				i++;
				out = Paths.get("./static/images/trainings/"+fname[0]+i+"."+fname[1]);
			}
			try (final InputStream in = uploadedFile.getInputStream()) {
				Files.copy(in, out);
				uploadedFile.delete();
			}
			multipartConfigElement = null;
			uploadedFile = null;
			
			if (i != 0)
				fName = fname[0]+i+"."+fname[1];
			
			return "./images/trainings/" + fName;
		});
	}
}
