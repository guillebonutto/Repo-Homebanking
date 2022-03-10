package com.mindhub.homebanking.dtos;

public class PostnetApplicationDTO {

    private String cardNumber;
    private int cvv;
    private Double amount;
    private String description;
    private String destiny;

    public PostnetApplicationDTO() {
    }

    public PostnetApplicationDTO(String cardNumber, int cvv, Double amount, String description, String destiny) {
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.amount = amount;
        this.description = description;
        this.destiny = destiny;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public int getCvv() {
        return cvv;
    }

    public void setCvv(int cvv) {
        this.cvv = cvv;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDestiny() {
        return destiny;
    }

    public void setDestiny(String destiny) {
        this.destiny = destiny;
    }
}
