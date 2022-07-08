package services;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.stream.Collectors;

import beans.TrainingHistory;
import repository.SportsVenues;
import repository.TrainingsHistory;
import repository.Users;

public class TrainingHistoryService {
	
	private TrainingsHistory trainingsHistory = new TrainingsHistory();
	
	public Collection<TrainingHistory> getTrainingsHistory() {
		Users users = new Users();
		SportsVenues sportsVenues = new SportsVenues();
		return trainingsHistory.getValues().stream().filter(
				trainingHistory -> (users.getUser(trainingHistory.getCustomer().getId()) != null)
				&& (users.getUser(trainingHistory.getTrainer().getId()) != null)
				&& (sportsVenues.getSportsVenue(trainingHistory.getTraining().getSportsVenue().getId()) != null)
				).collect(Collectors.toCollection(HashSet::new));
	}
	
	public Collection<TrainingHistory> getTrainingsHistoryByCustomer(String id){
		Users users = new Users();
		SportsVenues sportsVenues = new SportsVenues();
		return trainingsHistory.getValues().stream().filter(
				trainingHistory -> trainingHistory.getCustomer().getId().equals(id)
				&& (trainingHistory.getDateTimeOfTraining().plusMonths(1).plusDays(1).isAfter(LocalDateTime.now()))
				&& (users.getUser(id) != null)
				&& (sportsVenues.getSportsVenue(trainingHistory.getTraining().getSportsVenue().getId()) != null)
				&& (users.getUser(trainingHistory.getTrainer().getId()) != null)
				).collect(Collectors.toCollection(HashSet::new));
	}
	
	public Collection<TrainingHistory> getTrainingsHistoryByTrainer(String id){
		Users users = new Users();
		SportsVenues sportsVenues = new SportsVenues();
		return trainingsHistory.getValues().stream().filter(
				trainingHistory -> trainingHistory.getTrainer().getId().equals(id)
				&& (users.getUser(id) != null)
				&& (sportsVenues.getSportsVenue(trainingHistory.getTraining().getSportsVenue().getId()) != null)
				&& (users.getUser(trainingHistory.getCustomer().getId()) != null)
				).collect(Collectors.toCollection(HashSet::new));
	}
	
	public Collection<TrainingHistory> getTrainingsHistoryByVenue(String id){
		Users users = new Users();
		SportsVenues sportsVenues = new SportsVenues();
		return trainingsHistory.getValues().stream().filter(
				trainingHistory -> trainingHistory.getTraining().getSportsVenue().getId().equals(id)
				&& (sportsVenues.getSportsVenue(id) != null)
				&& (users.getUser(trainingHistory.getCustomer().getId()) != null)
				&& (users.getUser(trainingHistory.getTrainer().getId()) != null)
				).collect(Collectors.toCollection(HashSet::new));
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
