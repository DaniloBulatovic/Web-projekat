package services;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.stream.Collectors;

import beans.PromoCode;
import repository.PromoCodes;

public class PromoCodeService {
	
	private PromoCodes promoCodes = new PromoCodes();
	
	public Collection<PromoCode> getPromoCodes() {
		return promoCodes.getValues();
	}
	
	public PromoCode getPromoCode(String id) {
		return promoCodes.getPromoCode(id);
	}
	
	public PromoCode getPromoCodeByCode(String code) {
		return (PromoCode) promoCodes.getValues().stream().filter(promoCode -> promoCode.getCode().equals(code) && promoCode.getAmount() > 0 && promoCode.getExpirationDate().plusDays(1).isAfter(LocalDateTime.now())).collect(Collectors.toCollection(HashSet::new)).toArray()[0];
	}
	
	public void addPromoCode(PromoCode promoCode) {
		promoCodes.addPromoCode(promoCode);
	}

	public void editPromoCode(String id, PromoCode promoCode) {
		promoCodes.edit(id, promoCode);
	}

	public void deletePromoCode(String id) {
		promoCodes.delete(id);
	}
}
