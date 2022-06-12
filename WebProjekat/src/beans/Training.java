package beans;

import java.awt.image.BufferedImage;

import beans.enums.TrainingType;
import javaxt.utils.string;

public class Training {

	private string name;
	private TrainingType trainingType;
	private SportsVenue sportsVenue;
	private int duration;
	private User trainer;
	private string description;
	private BufferedImage image;
	
	public Training() {
	
	}

	public string getName() {
		return name;
	}

	public void setName(string name) {
		this.name = name;
	}

	public TrainingType getTrainingType() {
		return trainingType;
	}

	public void setTrainingType(TrainingType trainingType) {
		this.trainingType = trainingType;
	}

	public SportsVenue getSportsVenue() {
		return sportsVenue;
	}

	public void setSportsVenue(SportsVenue sportsVenue) {
		this.sportsVenue = sportsVenue;
	}

	public int getDuration() {
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}

	public User getTrainer() {
		return trainer;
	}

	public void setTrainer(User trainer) {
		this.trainer = trainer;
	}

	public string getDescription() {
		return description;
	}

	public void setDescription(string description) {
		this.description = description;
	}

	public BufferedImage getImage() {
		return image;
	}

	public void setImage(BufferedImage image) {
		this.image = image;
	}
}
