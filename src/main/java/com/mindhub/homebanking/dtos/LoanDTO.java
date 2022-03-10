package com.mindhub.homebanking.dtos;

import com.mindhub.homebanking.models.Loan;

import java.util.List;

public class LoanDTO {

    private long id;
    private String name;
    private double maxAmount;
    private int percentage;
    private List<Integer> dues;

    public LoanDTO (Loan loan) {
        this.id = loan.getId();
        this.name = loan.getName();
        this.maxAmount = loan.getMaxAmount();
        this.percentage = loan.getPercentage();
        this.dues = loan.getDues();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getMaxAmount() {
        return maxAmount;
    }

    public void setMaxAmount(double maxAmount) {
        this.maxAmount = maxAmount;
    }

    public int getPercentage() {
        return percentage;
    }

    public List<Integer> getDues() {
        return dues;
    }

    public void setDues(List<Integer> dues) {
        this.dues = dues;
    }
}
