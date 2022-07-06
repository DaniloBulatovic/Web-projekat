package rest;

import static spark.Spark.port;
import static spark.Spark.staticFiles;

import java.io.File;

import controller.CommentController;
import controller.MembershipController;
import controller.SportsVenueController;
import controller.TrainingController;
import controller.TrainingHistoryController;
import controller.UserController;

public class SparkAppMain {
	
	public static void main(String[] args) throws Exception {
		port(8081);

		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		initializeControllers();
	}
	
	public static void initializeControllers() {
		SportsVenueController.initializeController();
		UserController.initializeController();
		TrainingController.initializeController();
		CommentController.initializeController();
		TrainingHistoryController.initializeController();
		MembershipController.initializeController();
	}
}
