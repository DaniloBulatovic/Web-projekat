package rest;

import static spark.Spark.port;
import static spark.Spark.staticFiles;

import java.io.File;

import controller.SportsVenueController;
import controller.UserController;

public class SparkAppMain {
	
	public static void main(String[] args) throws Exception {
		port(8080);

		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		initializeControllers();
	}
	
	public static void initializeControllers() {
		SportsVenueController.initializeController();
		UserController.initializeController();
	}
}
