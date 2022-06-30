package beans;

import beans.enums.TrainingType;

public class Training {

	private String id;
	private String name;
	private TrainingType trainingType;
	private SportsVenue sportsVenue;
	private int duration;
	private User trainer;
	private String description;
	private String image;
	private double price;
	
	public Training() {
	
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
}
