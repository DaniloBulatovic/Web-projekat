package services;

import java.util.Collection;
import java.util.HashSet;
import java.util.stream.Collectors;

import beans.Training;
import repository.Trainings;

public class TrainingService {
	
	private Trainings trainings = new Trainings();
	
	public Collection<Training> getTrainings() {
		return trainings.getValues();
	}
	
	public Collection<Training> getTrainingsByVenue(String id){
		return trainings.getValues().stream().filter(training -> training.getSportsVenue().getId().equals(id)).collect(Collectors.toCollection(HashSet::new));
	}
	
	public Training getTraining(String id) {
		return trainings.getTraining(id);
	}
	
	public void addTraining(Training training) {
		trainings.addTraining(training);
	}

	public void editTraining(String id, Training training) {
		trainings.edit(id, training);
	}

	public void deleteTraining(String id) {
		trainings.delete(id);
	}
}
