package controller;

import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import com.google.gson.Gson;

import beans.SportsVenue;
import services.SportsVenueService;

public class SportsVenueController {
	
	private static Gson g = new Gson();
	private static SportsVenueService sportsVenueService = new SportsVenueService();
	
	public static void initializeController() {
		getSportsVenues();
		getSportsVenue();
		addSportsVenue();
		editSportsVenue();
		deleteSportsVenue();
		uploadLogo();
	}
	
	public static void getSportsVenues() {
		get("rest/venues/", (req, res) -> {
			res.type("application/json");
			return g.toJson(sportsVenueService.getSportsVenues());
		});
	}
	
	public static void getSportsVenue() {
		get("rest/venues/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(sportsVenueService.getSportsVenue(id));
		});
	}
	
	public static void addSportsVenue() {
		post("rest/venues/add", (req, res) -> {
			res.type("application/json");
			SportsVenue sv = g.fromJson(req.body(), SportsVenue.class);
			sportsVenueService.addSportsVenue(sv);
			return "SUCCESS";
		});
	}
	
	public static void editSportsVenue() {
		put("rest/venues/edit/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			SportsVenue sv = g.fromJson(req.body(), SportsVenue.class);
			sportsVenueService.editSportsVenue(id, sv);
			return "SUCCESS";
		});
	}
	
	public static void deleteSportsVenue() {
		delete("rest/venues/delete/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			sportsVenueService.deleteSportsVenue(id);
			return "SUCCESS";
		});
	}
	
	public static void uploadLogo() {
		post("rest/venue/upload", "multipart/form-data", (request, response) -> {
			String location = "./static/images";  // the directory location where files will be stored
			long maxFileSize = 100000000;  // the maximum size allowed for uploaded files
			long maxRequestSize = 100000000;  // the maximum size allowed for multipart/form-data requests
			int fileSizeThreshold = 1024;  // the size threshold after which files will be written to disk
			MultipartConfigElement multipartConfigElement = new MultipartConfigElement(location, maxFileSize, maxRequestSize, fileSizeThreshold);
			request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement);
			
			String fName = request.raw().getPart("uploaded_file").getSubmittedFileName();
			
			
			Part uploadedFile = request.raw().getPart("uploaded_file");
			Path out = Paths.get("./static/images/venues/"+fName);
			
			int i = 0;
			String[] fname = fName.split("\\.");
			while(out.toFile().exists()) {
				i++;
				out = Paths.get("./static/images/venues/"+fname[0]+i+"."+fname[1]);
			}
			try (final InputStream in = uploadedFile.getInputStream()) {
				Files.copy(in, out);
				uploadedFile.delete();
			}
			multipartConfigElement = null;
			uploadedFile = null;
			
			fName = fname[0]+i+"."+fname[1];
			return "./images/venues/" + fName;
		});
	}
}
