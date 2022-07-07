package services;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.stream.Collectors;

import beans.TrainingHistory;
import beans.TrainingsHistory;

public class TrainingHistoryService {
	
	private TrainingsHistory trainingsHistory = new TrainingsHistory();
	
	public Collection<TrainingHistory> getTrainingsHistory() {
		return trainingsHistory.getValues();
	}
	
	public Collection<TrainingHistory> getTrainingsHistoryByCustomer(String id){
		return trainingsHistory.getValues().stream().filter(trainingHistory -> trainingHistory.getCustomer().getId().equals(id) && (trainingHistory.getDateTimeOfTraining().plusMonths(1).plusDays(1).isAfter(LocalDateTime.now()))).collect(Collectors.toCollection(HashSet::new));
	}
	
	public Collection<TrainingHistory> getTrainingsHistoryByTrainer(String id){
		return trainingsHistory.getValues().stream().filter(trainingHistory -> trainingHistory.getTrainer().getId().equals(id)).collect(Collectors.toCollection(HashSet::new));
	}
	
	public Collection<TrainingHistory> getTrainingsHistoryByVenue(String id){
		return trainingsHistory.getValues().stream().filter(trainingHistory -> trainingHistory.getTraining().getSportsVenue().getId().equals(id)).collect(Collectors.toCollection(HashSet::new));
	}
	
	public TrainingHistory getTrainingHistory(String id) {
		return trainingsHistory.getTrainingHistory(id);
	}
	
	public void addTrainingHistory(TrainingHistory trainingHistory) {
		trainingsHistory.addTrainingHistory(trainingHistory);
	}

	public void editTrainingHistory(String id, TrainingHistory trainingHistory) {
		trainingsHistory.edit(id, trainingHistory);
	}

	public void deleteTrainingHistory(String id) {
		trainingsHistory.delete(id);
	}
}
