package beans;

import java.time.LocalDateTime;

public class TrainingHistory {

	private String id;
	private LocalDateTime dateTimeOfRegistration;
	private Training training;
	private User customer;
	private User trainer;
	private boolean isDeleted;
	
	public TrainingHistory() {
	
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public LocalDateTime getDateTimeOfRegistration() {
		return dateTimeOfRegistration;
	}

	public void setDateTimeOfRegistration(LocalDateTime dateTimeOfRegistration) {
		this.dateTimeOfRegistration = dateTimeOfRegistration;
	}

	public Training getTraining() {
		return training;
	}

	public void setTraining(Training training) {
		this.training = training;
	}

	public User getCustomer() {
		return customer;
	}

	public void setCustomer(User customer) {
		this.customer = customer;
	}

	public User getTrainer() {
		return trainer;
	}

	public void setTrainer(User trainer) {
		this.trainer = trainer;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}
}
