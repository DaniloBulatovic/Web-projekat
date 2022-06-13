package rest;

import static spark.Spark.port;
import static spark.Spark.staticFiles;
import java.io.File;
import controller.SportsVenueController;

public class SparkAppMain {
	
	public static void main(String[] args) throws Exception {
		port(8080);

		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		InitializeSportsVenueController();
	}
	
	public static void InitializeSportsVenueController() {
		SportsVenueController.getSportsVenues();
		SportsVenueController.getSportsVenue();
		SportsVenueController.addSportsVenue();
		SportsVenueController.editSportsVenue();
		SportsVenueController.deleteSportsVenue();
	}
}
